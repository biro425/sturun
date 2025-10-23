# Sturun App

React Native와 Expo Go를 사용하여 개발된 모바일 앱입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- Expo Go 앱 (모바일 디바이스에 설치)
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS만)

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 시작:
```bash
npm start
```

3. Expo Go 앱에서 QR 코드를 스캔하여 앱 실행

### 사용 가능한 스크립트

- `npm start` - Expo 개발 서버 시작
- `npm run android` - Android 에뮬레이터에서 실행
- `npm run ios` - iOS 시뮬레이터에서 실행 (macOS만)
- `npm run web` - 웹 브라우저에서 실행
- `npm run build:android` - Android APK 빌드
- `npm run build:ios` - iOS 앱 빌드
- `npm run lint` - 코드 린팅
- `npm run type-check` - TypeScript 타입 체크

## 📱 Expo Go 사용법

1. [Expo Go](https://expo.dev/client) 앱을 모바일 디바이스에 설치
2. 개발 서버를 시작한 후 나타나는 QR 코드를 스캔
3. 앱이 자동으로 로드됩니다

## 🏗️ 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── screens/        # 화면 컴포넌트
├── utils/          # 유틸리티 함수 및 상수
└── types/          # TypeScript 타입 정의
```

## 🛠️ 개발 도구

- **Expo SDK 54** - 크로스 플랫폼 개발
- **React Native 0.81** - 네이티브 앱 개발
- **TypeScript** - 타입 안전성
- **Expo Router** - 네비게이션 (설정됨)

## 📦 주요 패키지

- `expo` - Expo SDK
- `expo-router` - 파일 기반 라우팅
- `expo-constants` - 앱 상수
- `expo-linking` - 딥링크 처리
- `@expo/vector-icons` - 아이콘
- `react-native-safe-area-context` - 안전 영역 처리

## 🔧 설정

앱 설정은 `app.json` 파일에서 관리됩니다. 주요 설정:

- 앱 이름: "Sturun App"
- 번들 ID: com.sturun.app
- 지원 플랫폼: iOS, Android, Web

## 📝 개발 가이드

1. 새로운 화면을 추가하려면 `src/screens/`에 컴포넌트 생성
2. 재사용 가능한 컴포넌트는 `src/components/`에 생성
3. 상수와 유틸리티는 `src/utils/`에 추가
4. TypeScript 타입은 `src/types/`에 정의

## 🚀 배포

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
