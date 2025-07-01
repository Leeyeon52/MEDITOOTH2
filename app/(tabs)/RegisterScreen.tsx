import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform // Platform 임포트 확인
} from 'react-native';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './index';
import axios from 'axios'; // axios 임포트 확인

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

// 백엔드 서버의 URL (개발 환경에 따라 변경 필요)

const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://172.22.240.1:3000';

export default function RegistrationScreen(): React.JSX.Element {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>(''); // 이름 필드 추가
  const [error, setError] = useState<string>('');

  const handleRegister = async () => {
    console.log('handleRegister 함수 시작'); // 함수 시작 로그
    setError('');

    // 유효성 검사
    if (!email || !password || !confirmPassword || !name) {
      setError('모든 필드를 입력해주세요.');
      console.log('유효성 검사 실패: 필수 필드 누락'); // 유효성 검사 실패 로그
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀워호가 일치하지 않습니다.');
      console.log('유효성 검사 실패: 비밀번호 불일치'); // 유효성 검사 실패 로그
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      console.log('유효성 검사 실패: 비밀번호 길이 부족'); // 유효성 검사 실패 로그
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      console.log('유효성 검사 실패: 이메일 형식 오류'); // 유효성 검사 실패 로그
      return;
    }

    try {
      const requestUrl = `${API_BASE_URL}/register`;
      const requestData = { email, password, name };
      console.log('회원가입 요청 시작. URL:', requestUrl); // 디버깅을 위한 로그
      console.log('전송 데이터:', requestData); // 디버깅을 위한 로그
      console.log('현재 플랫폼:', Platform.OS); // 현재 플랫폼 로그 (디버깅용)

      const response = await axios.post(requestUrl, requestData);

      if (response.status === 201) {
        console.log('회원가입 성공. 응답:', response.data); // 성공 응답 로그
        // 플랫폼에 따른 성공 메시지 처리
        if (Platform.OS === 'web') {
          window.alert('회원가입 성공! 이제 로그인할 수 있습니다.');
        } else {
          Alert.alert('회원가입 성공', '이제 로그인할 수 있습니다.', [{ text: '확인' }]);
        }
        navigation.navigate('Login');
      }
    } catch (err) {
      // 오류 처리
      console.error('회원가입 요청 오류 (클라이언트):', err); // 상세 에러 로그
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // 서버에서 응답을 받았지만 2xx 범위 밖의 상태 코드인 경우 (예: 400, 409, 500)
          console.error('서버 응답 에러 (상세):', err.response.data);
          setError(err.response.data.message || '회원가입에 실패했습니다. (서버 응답)');
        } else if (err.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우 (네트워크 오류, 서버 다운 등)
          console.error('요청은 보냈지만 응답을 받지 못함 (네트워크 문제 가능성):', err.request);
          setError('네트워크 오류 또는 서버 응답이 없습니다. (IP 주소, 방화벽 확인)'); // 에러 메시지 상세화
        } else {
          // Axios 요청 설정 자체의 문제
          console.error('Axios 요청 설정 오류 (상세):', err.message);
          setError('알 수 없는 요청 오류가 발생했습니다.');
        }
      } else {
        console.error('예상치 못한 오류 (Axios 관련 없음):', err);
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
    console.log('handleRegister 함수 종료'); // 함수 종료 로그
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
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
        placeholder="비밀번호 (최소 6자)"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput // 이름 입력 필드 추가
        style={styles.input}
        placeholder="이름 (비식별화되어 저장됩니다)"
        placeholderTextColor="#A9A9A9"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>이미 계정이 있으신가요? 로그인</Text>
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
  loginLink: {
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
});
