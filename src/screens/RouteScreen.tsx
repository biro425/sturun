import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../utils/constants';
import { Button } from '../components/Button';

export const RouteScreen: React.FC = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [selectedMode, setSelectedMode] = useState<'walking' | 'cycling' | 'driving'>('walking');

  const transportModes = [
    { id: 'walking', title: '도보', icon: 'walk' },
    { id: 'cycling', title: '자전거', icon: 'bicycle' },
    { id: 'driving', title: '자동차', icon: 'car' },
  ] as const;

  const handleStartLocationPress = () => {
    console.log('출발지 선택');
  };

  const handleEndLocationPress = () => {
    console.log('도착지 선택');
  };

  const handleRouteSearch = () => {
    console.log('경로 검색:', { startLocation, endLocation, selectedMode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>경로 설정</Text>
          <Text style={styles.subtitle}>최적의 경로를 찾아보세요</Text>
        </View>

        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationInput}
            onPress={handleStartLocationPress}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons
                name="location"
                size={20}
                color={COLORS.success}
              />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>출발지</Text>
              <Text style={styles.locationText}>
                {startLocation || '출발지를 선택하세요'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.arrowContainer}>
            <Ionicons
              name="arrow-down"
              size={24}
              color={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={styles.locationInput}
            onPress={handleEndLocationPress}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons
                name="location"
                size={20}
                color={COLORS.error}
              />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>도착지</Text>
              <Text style={styles.locationText}>
                {endLocation || '도착지를 선택하세요'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.transportContainer}>
          <Text style={styles.sectionTitle}>이동 수단</Text>
          <View style={styles.transportModes}>
            {transportModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.transportMode,
                  selectedMode === mode.id && styles.selectedTransportMode,
                ]}
                onPress={() => setSelectedMode(mode.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={mode.icon as any}
                  size={24}
                  color={selectedMode === mode.id ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.transportModeText,
                    selectedMode === mode.id && styles.selectedTransportModeText,
                  ]}
                >
                  {mode.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Button
            title="경로 검색"
            onPress={handleRouteSearch}
            variant="primary"
            size="large"
            disabled={!startLocation || !endLocation}
          />
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>빠른 설정</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => console.log('현재 위치로 설정')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="locate"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.quickActionText}>현재 위치</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => console.log('집으로 설정')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="home"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.quickActionText}>집</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => console.log('회사로 설정')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="business"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.quickActionText}>회사</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.lg,
    paddingBottom: SIZES.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  locationContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  locationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  locationText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  transportContainer: {
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  transportModes: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.sm,
  },
  transportMode: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
  },
  selectedTransportMode: {
    backgroundColor: COLORS.primary,
  },
  transportModeText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  selectedTransportModeText: {
    color: COLORS.surface,
  },
  searchContainer: {
    marginBottom: SIZES.lg,
  },
  quickActionsContainer: {
    marginBottom: SIZES.lg,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginTop: SIZES.xs,
  },
});
