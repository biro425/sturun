import React from 'react';
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

interface RankingItem {
  id: string;
  rank: number;
  name: string;
  score: number;
  avatar?: string;
}

export const RankingScreen: React.FC = () => {
  const rankingData: RankingItem[] = [
    { id: '1', rank: 1, name: '김철수', score: 1250 },
    { id: '2', rank: 2, name: '이영희', score: 1180 },
    { id: '3', rank: 3, name: '박민수', score: 1100 },
    { id: '4', rank: 4, name: '정수진', score: 950 },
    { id: '5', rank: 5, name: '최동현', score: 880 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return 'trophy';
      case 2:
        return 'medal';
      case 3:
        return 'medal';
      default:
        return 'person';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>랭킹</Text>
          <Text style={styles.subtitle}>전체 사용자 순위</Text>
        </View>

        <View style={styles.rankingContainer}>
          {rankingData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.rankingItem,
                item.rank <= 3 && styles.topRankingItem,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.rankContainer}>
                <Ionicons
                  name={getRankIcon(item.rank) as any}
                  size={24}
                  color={getRankColor(item.rank)}
                />
                <Text style={[styles.rankText, { color: getRankColor(item.rank) }]}>
                  {item.rank}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Ionicons
                    name="person"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.userName}>{item.name}</Text>
              </View>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{item.score.toLocaleString()}</Text>
                <Text style={styles.scoreLabel}>점</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.myRankingContainer}>
          <Text style={styles.myRankingTitle}>내 순위</Text>
          <View style={styles.myRankingItem}>
            <Text style={styles.myRankingText}>15위</Text>
            <Text style={styles.myRankingScore}>650점</Text>
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
  rankingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    marginBottom: SIZES.lg,
    overflow: 'hidden',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  topRankingItem: {
    backgroundColor: '#FFF8E1',
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: SIZES.md,
    minWidth: 40,
  },
  rankText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginTop: SIZES.xs,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  userName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  myRankingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
  },
  myRankingTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  myRankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myRankingText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  myRankingScore: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
});
