import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native'; // Platform 및 Alert 임포트
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './index'; // 타입 임포트

// HomeScreen에서 사용할 네비게이션 prop의 타입 정의
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // 로그아웃 기능을 위한 예시 함수
  const handleLogout = () => {
    // 실제 로그아웃 로직 (예: 토큰 삭제, 상태 초기화 등)
    const performLogout = () => {
      // 여기에서 AsyncStorage.removeItem 또는 localStorage.removeItem 등을 수행합니다.
      // 예시: localStorage.removeItem('userToken'); // 웹용
      // 예시: await AsyncStorage.removeItem('userToken'); // 네이티브용 (import 필요)
      console.log('사용자 로그아웃 처리');
      navigation.navigate('Login'); // 로그인 화면으로 돌아가기
    };

    // 플랫폼에 따라 다른 알림 방식 사용
    if (Platform.OS === 'web') {
      // 웹 환경
      const confirmLogout = window.confirm('정말로 로그아웃하시겠습니까?');
      if (confirmLogout) {
        performLogout();
      }
    } else {
      // React Native (iOS/Android) 환경
      Alert.alert('로그아웃', '정말로 로그아웃하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: performLogout } // 확인 시 로그아웃 로직 실행
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>MediTooth에 오신 것을 환영합니다!</Text>
      <Text style={styles.subText}>이제 앱의 주요 기능을 탐색할 수 있습니다.</Text>

      {/* 예시: 메인 콘텐츠 영역 */}
      <View style={styles.contentArea}>
        <Text style={styles.contentTitle}>주요 기능</Text>
        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureButtonText}>🦷 진료 예약</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureButtonText}>📜 치료 기록 확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Text style={styles.featureButtonText}>💬 의료진 상담</Text>
        </TouchableOpacity>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF', // 로그인/회원가입 화면과 동일한 배경색
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  subText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  contentArea: {
    width: '90%',
    backgroundColor: '#FFFFFF',
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
    color: '#4682B4', // SteelBlue
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: '#E6F3FF', // 아주 연한 파란색
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
    color: '#4682B4', // SteelBlue
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D9534F', // 빨간색 계열 (경고, 종료 의미)
    borderRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});