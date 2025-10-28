/**
 * API 설정 파일
 * JavaScript 파일로 작성
 */

export const API_CONFIG = {
  // 제미나이 API 설정
  GEMINI_API_KEY: 'AIzaSyD_E38oM4m7SoaVy-7v9L_BlcnaFvqUsf4', // 실제 API 키로 교체 필요
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  
  // 카카오맵 REST API 설정 (이제 사용하지 않음)
  KAKAO_MAP_BASE_URL: 'https://dapi.kakao.com/v2',
  
  // 위치 설정 (서울 기본값)
  DEFAULT_LOCATION: {
    latitude: 37.5665,
    longitude: 126.9780,
  },
};

/**
 * 제미나이 API 프롬프트 템플릿
 */
export const LANDMARK_PROMPT_TEMPLATE = `
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

/**
 * 카카오맵 API 엔드포인트
 */
export const KAKAO_ENDPOINTS = {
  SEARCH_PLACE: '/local/search/keyword.json',
  GET_COORDINATES: '/local/geo/coord2address.json',
  GET_ROUTE: '/local/search/category.json',
};
