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

  style?: ViewStyle;
  forceSingleColor?: boolean;
  showActiveDot?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
  forceSingleColor = true,     
  showActiveDot = true,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={styles.navigation}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const iconName =
            isActive && tab.activeIcon ? tab.activeIcon : tab.icon;

          const iconColor = forceSingleColor
            ? COLORS.base
            : isActive
            ? COLORS.base
            : COLORS.textSecondary;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.8}
            >
              <View style={styles.tabContent}>
                <Ionicons name={iconName} size={23} color={iconColor} />
                {showActiveDot && isActive && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
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
});
