import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../utils/constants';
import { WebView } from 'react-native-webview';
// @ts-ignore
import { kakaoMapService } from '../services/kakaoMapService';
import * as Location from 'expo-location';

interface RunningData {
  distance: number; // km
  speed: number; // km/h
  time: number; // seconds
  calories: number;
  pace: number; // min/km
}

export const RouteScreen: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [runningData, setRunningData] = useState<RunningData>({
    distance: 0,
    speed: 0,
    time: 0,
    calories: 0,
    pace: 0,
  });
  const [mapHTML, setMapHTML] = useState<string>('');
  const [pathCoords, setPathCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);

  // 타이머 업데이트
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTimeRef.current - pausedTimeRef.current) / 1000);
        
        // 시뮬레이션된 러닝 데이터 업데이트
        const simulatedDistance = elapsedTime * 0.003; // 약 10.8km/h 속도로 시뮬레이션
        const simulatedSpeed = simulatedDistance > 0 ? (simulatedDistance * 3600) / elapsedTime : 0;
        const simulatedPace = simulatedSpeed > 0 ? 60 / simulatedSpeed : 0;
        const simulatedCalories = simulatedDistance * 50; // 대략적인 칼로리 계산

        setRunningData({
          distance: Math.round(simulatedDistance * 100) / 100,
          speed: Math.round(simulatedSpeed * 10) / 10,
          time: elapsedTime,
          calories: Math.round(simulatedCalories),
          pace: Math.round(simulatedPace * 10) / 10,
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // 카카오맵: 기본 지도를 표시 (랜드마크 없을 때 기본 위치로 센터)
  useEffect(() => {
    try {
      const html = kakaoMapService.generateMapHTML([]);
      setMapHTML(html);
    } catch (e) {
      // noop: 에러 시 기존 placeholder 유지
    }
  }, []);

  // 현재 위치를 얻어 지도에 "내 위치" 마커 표시
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const userLandmark = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          name: '내 위치',
          category: '현재위치',
        } as any;
        const html = kakaoMapService.generateMapHTML([userLandmark]);
        setMapHTML(html);
      } catch (e) {
        // 위치 못 얻으면 기본 지도 유지
      }
    })();
    return () => {
      if (locationWatchRef.current) {
        locationWatchRef.current.remove();
        locationWatchRef.current = null;
      }
    };
  }, []);

  const updateMapWithPath = (coords: Array<{ latitude: number; longitude: number }>) => {
    try {
      if (!coords || coords.length === 0) return;
      const landmarks = coords.map((c, idx) => ({
        latitude: c.latitude,
        longitude: c.longitude,
        name: idx === 0 ? '출발' : idx === coords.length - 1 ? '현재 위치' : `포인트 ${idx}`,
        category: '경로',
      })) as any[];
      const html = kakaoMapService.generateMapHTML(landmarks);
      setMapHTML(html);
    } catch (_) {
      // ignore
    }
  };

  const startLocationWatch = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      if (locationWatchRef.current) {
        locationWatchRef.current.remove();
        locationWatchRef.current = null;
      }
      locationWatchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10, // 10m마다 업데이트
          timeInterval: 3000, // 3초 최소 간격
        },
        (loc) => {
          setPathCoords((prev) => {
            const next = prev.concat({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            updateMapWithPath(next);
            return next;
          });
        }
      );
    } catch (_) {
      // ignore
    }
  };

  const stopLocationWatch = () => {
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }
  };

  const handleStartRunning = () => {
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setRunningData({
      distance: 0,
      speed: 0,
      time: 0,
      calories: 0,
      pace: 0,
    });
    setPathCoords([]);
    startLocationWatch();
  };

  const handlePauseRunning = () => {
    if (isPaused) {
      // 재시작
      setIsPaused(false);
      startTimeRef.current = Date.now() - (runningData.time * 1000);
      startLocationWatch();
    } else {
      // 일시정지
      setIsPaused(true);
      pausedTimeRef.current += Date.now() - startTimeRef.current - (runningData.time * 1000);
      stopLocationWatch();
    }
  };

  const handleStopRunning = () => {
    Alert.alert(
      '러닝 종료',
      `총 거리: ${runningData.distance}km\n총 시간: ${formatTime(runningData.time)}\n소모 칼로리: ${runningData.calories}kcal\n\n러닝을 종료하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '종료', 
          style: 'destructive',
          onPress: () => {
            setIsRunning(false);
            setIsPaused(false);
            stopLocationWatch();
            setRunningData({
              distance: 0,
              speed: 0,
              time: 0,
              calories: 0,
              pace: 0,
            });
            setPathCoords([]);
            try {
              const html = kakaoMapService.generateMapHTML([]);
              setMapHTML(html);
            } catch (_) {}
          }
        }
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(2)}km`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>러닝 시작</Text>
        <Text style={styles.subtitle}>
          {isRunning ? (isPaused ? '일시정지됨' : '러닝 중') : '러닝을 시작하세요'}
        </Text>
      </View>

      {/* 실시간 정보 표시 */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{formatDistance(runningData.distance)}</Text>
            <Text style={styles.metricLabel}>거리</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{runningData.speed.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>속도 (km/h)</Text>
          </View>
        </View>
        
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{formatTime(runningData.time)}</Text>
            <Text style={styles.metricLabel}>시간</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{runningData.calories}</Text>
            <Text style={styles.metricLabel}>칼로리</Text>
          </View>
        </View>

        <View style={styles.paceContainer}>
          <Text style={styles.paceValue}>{runningData.pace.toFixed(1)}</Text>
          <Text style={styles.paceLabel}>페이스 (min/km)</Text>
        </View>
      </View>

      {/* 지도 영역: 카카오맵 WebView */}
      <View style={styles.mapContainer}>
        {mapHTML ? (
          <WebView
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={60} color={COLORS.textSecondary} />
            <Text style={styles.mapText}>GPS 기반 실시간 이동 경로</Text>
            <Text style={styles.mapSubtext}>
              {isRunning ? '러닝 경로가 표시됩니다' : '러닝을 시작하면 경로가 표시됩니다'}
            </Text>
          </View>
        )}
      </View>

      {/* 컨트롤 버튼들 */}
      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartRunning}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={30} color={COLORS.surface} />
            <Text style={styles.startButtonText}>러닝 시작</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.runningControls}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handlePauseRunning}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isPaused ? "play" : "pause"} 
                size={24} 
                color={COLORS.surface} 
              />
              <Text style={styles.controlButtonText}>
                {isPaused ? '재시작' : '일시정지'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopRunning}
              activeOpacity={0.8}
            >
              <Ionicons name="stop" size={24} color={COLORS.surface} />
              <Text style={styles.controlButtonText}>종료</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.surface,
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
  },
  metricsContainer: {
    backgroundColor: COLORS.surface,
    margin: SIZES.lg,
    borderRadius: 16,
    padding: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.lg,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  paceContainer: {
    alignItems: 'center',
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  paceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.base,
    marginBottom: SIZES.xs,
  },
  paceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
    borderRadius: 16,
    overflow: 'hidden',
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
  mapSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
    textAlign: 'center',
  },
  controlsContainer: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.lg,
  },
  startButton: {
    backgroundColor: COLORS.base,
    borderRadius: 16,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginLeft: SIZES.sm,
  },
  runningControls: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: COLORS.warning,
    borderRadius: 16,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stopButton: {
    flex: 1,
    backgroundColor: COLORS.error,
    borderRadius: 16,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginLeft: SIZES.xs,
  },
});
