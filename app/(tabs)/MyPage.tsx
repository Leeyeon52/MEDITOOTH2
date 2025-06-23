import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MyPage(): React.JSX.Element {
  const navigation = useNavigation();

  // 예시 사용자 정보 (실제로는 props나 Context, API 호출 등으로 받아와야 함)
  const user = {
    name: '홍길동',
    email: 'hong@example.com',
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: () => {
          // 실제 로그아웃 처리 로직
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            // TODO: 탈퇴 처리 API 호출 및 상태 초기화 등
            Alert.alert('탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // 스택 초기화로 안전하게 Home 화면 이동 (화면 이름은 프로젝트에 맞게 수정하세요)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>

      <View style={styles.profileBox}>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <Text style={styles.text}>사용자 정보, 설정, 예약 내역 등을 확인할 수 있습니다.</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>개인정보 수정</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ReservationList')}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>예약 내역 보기</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.actionButton, styles.logoutButton]}>
        <Text style={styles.actionButtonText}>로그아웃</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={[styles.actionButton, styles.deleteButton]}
      >
        <Text style={styles.actionButtonText}>회원 탈퇴</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4682B4',
  },
  profileBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
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
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#B44646',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#4682B4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
