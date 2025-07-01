// LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './index';
import axios from 'axios';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// 개발 환경에 따라 API 주소 수정
const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://172.22.240.1:3000';

export default function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loginRecords, setLoginRecords] = useState<
    { id: number; login_time: string; ip_address?: string }[]
  >([]);

  const handleLogin = async () => {
    setError('');
    setLoginRecords([]);
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

      if (response.status === 200) {
        if (Platform.OS === 'web') {
          window.alert('로그인 성공!');
        } else {
          Alert.alert('로그인 성공', '환영합니다!', [{ text: '확인' }]);
        }
        navigation.navigate('Home');

        // 로그인 기록 조회 API 호출 (예: /login_records?email=...)
        fetchLoginRecords(email);
      } else {
        setError(`로그인 실패: 상태 코드 ${response.status}`);
      }
    } catch (err: unknown) {
      console.error('로그인 요청 오류:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || '로그인에 실패했습니다.');
        } else if (err.request) {
          setError('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
        } else {
          setError('요청 중 오류가 발생했습니다.');
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 로그인 기록 조회 함수
  const fetchLoginRecords = async (userEmail: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/login_records`, {
        params: { email: userEmail },
      });
      if (res.status === 200) {
        setLoginRecords(res.data.records);
      }
    } catch (error) {
      console.error('로그인 기록 조회 오류:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>로그인</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        placeholderTextColor="#A9A9A9"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>

      {loginRecords.length > 0 && (
        <View style={styles.recordsContainer}>
          <Text style={styles.recordsTitle}>최근 로그인 기록</Text>
          {loginRecords.map((rec) => (
            <View key={rec.id} style={styles.recordItem}>
              <Text>로그인 시간: {new Date(rec.login_time).toLocaleString()}</Text>
              <Text>IP 주소: {rec.ip_address ?? '알 수 없음'}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ADD8E6',
    borderWidth: 1,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#4682B4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    color: '#4682B4',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  recordsContainer: {
    marginTop: 40,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderColor: '#ADD8E6',
    borderWidth: 1,
  },
  recordsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#4682B4',
  },
  recordItem: {
    marginBottom: 10,
  },
});
