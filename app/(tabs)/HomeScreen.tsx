import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60); // 15분 자동 로그아웃 타이머

  // Android 뒤로가기 버튼 누르면 앱 종료 확인 알림
  useEffect(() => {
    const backAction = () => {
      Alert.alert('앱 종료', '앱을 종료하시겠습니까?', [
        { text: '아니오', style: 'cancel' },
        { text: '예', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // 남은 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  // 로그아웃 처리 함수
  const performLogout = () => {
    console.log('자동 또는 수동 로그아웃 처리됨');
    router.replace('/LoginScreen');
  };

  // 로그아웃 버튼 클릭 시 플랫폼별 확인창 띄우기
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('정말로 로그아웃하시겠습니까?');
      if (confirmLogout) performLogout();
    } else {
      Alert.alert('로그아웃', '정말로 로그아웃하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: performLogout },
      ]);
    }
  };

  // 1초마다 타이머 감소, 0되면 자동 로그아웃
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          performLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 화면 이동 함수 (경로는 실제 앱 경로에 맞게 수정 필요)
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 영역: 마이페이지, 로그아웃, 타이머 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigate('/(tabs)/MyPage')}>
          <Text style={styles.headerButton}>마이페이지</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.headerButton}>로그아웃</Text>
        </TouchableOpacity>

        <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
      </View>

      {/* 환영 인사 */}
      <Text style={styles.welcomeText}>MediTooth에 오신 것을 환영합니다!</Text>
      <Text style={styles.subText}>이제 앱의 주요 기능을 탐색할 수 있습니다.</Text>

      {/* 주요 기능 버튼 리스트 */}
      <View style={styles.contentArea}>
        <Text style={styles.contentTitle}>주요 기능</Text>

        {/* 이미지 진단 */}
        <FeatureButton
          text="🧠 이미지 진단"
          onPress={() => handleNavigate('/ImageDiagnosis/Input')} // 이미지/문진 입력 화면 경로 예시
        />

        {/* 이전 진단 내역 */}
        <FeatureButton
          text="📜 이전 진단 내역"
          onPress={() => handleNavigate('/DiagnosisHistory')}
        />

        {/* 비대면 진단 결과 */}
        <FeatureButton
          text="🩺 비대면 진단 결과"
          onPress={() => handleNavigate('/RemoteDiagnosisResult')}
        />

        {/* 주변 치과 찾기 */}
        <FeatureButton
          text="🏥 주변 치과 찾기"
          onPress={() => handleNavigate('/NearbyClinics')}
        />
      </View>
    </View>
  );
}

// 주요 기능 버튼 컴포넌트
const FeatureButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.featureButton} onPress={onPress}>
    <Text style={styles.featureButtonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#F0F8FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  headerButton: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4682B4',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 14,
    color: '#D9534F',
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  contentArea: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: '#E6F3FF',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ADD8E6',
    borderWidth: 1,
  },
  featureButtonText: {
    fontSize: 16,
    color: '#4682B4',
    fontWeight: '500',
  },
});
