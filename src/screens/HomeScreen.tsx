import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../utils/constants';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="footsteps" size={24} color={COLORS.surface} />
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>환영합니다, 김선민님</Text>
              <Text style={styles.dateText}>오늘은 날씨는 맑음입니다!</Text>
            </View>
            <View style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={20} color={COLORS.text} />
              </View>
            </View>
          </View>
        </View>

        {/* 메인 배너 섹션 */}
        <View style={styles.bannerSection}>
          <View style={styles.mainBanner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>2025 RUNNING</Text>
              <Text style={styles.bannerTitle}>FESTIVAL</Text>
            </View>
            <View style={styles.bannerRight}>
              <View style={styles.bannerIcon}>
                <Ionicons name="trophy" size={40} color={COLORS.surface} />
              </View>
            </View>
            <View style={styles.bannerBottom}>
              <View style={styles.bannerBottomLeft}>
                <Ionicons name="people" size={16} color={COLORS.surface} />
                <Text style={styles.bannerBottomText}>4000+ 사람들 참여함</Text>
              </View>
              <View style={styles.bannerBottomRight}>
                <Text style={styles.bannerBottomText}>2025.10.05 - 11.05</Text>
              </View>
            </View>
          </View>
          <View style={styles.pagination}>
            <View style={[styles.paginationDot, styles.activeDot]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>

        {/* Your States 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>나의 상태</Text>
          <View style={styles.statesContainer}>
            <View style={styles.mainStateCard}>
              <View style={styles.stateCardHeader}>
                <Text style={styles.stateNumber}>105</Text>
                {/* <Text style={styles.stateTitle}>10월 2주차 주간 활동 레이팅</Text> */}
                <Ionicons name="footsteps" size={20} color={COLORS.surface} />
              </View>
              <View style={styles.stateInfo}>
                <Text style={styles.stateInfoText}>평균 심박수: 80 bpm</Text>
                <Text style={styles.stateInfoText}>러닝거리: 87 Km</Text>
                <Text style={styles.stateInfoText}>총 토큰: 100 Tok.</Text>
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>주간 목표치</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '80%' }]} />
                </View>
                <Text style={styles.progressText}>80% 완료</Text>
              </View>
            </View>
            <View style={styles.sideCards}>
              <View style={styles.sideCard}>
                <View style={styles.sideCardHeader}>
                  <Text style={styles.sideCardTitle}>CREW</Text>
                  <View style={styles.notificationDot} />
                </View>
                <Text style={styles.sideCardText}>현재 10명 이상의 크루가 당신을 기다리고 있습니다.</Text>
              </View>
              <View style={styles.sideCard}>
                <View style={styles.sideCardHeader}>
                  <Text style={styles.sideCardTitle}>MISSION</Text>
                  <View style={styles.notificationDot} />
                </View>
                <Text style={styles.sideCardText}>지금 바로 시도할 수 있는 미션이 있습니다.</Text>
                <View style={styles.missionProgress}>
                  <View style={[styles.missionProgressFill, { width: '60%' }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Crew 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>러닝 크루</Text>
          <View style={styles.crewContainer}>
            <View style={styles.crewCard}>
              <View style={styles.crewCardContent}>
                <Text style={styles.crewTitle}>달사모(달리기를 사랑하는 사람들의 모임)</Text>
                <Text style={styles.crewCount}>402/500</Text>
                <View style={styles.hashtagContainer}>
                  <Text style={styles.hashtag}>#진부한_이름_열정은 만땅</Text>
                  <Text style={styles.hashtag}>#취미</Text>
                  <Text style={styles.hashtag}>#모두모여요</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
            <View style={styles.crewCard}>
              <View style={styles.crewCardContent}>
                <Text style={styles.crewTitle}>디자이너가 늦어서 개발하기 힘든 개발자들은 달린다</Text>
                <Text style={styles.crewCount}>404/500</Text>
                <View style={styles.hashtagContainer}>
                  <Text style={styles.hashtag}>#송리안_수령_사랑해요</Text>
                  <Text style={styles.hashtag}>#행복한_개발</Text>
                  <Text style={styles.hashtag}>#공룡은_살아있다</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
            <TouchableOpacity style={styles.addCrewButton}>
              <Ionicons name="add" size={24} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HOT Spot 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOT Spot</Text>
          <View style={styles.hotSpotCard}>
            <View style={styles.hotSpotContent}>
              <Text style={styles.hotSpotTitle}>KAIST → 대신고등학교/LEVEL. 3</Text>
              <View style={styles.hotSpotStats}>
                <Ionicons name="heart" size={16} color={COLORS.red} />
                <Text style={styles.hotSpotLikes}>500+ Likes</Text>
              </View>
              <View style={styles.hashtagContainer}>
                <Text style={styles.hashtag}>#가을을_기다린_당신</Text>
                <Text style={styles.hashtag}>#시원함</Text>
                <Text style={styles.hashtag}>#멋진_경관</Text>
              </View>
            </View>
            <View style={styles.hotSpotIcon}>
              <Ionicons name="footsteps" size={24} color={COLORS.base} />
            </View>
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
    paddingBottom: 100, // 하단 네비게이션을 위한 여백
  },
  
  // 헤더 스타일
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  welcomeContainer: {
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.base,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 배너 스타일
  bannerSection: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  mainBanner: {
    backgroundColor: COLORS.purple,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    position: 'relative',
    height: 180,
  },
  bannerLeft: {
    position: 'absolute',
    left: SIZES.lg,
    top: SIZES.lg,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
    lineHeight: 28,
  },
  bannerRight: {
    position: 'absolute',
    right: SIZES.lg,
    top: SIZES.lg,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: SIZES.lg,
    left: SIZES.lg,
    right: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
  },
  bannerBottomRight: {
    alignItems: 'flex-end',
  },
  bannerBottomText: {
    fontSize: 12,
    color: COLORS.surface,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textSecondary,
  },
  activeDot: {
    backgroundColor: COLORS.base,
  },

  // 섹션 스타일
  section: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },

  // Your States 스타일
  statesContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  mainStateCard: {
    flex: 0.7,
    backgroundColor: COLORS.base,
    borderRadius: 10,
    padding: SIZES.xs,
  },
  stateCardHeader: {
    flexDirection: 'row',
    padding: SIZES.xs,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  stateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  stateTitle: {
    fontSize: 15,
    color: COLORS.surface,
    flex: 1,
    marginHorizontal: SIZES.xs,
  },
  stateInfo: {
    marginBottom: SIZES.sm,
  },
  stateInfoText: {
    padding: SIZES.xs,
    paddingBottom: 0,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: SIZES.xs,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '90%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: SIZES.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.surface,
  },
  sideCards: {
    flex: 0.8,
    gap: SIZES.sm,
  },
  sideCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SIZES.sm,
    flex: 1,
  },
  sideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  sideCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  sideCardText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
  },
  missionProgress: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginTop: SIZES.xs,
  },
  missionProgressFill: {
    height: '100%',
    backgroundColor: COLORS.base,
    borderRadius: 2,
  },

  // Crew 스타일
  crewContainer: {
    gap: SIZES.md,
  },
  crewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crewCardContent: {
    flex: 1,
  },
  crewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  crewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
  },
  hashtag: {
    fontSize: 10,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addCrewButton: {
    backgroundColor: COLORS.base,
    borderRadius: 12,
    padding: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // HOT Spot 스타일
  hotSpotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotSpotContent: {
    flex: 1,
  },
  hotSpotTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  hotSpotStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    marginBottom: SIZES.xs,
  },
  hotSpotLikes: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  hotSpotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
