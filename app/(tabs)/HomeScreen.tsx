import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Platform, Alert, BackHandler 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60); // 15분

  useEffect(() => {
    // Android 물리 뒤로가기 처리 (앱 종료 확인)
    const backAction = () => {
      Alert.alert('앱 종료', '앱을 종료하시겠습니까?', [
        { text: '아니오', style: 'cancel' },
        { text: '예', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // 기본 뒤로가기 동작 차단
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // 남은 시간 포맷 (mm:ss)
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  // 로그아웃 처리 (자동, 수동 공통)
  const performLogout = () => {
    console.log('로그아웃 처리 완료');
    router.replace('/LoginScreen'); // 로그인 화면으로 이동
  };

  // 로그아웃 버튼 눌렀을 때 확인 팝업 띄우기
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('정말로 로그아웃하시겠습니까?')) performLogout();
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
      setRemainingSeconds(prev => {
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

  // 각 기능 페이지 이동 핸들러
  const handleMyPage = () => router.push('/(tabs)/MyPage');
  const handleTreatmentHistory = () => router.push('/TreatmentHistory');
  const handleChatbot = () => router.push('/Chatbot');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMyPage}>
          <Text style={styles.headerButton}>마이페이지</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.headerButton}>로그아웃</Text>
        </TouchableOpacity>

        <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
      </View>

      <Text style={styles.welcomeText}>MediTooth에 오신 것을 환영합니다!</Text>
      <Text style={styles.subText}>이제 앱의 주요 기능을 탐색할 수 있습니다.</Text>

      <View style={styles.contentArea}>
        <Text style={styles.contentTitle}>주요 기능</Text>

        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureButtonText}>🦷 진료 예약</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton} onPress={handleTreatmentHistory}>
          <Text style={styles.featureButtonText}>📜 치료 기록 확인</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureButton} onPress={handleChatbot}>
          <Text style={styles.featureButtonText}>💬 의료진 상담</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
