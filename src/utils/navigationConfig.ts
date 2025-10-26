import { TabItem } from '../components/BottomNavigation';

export const NAVIGATION_TABS: TabItem[] = [
  {
    id: 'route',
    title: '러닝',
    icon: 'footsteps-outline',
    activeIcon: 'footsteps',
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
    id: 'community',
    title: '커뮤니티',
    icon: 'people-outline',
    activeIcon: 'people',
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
