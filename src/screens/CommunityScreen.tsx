import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../utils/constants';

interface Post {
  id: string;
  user: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  type: 'running' | 'general';
  runningData?: {
    distance: number;
    time: string;
    calories: number;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  type: 'group' | 'individual';
}

export const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'chat' | 'mission'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postDistance, setPostDistance] = useState('');
  const [postTime, setPostTime] = useState('');
  const [postCalories, setPostCalories] = useState('');
  const [postType, setPostType] = useState<'general' | 'running'>('general');
  const [currentUser] = useState('내 프로필');
  const [isLoading, setIsLoading] = useState(true);
  
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: 'KAIST 러닝 크루',
      lastMessage: '내일 아침 러닝 같이 하실 분?',
      time: '10분 전',
      unread: 3,
      type: 'group',
    },
    {
      id: '2',
      name: '박스터디',
      lastMessage: '고마워요! 다음에 또 같이 달려요',
      time: '1시간 전',
      unread: 0,
      type: 'individual',
    },
    {
      id: '3',
      name: '대학원생 러닝 모임',
      lastMessage: '이번 주말 장거리 러닝 계획 세워봅시다',
      time: '2시간 전',
      unread: 1,
      type: 'group',
    },
  ]);

  const [studyTime, setStudyTime] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);

  useEffect(() => {
    loadPostsData();
  }, []);

  const formatTime = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return '방금 전';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;
    return `${Math.floor(seconds / 604800)}주 전`;
  };

  const loadPostsData = () => {
    // 초기 데이터 추가
    const defaultPosts: Post[] = [
      {
        id: '1',
        user: '김러너',
        content: '오늘 5km 완주! 🏃‍♂️',
        likes: 12,
        comments: 3,
        time: '2시간 전',
        type: 'running',
        runningData: {
          distance: 5.0,
          time: '25:30',
          calories: 250,
        },
      },
      {
        id: '2',
        user: '박스터디',
        content: '공부하고 러닝하는 하루! 모두 화이팅! 💪',
        likes: 8,
        comments: 1,
        time: '4시간 전',
        type: 'general',
      },
      {
        id: '3',
        user: '이달리기',
        content: '새로운 코스 발견! 정말 좋네요 🌸',
        likes: 15,
        comments: 5,
        time: '6시간 전',
        type: 'running',
        runningData: {
          distance: 3.2,
          time: '18:45',
          calories: 160,
        },
      },
    ];
    
    setPosts(defaultPosts);
    setIsLoading(false);
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      Alert.alert('알림', '게시물 내용을 입력해주세요.');
      return;
    }

    if (postType === 'running' && (!postDistance || !postTime || !postCalories)) {
      Alert.alert('알림', '러닝 데이터를 모두 입력해주세요.');
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content: postContent,
      likes: 0,
      comments: 0,
      time: '방금 전',
      type: postType,
      runningData: postType === 'running' ? {
        distance: parseFloat(postDistance),
        time: postTime,
        calories: parseInt(postCalories),
      } : undefined,
    };

    setPosts([newPost, ...posts]);
    
    // 모달 초기화
    setPostContent('');
    setPostDistance('');
    setPostTime('');
    setPostCalories('');
    setPostType('general');
    setShowPostModal(false);

    Alert.alert('성공', '게시물이 업로드되었습니다!');
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleStartStudy = () => {
    setIsStudying(true);
    setStudyTimer(0);
    // 실제로는 타이머를 시작해야 함
    Alert.alert('공부 시작', '공부 시간 기록을 시작합니다!');
  };

  const handleStopStudy = () => {
    setIsStudying(false);
    const newStudyTime = studyTime + studyTimer;
    setStudyTime(newStudyTime);
    
    // 공부 시간에 따른 러닝 미션 계산
    const runningMission = Math.floor(newStudyTime / 60) * 3; // 1시간당 3km
    
    Alert.alert(
      '공부 완료!',
      `공부 시간: ${Math.floor(studyTimer / 60)}분\n총 공부 시간: ${Math.floor(newStudyTime / 60)}시간\n\n러닝 미션: ${runningMission}km 달성!`
    );
  };

  const renderSocialFeed = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.createPostContainer}>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => setShowPostModal(true)}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.base} />
          <Text style={styles.createPostText}>게시물 작성</Text>
        </TouchableOpacity>
      </View>

      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.user[0]}</Text>
              </View>
              <View>
                <Text style={styles.userName}>{post.user}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          {post.type === 'running' && post.runningData && (
            <View style={styles.runningData}>
              <View style={styles.runningStat}>
                <Text style={styles.runningStatValue}>{post.runningData.distance}km</Text>
                <Text style={styles.runningStatLabel}>거리</Text>
              </View>
              <View style={styles.runningStat}>
                <Text style={styles.runningStatValue}>{post.runningData.time}</Text>
                <Text style={styles.runningStatLabel}>시간</Text>
              </View>
              <View style={styles.runningStat}>
                <Text style={styles.runningStatValue}>{post.runningData.calories}kcal</Text>
                <Text style={styles.runningStatLabel}>칼로리</Text>
              </View>
            </View>
          )}

          <View style={styles.postActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLikePost(post.id)}
            >
              <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderChatPage = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => Alert.alert('새 채팅', '새로운 1:1 채팅을 시작합니다')}
        >
          <Ionicons name="add" size={20} color={COLORS.surface} />
          <Text style={styles.newChatText}>새 채팅</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>그룹 채팅</Text>
      </View>

      {chatRooms.filter(room => room.type === 'group').map((room) => (
        <TouchableOpacity key={room.id} style={styles.chatRoom}>
          <View style={styles.chatRoomInfo}>
            <View style={styles.groupAvatar}>
              <Ionicons name="people" size={20} color={COLORS.surface} />
            </View>
            <View style={styles.chatRoomDetails}>
              <Text style={styles.chatRoomName}>{room.name}</Text>
              <Text style={styles.lastMessage}>{room.lastMessage}</Text>
            </View>
          </View>
          <View style={styles.chatRoomMeta}>
            <Text style={styles.messageTime}>{room.time}</Text>
            {room.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{room.unread}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>1:1 메시지</Text>
      </View>

      {chatRooms.filter(room => room.type === 'individual').map((room) => (
        <TouchableOpacity key={room.id} style={styles.chatRoom}>
          <View style={styles.chatRoomInfo}>
            <View style={styles.individualAvatar}>
              <Text style={styles.individualAvatarText}>{room.name[0]}</Text>
            </View>
            <View style={styles.chatRoomDetails}>
              <Text style={styles.chatRoomName}>{room.name}</Text>
              <Text style={styles.lastMessage}>{room.lastMessage}</Text>
            </View>
          </View>
          <View style={styles.chatRoomMeta}>
            <Text style={styles.messageTime}>{room.time}</Text>
            {room.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{room.unread}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderStudyMission = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.missionHeader}>
        <Text style={styles.missionTitle}>스터디 미션</Text>
        <Text style={styles.missionSubtitle}>공부하고 러닝으로 건강하게!</Text>
      </View>

      <View style={styles.studyTimerCard}>
        <Text style={styles.timerTitle}>공부 시간 기록</Text>
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>
            {Math.floor(studyTimer / 60)}:{String(studyTimer % 60).padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.timerControls}>
          {!isStudying ? (
            <TouchableOpacity
              style={styles.startStudyButton}
              onPress={handleStartStudy}
            >
              <Ionicons name="play" size={24} color={COLORS.surface} />
              <Text style={styles.startStudyText}>공부 시작</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopStudyButton}
              onPress={handleStopStudy}
            >
              <Ionicons name="stop" size={24} color={COLORS.surface} />
              <Text style={styles.stopStudyText}>공부 종료</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.missionCard}>
        <Text style={styles.missionCardTitle}>러닝 미션</Text>
        <View style={styles.missionStats}>
          <View style={styles.missionStat}>
            <Text style={styles.missionStatValue}>{Math.floor(studyTime / 60)}</Text>
            <Text style={styles.missionStatLabel}>총 공부 시간 (시간)</Text>
          </View>
          <View style={styles.missionStat}>
            <Text style={styles.missionStatValue}>{Math.floor(studyTime / 60) * 3}</Text>
            <Text style={styles.missionStatLabel}>러닝 미션 (km)</Text>
          </View>
        </View>
        <Text style={styles.missionDescription}>
          1시간 공부 시 3km 러닝 미션 달성!
        </Text>
      </View>

      <View style={styles.achievementCard}>
        <Text style={styles.achievementTitle}>오늘의 성과</Text>
        <View style={styles.achievementList}>
          <View style={styles.achievementItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.achievementText}>공부 시간 기록 완료</Text>
          </View>
          <View style={styles.achievementItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.achievementText}>러닝 미션 달성</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            소셜 피드
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            채팅
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mission' && styles.activeTab]}
          onPress={() => setActiveTab('mission')}
        >
          <Text style={[styles.tabText, activeTab === 'mission' && styles.activeTabText]}>
            스터디 미션
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' && renderSocialFeed()}
      {activeTab === 'chat' && renderChatPage()}
      {activeTab === 'mission' && renderStudyMission()}

      {/* 게시물 작성 모달 */}
      <Modal
        visible={showPostModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPostModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>게시물 작성</Text>
              <TouchableOpacity
                onPress={() => setShowPostModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.postTypeContainer}>
                <TouchableOpacity
                  style={[styles.postTypeButton, postType === 'general' && styles.activePostTypeButton]}
                  onPress={() => setPostType('general')}
                >
                  <Text style={[styles.postTypeText, postType === 'general' && styles.activePostTypeText]}>
                    일반 게시물
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.postTypeButton, postType === 'running' && styles.activePostTypeButton]}
                  onPress={() => setPostType('running')}
                >
                  <Text style={[styles.postTypeText, postType === 'running' && styles.activePostTypeText]}>
                    러닝 기록
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.postContentInput}
                placeholder="무슨 생각을 하고 계신가요?"
                value={postContent}
                onChangeText={setPostContent}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              {postType === 'running' && (
                <View style={styles.runningInputContainer}>
                  <TextInput
                    style={styles.runningInput}
                    placeholder="거리 (km)"
                    value={postDistance}
                    onChangeText={setPostDistance}
                    keyboardType="decimal-pad"
                  />
                  <TextInput
                    style={styles.runningInput}
                    placeholder="시간 (예: 25:30)"
                    value={postTime}
                    onChangeText={setPostTime}
                  />
                  <TextInput
                    style={styles.runningInput}
                    placeholder="칼로리"
                    value={postCalories}
                    onChangeText={setPostCalories}
                    keyboardType="number-pad"
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.postButtonText}>업로드</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.base,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.base,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    paddingBottom: 100, // 하단 네비게이션을 위한 여백
  },

  // 소셜 피드 스타일
  createPostContainer: {
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
  },
  createPostText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postContent: {
    fontSize: 16,
    padding: SIZES.lg,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  runningData: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  runningStat: {
    flex: 1,
    alignItems: 'center',
  },
  runningStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  runningStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SIZES.xs,
  },

  // 채팅 페이지 스타일
  chatHeader: {
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.base,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 12,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginLeft: SIZES.sm,
  },
  sectionTitle: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.lightGray,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chatRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  chatRoomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  individualAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  individualAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  chatRoomDetails: {
    flex: 1,
  },
  chatRoomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  chatRoomMeta: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  unreadBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    paddingHorizontal: SIZES.xs,
    paddingVertical: 2,
    marginTop: SIZES.xs,
  },
  unreadText: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: 'bold',
  },

  // 스터디 미션 스타일
  missionHeader: {
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  missionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  studyTimerCard: {
    margin: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  timerDisplay: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SIZES.xl,
    marginBottom: SIZES.lg,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timerControls: {
    width: '100%',
  },
  startStudyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.lg,
    borderRadius: 12,
  },
  startStudyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginLeft: SIZES.sm,
  },
  stopStudyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: SIZES.lg,
    borderRadius: 12,
  },
  stopStudyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginLeft: SIZES.sm,
  },
  missionCard: {
    margin: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.lg,
  },
  missionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.lg,
  },
  missionStat: {
    alignItems: 'center',
  },
  missionStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.base,
  },
  missionStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  missionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    backgroundColor: COLORS.lightGray,
    padding: SIZES.md,
    borderRadius: 8,
  },
  achievementCard: {
    margin: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.lg,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  achievementList: {
    gap: SIZES.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SIZES.sm,
  },
  
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SIZES.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SIZES.xs,
  },
  modalBody: {
    paddingBottom: SIZES.xl,
    maxHeight: '100%',
  },
  postTypeContainer: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  postTypeButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
  },
  activePostTypeButton: {
    backgroundColor: COLORS.base,
  },
  postTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  activePostTypeText: {
    color: COLORS.surface,
  },
  postContentInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SIZES.md,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 120,
    marginBottom: SIZES.lg,
  },
  runningInputContainer: {
    gap: SIZES.md,
    marginBottom: SIZES.lg,
  },
  runningInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SIZES.md,
    fontSize: 16,
    color: COLORS.text,
  },
  postButton: {
    backgroundColor: COLORS.base,
    borderRadius: 12,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
});
