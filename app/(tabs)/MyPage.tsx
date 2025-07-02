import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';

const SERVER_URL = 'http://192.168.0.2:8000'; // ✅ FastAPI 주소

export default function MyPage(): React.JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', email: '' });

  // ✅ 유저 정보 불러오기
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/user/account`);
      const users = response.data.users;

      if (users.length > 0) {
        setUser(users[0]); // ✅ 로그인 유저 정보 추정
      }
    } catch (error) {
      console.error('유저 정보 로드 실패:', error);
    }
  };

  // ✅ 마이페이지가 포커스될 때마다 정보 갱신
  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  // ✅ 로그아웃 확인
  const confirmLogout = () => {
    const logout = () => router.replace('/LoginScreen');
    if (Platform.OS === 'web') {
      if (window.confirm('로그아웃 하시겠습니까?')) logout();
    } else {
      Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: logout },
      ]);
    }
  };

  // ✅ 회원 탈퇴 확인
  const deleteAccount = async () => {
    try {
      const response = await axios.delete(`${SERVER_URL}/user/delete`, {
        headers: { 'Content-Type': 'application/json' },
        data: { email: user.email },
      });

      if (response.status === 200) {
        Alert.alert('탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
        router.replace('/LoginScreen');
      } else {
        Alert.alert('에러', '회원 탈퇴 실패: ' + response.statusText);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('에러', '서버와의 연결에 실패했습니다.');
    }
  };

  const confirmDeleteAccount = () => {
    const msg = '정말 회원 탈퇴를 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.';
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) deleteAccount();
    } else {
      Alert.alert('회원 탈퇴', msg, [
        { text: '취소', style: 'cancel' },
        { text: '확인', style: 'destructive', onPress: deleteAccount },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>

      <View style={styles.profileBox}>
        {/* 유저 이름과 이메일 표시 */}
        <Text style={styles.profileName}>{user.name || '이름이 없습니다'}</Text>
        <Text style={styles.profileEmail}>{user.email || '이메일이 없습니다'}</Text>
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
