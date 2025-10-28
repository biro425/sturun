// BottomNavigation.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/constants';

export interface TabItem {
  id: string;
  title: string; 
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
}

interface BottomNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onAILandmarkPress?: () => void;

  style?: ViewStyle;
  forceSingleColor?: boolean;
  showActiveDot?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  activeTab,
  onTabPress,
  onAILandmarkPress,
  style,
  forceSingleColor = true,     
  showActiveDot = true,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={styles.navigation}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const iconName =
            isActive && tab.activeIcon ? tab.activeIcon : tab.icon;

          const iconColor = forceSingleColor
            ? COLORS.base
            : isActive
            ? COLORS.base
            : COLORS.textSecondary;

          return (
            <React.Fragment key={tab.id}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => onTabPress(tab.id)}
                activeOpacity={0.8}
              >
                <View style={styles.tabContent}>
                  <Ionicons name={iconName} size={23} color={iconColor} />
                  {showActiveDot && isActive && <View style={styles.dot} />}
                </View>
              </TouchableOpacity>
              
              {/* 중앙에 AI 랜드마크 버튼 추가 (홈 탭 다음에) */}
              {index === 2 && onAILandmarkPress && (
                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={onAILandmarkPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.aiButtonContent}>
                    <Ionicons name="sparkles" size={20} color={COLORS.surface} />
                  </View>
                </TouchableOpacity>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: COLORS.base,
    marginTop: 4,
  },
  aiButton: {
    position: 'absolute',
    top: -25,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.base,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
