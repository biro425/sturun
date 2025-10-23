// 앱에서 사용할 타입 정의들
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};
