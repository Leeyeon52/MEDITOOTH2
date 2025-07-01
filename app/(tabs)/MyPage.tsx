import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function MyPage(): React.JSX.Element {
  const router = useRouter();

  // 예시 유저 정보 (실제 구현 시 API 연동 필요)
  const user = {
    name: '홍길동',
    email: 'hong@example.com',
  };

  // 로그아웃 확인 함수
  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('로그아웃 하시겠습니까?')) {
        router.replace('/LoginScreen');
      }
    } else {
      Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => router.replace('/LoginScreen') },
      ]);
    }
  };

  // 회원 탈퇴 확인 함수
  const confirmDeleteAccount = () => {
    const message = '정말 회원 탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.';
    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        window.alert('회원 탈퇴가 완료되었습니다.');
        router.replace('/LoginScreen');
      }
    } else {
      Alert.alert('회원 탈퇴', message, [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          style: 'destructive',
          onPress: () => {
            Alert.alert('탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
            router.replace('/LoginScreen');
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>

      <View style={styles.profileBox}>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push('/EditProfile')}
      >
        <Text style={styles.actionButtonText}>👤 개인정보 수정</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push('/ReservationList')}
      >
        <Text style={styles.actionButtonText}>📅 예약 내역 보기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.logoutButton]}
        onPress={confirmLogout}
      >
        <Text style={styles.actionButtonText}>🚪 로그아웃</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={confirmDeleteAccount}
      >
        <Text style={styles.actionButtonText}>❌ 회원 탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 20,
  },
  profileBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#4682B4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#B44646',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
  },
});
