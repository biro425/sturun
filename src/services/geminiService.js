import { GoogleGenerativeAI } from '@google/generative-ai';

// apiConfig.js 내용을 이 파일로 통합
const GEMINI_API_KEY = 'AIzaSyD_E38oM4m7SoaVy-7v9L_BlcnaFvqUsf4'; // 필요 시 환경변수로 교체

const LANDMARK_PROMPT_TEMPLATE = `
당신은 한국의 관광지와 랜드마크 전문가입니다. 
사용자의 취향과 선호도를 바탕으로 적절한 랜드마크를 추천해주세요.

사용자 정보:
- 나이: {age}
- 관심사: {interests}
- 선호하는 활동: {activities}
- 여행 스타일: {travelStyle}
- 예산: {budget}
- 위치: {location}

다음 형식으로 JSON 응답을 제공해주세요:
{
  "landmarks": [
    {
      "name": "랜드마크 이름",
      "description": "상세 설명",
      "category": "카테고리 (예: 문화, 자연, 역사, 쇼핑, 음식)",
      "latitude": 위도,
      "longitude": 경도,
      "rating": 평점 (1-5),
      "visitDuration": "예상 방문 시간 (분)",
      "priceLevel": "가격 수준 (1-4)",
      "tags": ["태그1", "태그2", "태그3"]
    }
  ],
  "route": {
    "totalDistance": "총 거리 (km)",
    "estimatedTime": "예상 소요 시간 (분)",
    "difficulty": "난이도 (쉬움/보통/어려움)"
  }
}

랜드마크는 3-5개 정도 추천하고, 사용자의 취향에 맞는 다양한 카테고리를 포함해주세요.
위치는 서울 지역을 중심으로 하되, 사용자가 다른 지역을 원한다면 해당 지역을 중심으로 해주세요.
`;

class GeminiService {
  constructor() {
    this.client = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.modelName = 'gemini-1.5-flash';
    this.model = this.client.getGenerativeModel({ model: this.modelName });
  }

  async getLandmarkRecommendations(preferences) {
    try {
      const prompt = this.buildPrompt(preferences);
      const result = await this.model.generateContent(prompt);
      const generatedText = result?.response?.text?.();

      if (!generatedText) {
        throw new Error('No content generated from Gemini API');
      }

      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (error) {
      // 모델 미지원/404면 모델 자동 탐색 후 한 번 더 SDK 재시도
      const isNotFound = /not found|NOT_FOUND|404/i.test(error?.message || '');
      if (isNotFound) {
        try {
          const discovered = await this.pickAvailableModel();
          if (discovered) {
            this.modelName = discovered;
            this.model = this.client.getGenerativeModel({ model: this.modelName });
            const prompt = this.buildPrompt(preferences);
            const retry = await this.model.generateContent(prompt);
            const retryText = retry?.response?.text?.();
            if (!retryText) throw new Error('No content generated after SDK retry');
            const jsonMatch = retryText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No valid JSON found after SDK retry');
            return JSON.parse(jsonMatch[0]);
          }
        } catch (retryErr) {
          console.warn('SDK retry with discovered model failed:', retryErr?.message || retryErr);
        }
      }

      console.warn('SDK call failed, trying HTTP fallback...', error?.message || error);
      try {
        const fallback = await this.generateViaHttp(preferences);
        return fallback;
      } catch (httpError) {
        console.error('HTTP fallback failed:', httpError);
        return this.getDefaultLandmarks();
      }
    }
  }

  async generateViaHttp(preferences) {
    const prompt = this.buildPrompt(preferences);
    let model = 'gemini-1.5-flash';
    let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const isNotFound = /NOT_FOUND|not found|404/.test(errText) || response.status === 404;
      if (isNotFound) {
        const discovered = await this.pickAvailableModel();
        if (!discovered) throw new Error(`HTTP 404 and no model discovered: ${errText}`);
        model = discovered;
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const retry = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        });
        if (!retry.ok) {
          const retryText = await retry.text().catch(() => '');
          throw new Error(`HTTP retry ${retry.status}: ${retryText}`);
        }
        const retryData = await retry.json();
        const retryTextOut = retryData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!retryTextOut) throw new Error('No content generated from HTTP retry');
        const jsonMatch = retryTextOut.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No valid JSON found in HTTP retry response');
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('No content generated from HTTP response');
    }

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in HTTP response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async pickAvailableModel() {
    try {
      const listEndpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
      const res = await fetch(listEndpoint);
      if (!res.ok) return null;
      const data = await res.json();
      const models = data?.models || [];
      // 우선순위: flash 최신, 그 다음 flash, 그 다음 pro 계열
      const prefer = [
        'flash',
        'pro',
      ];
      // generateContent 지원 여부 필터링
      const candidates = models.filter(m => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'));
      // 이름 기준 정렬
      const byPreference = (name) => prefer.findIndex(p => name.includes(p));
      candidates.sort((a, b) => (byPreference(a.name) - byPreference(b.name)));
      const picked = candidates[0]?.name || models[0]?.name;
      if (!picked) return null;
      // API는 model full name을 반환하므로 마지막 세그먼트만 사용
      const seg = picked.split('/').pop();
      return seg || null;
    } catch (e) {
      console.warn('Failed to list models:', e?.message || e);
      return null;
    }
  }

  buildPrompt(preferences) {
    return LANDMARK_PROMPT_TEMPLATE
      .replace('{age}', preferences?.age?.toString() || '20-30')
      .replace('{interests}', preferences?.interests?.join(', ') || '문화, 관광')
      .replace('{activities}', preferences?.activities?.join(', ') || '산책, 사진촬영')
      .replace('{travelStyle}', preferences?.travelStyle || '편안한')
      .replace('{budget}', preferences?.budget || '보통')
      .replace('{location}', preferences?.location || '서울');
  }

  getDefaultLandmarks() {
    return {
      landmarks: [
        {
          name: '경복궁',
          description: '조선 왕조의 대표적인 궁궐로 한국의 전통 건축미를 감상할 수 있습니다.',
          category: '역사',
          latitude: 37.5796,
          longitude: 126.9770,
          rating: 4.5,
          visitDuration: 90,
          priceLevel: 2,
          tags: ['역사', '문화', '궁궐']
        },
        {
          name: '남산타워',
          description: '서울의 전망을 한눈에 볼 수 있는 대표적인 관광지입니다.',
          category: '관광',
          latitude: 37.5512,
          longitude: 126.9882,
          rating: 4.3,
          visitDuration: 120,
          priceLevel: 3,
          tags: ['전망', '관광', '사진']
        },
        {
          name: '한강공원',
          description: '서울의 대표적인 휴식 공간으로 산책과 운동을 즐길 수 있습니다.',
          category: '자연',
          latitude: 37.5219,
          longitude: 126.9240,
          rating: 4.4,
          visitDuration: 60,
          priceLevel: 1,
          tags: ['자연', '산책', '운동']
        }
      ],
      route: {
        totalDistance: 8.5,
        estimatedTime: 180,
        difficulty: '보통'
      }
    };
  }
}

export const geminiService = new GeminiService();
