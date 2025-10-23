import { TabItem } from '../components/BottomNavigation';

export const NAVIGATION_TABS: TabItem[] = [
  {
    id: 'route',
    title: '경로',
    icon: 'map-outline',
    activeIcon: 'map',
  },
  {
    id: 'ranking',
    title: '랭킹',
    icon: 'trophy-outline',
    activeIcon: 'trophy',
  },
  {
    id: 'home',
    title: '메인',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    id: 'history',
    title: '기록',
    icon: 'time-outline',
    activeIcon: 'time',
  },
  {
    id: 'profile',
    title: '프로필',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

export const getTabById = (id: string): TabItem | undefined => {
  return NAVIGATION_TABS.find(tab => tab.id === id);
};
