import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../utils/constants';

interface HistoryItem {
  id: string;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  transportMode: 'walking' | 'cycling' | 'driving';
  score: number;
}

export const HistoryScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const historyData: HistoryItem[] = [
    {
      id: '1',
      date: '2024-01-20',
      startLocation: '강남역',
      endLocation: '홍대입구역',
      distance: 12.5,
      duration: 45,
      transportMode: 'cycling',
      score: 85,
    },
    {
      id: '2',
      date: '2024-01-19',
      startLocation: '집',
      endLocation: '회사',
      distance: 8.2,
      duration: 25,
      transportMode: 'driving',
      score: 72,
    },
    {
      id: '3',
      date: '2024-01-18',
      startLocation: '서울역',
      endLocation: '명동',
      distance: 3.1,
      duration: 35,
      transportMode: 'walking',
      score: 95,
    },
  ];

  const filters = [
    { id: 'all', title: '전체' },
    { id: 'today', title: '오늘' },
    { id: 'week', title: '이번 주' },
    { id: 'month', title: '이번 달' },
  ] as const;

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'walking':
        return 'walk';
      case 'cycling':
        return 'bicycle';
      case 'driving':
        return 'car';
      default:
        return 'car';
    }
  };

  const getTransportColor = (mode: string) => {
    switch (mode) {
      case 'walking':
        return COLORS.success;
      case 'cycling':
        return COLORS.primary;
      case 'driving':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return COLORS.success;
    if (score >= 70) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>기록</Text>
          <Text style={styles.subtitle}>나의 이동 기록을 확인하세요</Text>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.id && styles.selectedFilterButton,
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === filter.id && styles.selectedFilterButtonText,
                    ]}
                  >
                    {filter.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>총 이동 횟수</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>125.3km</Text>
            <Text style={styles.statLabel}>총 거리</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8.5시간</Text>
            <Text style={styles.statLabel}>총 시간</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>이동 기록</Text>
          {historyData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.historyItem}
              activeOpacity={0.7}
            >
              <View style={styles.historyHeader}>
                <View style={styles.transportInfo}>
                  <Ionicons
                    name={getTransportIcon(item.transportMode) as any}
                    size={20}
                    color={getTransportColor(item.transportMode)}
                  />
                  <Text style={styles.transportModeText}>
                    {item.transportMode === 'walking' ? '도보' :
                     item.transportMode === 'cycling' ? '자전거' : '자동차'}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreText, { color: getScoreColor(item.score) }]}>
                    {item.score}점
                  </Text>
                </View>
              </View>

              <View style={styles.routeInfo}>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={COLORS.success}
                  />
                  <Text style={styles.locationText}>{item.startLocation}</Text>
                </View>
                <View style={styles.arrowRow}>
                  <Ionicons
                    name="arrow-down"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                </View>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={COLORS.error}
                  />
                  <Text style={styles.locationText}>{item.endLocation}</Text>
                </View>
              </View>

              <View style={styles.historyFooter}>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailText}>{item.distance}km</Text>
                  <Text style={styles.detailLabel}>거리</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailText}>{item.duration}분</Text>
                  <Text style={styles.detailLabel}>시간</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailText}>{item.date}</Text>
                  <Text style={styles.detailLabel}>날짜</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  filterContainer: {
    marginBottom: SIZES.lg,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.sm,
  },
  filterButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    marginHorizontal: SIZES.xs,
    borderRadius: SIZES.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  selectedFilterButtonText: {
    color: COLORS.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  historyContainer: {
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  transportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportModeText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  scoreContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.sm,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
  routeInfo: {
    marginBottom: SIZES.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  locationText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  arrowRow: {
    alignItems: 'center',
    marginVertical: SIZES.xs,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailInfo: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});
