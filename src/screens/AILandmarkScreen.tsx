import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../utils/constants';
// @ts-ignore
import { geminiService } from '../services/geminiService';
// @ts-ignore
import { kakaoMapService } from '../services/kakaoMapService';

interface AILandmarkScreenProps {
  onClose: () => void;
}

interface Landmark {
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  rating: number;
  visitDuration: string;
  priceLevel: string;
  tags: string[];
}

interface UserPreferences {
  age?: number;
  interests?: string[];
  activities?: string[];
  travelStyle?: string;
  budget?: string;
  location?: string;
}

export const AILandmarkScreen: React.FC<AILandmarkScreenProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [mapHTML, setMapHTML] = useState<string>('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    age: 25,
    interests: ['문화', '관광'],
    activities: ['산책', '사진촬영'],
    travelStyle: '편안한',
    budget: '보통',
    location: '서울'
  });
  const [preferenceInputs, setPreferenceInputs] = useState({
    age: '25',
    interests: '문화, 관광',
    activities: '산책, 사진촬영',
    travelStyle: '편안한',
    budget: '보통',
    location: '서울'
  });

  // 컴포넌트 마운트 시 기본 랜드마크 로드
  useEffect(() => {
    loadDefaultLandmarks();
  }, []);

  // 랜드마크가 변경될 때마다 지도 URL 업데이트
  useEffect(() => {
    if (landmarks.length > 0) {
      updateMapUrl();
    }
  }, [landmarks]);

  const loadDefaultLandmarks = async () => {
    setIsLoading(true);
    try {
      const result = await geminiService.getLandmarkRecommendations(userPreferences);
      const convertedLandmarks = await kakaoMapService.convertLandmarksToKakaoCoordinates(result.landmarks);
      setLandmarks(convertedLandmarks);
    } catch (error) {
      console.error('Error loading landmarks:', error);
      Alert.alert('오류', '랜드마크를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      // 입력값을 UserPreferences 형식으로 변환
      const preferences: UserPreferences = {
        age: parseInt(preferenceInputs.age),
        interests: preferenceInputs.interests.split(',').map(s => s.trim()),
        activities: preferenceInputs.activities.split(',').map(s => s.trim()),
        travelStyle: preferenceInputs.travelStyle,
        budget: preferenceInputs.budget,
        location: preferenceInputs.location
      };

      const result = await geminiService.getLandmarkRecommendations(preferences);
      const convertedLandmarks = await kakaoMapService.convertLandmarksToKakaoCoordinates(result.landmarks);
      setLandmarks(convertedLandmarks);
      setUserPreferences(preferences);
      setShowPreferences(false);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      Alert.alert('오류', '추천을 받는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMapUrl = () => {
    if (landmarks.length > 0) {
      // HTML 기반 지도 생성
      const html = kakaoMapService.generateMapHTML(landmarks);
      setMapHTML(html);
    }
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferenceInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderLandmarkCard = (landmark: Landmark, index: number) => (
    <View key={index} style={styles.landmarkCard}>
      <View style={styles.landmarkHeader}>
        <Text style={styles.landmarkName}>{landmark.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={COLORS.warning} />
          <Text style={styles.rating}>{landmark.rating}</Text>
        </View>
      </View>
      <Text style={styles.landmarkDescription}>{landmark.description}</Text>
      <View style={styles.landmarkInfo}>
        <Text style={styles.landmarkCategory}>{landmark.category}</Text>
        <Text style={styles.landmarkDuration}>{landmark.visitDuration}분</Text>
      </View>
      <View style={styles.landmarkTags}>
        {landmark.tags.map((tag, tagIndex) => (
          <View key={tagIndex} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.preferencesButton}
            onPress={() => setShowPreferences(!showPreferences)}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.surface} />
            <Text style={styles.preferencesButtonText}>취향 설정</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AI 랜드마크 추천</Text>
          <Text style={styles.subtitle}>당신의 취향에 맞는 랜드마크를 찾아보세요</Text>
        </View>
      </View>

      {/* 취향 설정 모달 */}
      {showPreferences && (
        <View style={styles.preferencesModal}>
          <ScrollView style={styles.preferencesContent}>
            <Text style={styles.preferencesTitle}>취향 설정</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>나이</Text>
              <TextInput
                style={styles.input}
                value={preferenceInputs.age}
                onChangeText={(text) => handlePreferenceChange('age', text)}
                keyboardType="numeric"
                placeholder="나이를 입력하세요"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>관심사 (쉼표로 구분)</Text>
              <TextInput
                style={styles.input}
                value={preferenceInputs.interests}
                onChangeText={(text) => handlePreferenceChange('interests', text)}
                placeholder="예: 문화, 관광, 음식"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>선호 활동 (쉼표로 구분)</Text>
              <TextInput
                style={styles.input}
                value={preferenceInputs.activities}
                onChangeText={(text) => handlePreferenceChange('activities', text)}
                placeholder="예: 산책, 사진촬영, 쇼핑"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>여행 스타일</Text>
              <TextInput
                style={styles.input}
                value={preferenceInputs.travelStyle}
                onChangeText={(text) => handlePreferenceChange('travelStyle', text)}
                placeholder="예: 편안한, 모험적인, 문화적인"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>예산</Text>
              <TextInput
                style={styles.input}
                value={preferenceInputs.budget}
                onChangeText={(text) => handlePreferenceChange('budget', text)}
                placeholder="예: 저렴한, 보통, 비싼"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>지역</Text>
              <TextInput
                style={styles.input}
                value={preferenceInputs.location}
                onChangeText={(text) => handlePreferenceChange('location', text)}
                placeholder="예: 서울, 부산, 제주"
              />
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleGetRecommendations}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <>
                  <Ionicons name="search" size={20} color={COLORS.surface} />
                  <Text style={styles.applyButtonText}>추천 받기</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* 지도 영역 */}
      <View style={styles.mapContainer}>
        {mapHTML ? (
          <WebView
            source={{ html: mapHTML }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={60} color={COLORS.textSecondary} />
            <Text style={styles.mapText}>랜드마크를 선택하면 지도가 표시됩니다</Text>
          </View>
        )}
      </View>

      {/* 랜드마크 목록 */}
      <View style={styles.landmarksContainer}>
        <Text style={styles.landmarksTitle}>추천 랜드마크</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.base} />
            <Text style={styles.loadingText}>AI가 랜드마크를 추천하고 있습니다...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {landmarks.map((landmark, index) => renderLandmarkCard(landmark, index))}
          </ScrollView>
        )}
      </View>
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
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.surface,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  closeButton: {
    padding: SIZES.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  preferencesButton: {
    backgroundColor: COLORS.base,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferencesButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: SIZES.xs,
  },
  preferencesModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferencesContent: {
    backgroundColor: COLORS.surface,
    margin: SIZES.lg,
    borderRadius: 16,
    padding: SIZES.lg,
    maxHeight: '80%',
    width: '90%',
  },
  preferencesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: SIZES.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  applyButton: {
    backgroundColor: COLORS.base,
    borderRadius: 12,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: SIZES.lg,
  },
  applyButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: SIZES.xs,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SIZES.md,
    textAlign: 'center',
  },
  landmarksContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.lg,
  },
  landmarksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
  },
  landmarkCard: {
    backgroundColor: COLORS.background,
    marginLeft: SIZES.lg,
    marginRight: SIZES.sm,
    padding: SIZES.md,
    borderRadius: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  landmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  landmarkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SIZES.xs,
  },
  landmarkDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
    lineHeight: 20,
  },
  landmarkInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  landmarkCategory: {
    fontSize: 12,
    color: COLORS.base,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 12,
  },
  landmarkDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  landmarkTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 8,
    marginRight: SIZES.xs,
    marginBottom: SIZES.xs,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});
