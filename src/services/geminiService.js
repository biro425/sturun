const GEMINI_API_KEY = 'AIzaSyAG7kTqnsO0x3C2YSPPAXmKyMgm68Ouf08';

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
  async getAvailableModel() {
    // 사용 가능한 모델 목록 (우선순위 순서)
    const models = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        // 간단한 헤드 체크로 모델 사용 가능 여부 확인
        const testRes = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'test' }] }],
          }),
        });
        
        // 404가 아니면 모델 사용 가능
        if (testRes.status !== 404) {
          console.log('사용 가능한 모델:', model);
          return model;
        }
      } catch (e) {
        // 다음 모델 시도
        continue;
      }
    }
    
    // 모두 실패하면 기본값 반환
    console.warn('모든 모델 시도 실패, gemini-pro 사용');
    return 'gemini-pro';
  }

  async getLandmarkRecommendations(preferences) {
    try {
      const prompt = this.buildPrompt(preferences);
      const model = await this.getAvailableModel();
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(endpoint, {
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

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No content generated from Gemini API');
      }

      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.warn('Gemini API 호출 실패 (429 Quota 또는 기타 에러), 기본 랜드마크 반환');
      // Gemini API 쿼터 초과 시 기본 랜드마크를 안전하게 반환
      return this.getDefaultLandmarks();
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
