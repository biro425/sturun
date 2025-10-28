import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { RankingScreen } from './src/screens/RankingScreen';
import { RouteScreen } from './src/screens/RouteScreen';
import { CommunityScreen } from './src/screens/CommunityScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { AILandmarkScreen } from './src/screens/AILandmarkScreen';
import { BottomNavigation } from './src/components/BottomNavigation';
import { NAVIGATION_TABS } from './src/utils/navigationConfig';
import { COLORS } from './src/utils/constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAILandmark, setShowAILandmark] = useState(false);

  const handleNavigateToLogin = () => {
    setActiveTab('login');
  };

  const handleAILandmarkPress = () => {
    setShowAILandmark(true);
  };

  const handleCloseAILandmark = () => {
    setShowAILandmark(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'ranking':
        return <RankingScreen />;
      case 'route':
        return <RouteScreen />;
      case 'community':
        return <CommunityScreen />;
      case 'profile':
        return <ProfileScreen onNavigateToLogin={handleNavigateToLogin} />;
      case 'login':
        return <LoginScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {showAILandmark ? (
          <AILandmarkScreen onClose={handleCloseAILandmark} />
        ) : (
          renderScreen()
        )}
      </View>
      {activeTab !== 'login' && !showAILandmark && (
        <BottomNavigation
          tabs={NAVIGATION_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onAILandmarkPress={handleAILandmarkPress}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
});
