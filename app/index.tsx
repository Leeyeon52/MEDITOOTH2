import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

// 각 화면 컴포넌트 임포트
// 현재 파일(index.tsx)과 같은 디렉토리 내에 있는 LoginScreen.tsx와 RegisterScreen.tsx를 임포트합니다.
import HomeScreen from './(tabs)/HomeScreen'; // 로그인/회원가입 후 이동할 화면
import LoginScreen from './(tabs)/LoginScreen';
import RegisterScreen from './RegisterScreen';

// 네비게이션 스택의 라우트 및 파라미터 타입 정의
// 이 RootStackParamList가 LoginScreen.tsx와 RegisterScreen.tsx에서 임포트됩니다.
export type RootStackParamList = {
  Login: undefined; // Login 화면은 파라미터를 받지 않음
  Register: undefined; // Register 화면은 파라미터를 받지 않음
  Home: undefined; // Home 화면은 파라미터를 받지 않음 (로그인 성공 후 이동)
};

const Stack = createStackNavigator<RootStackParamList>(); // Stack Navigator에 타입 적용

export default function App(): React.JSX.Element { // Expo Router의 경우 이 파일을 App 컴포넌트로 사용할 수 있습니다.
  return (
    // <NavigationContainer>는 일반적으로 앱의 최상단에 한 번만 사용됩니다.
    // Expo Router를 사용 중이라면, _layout.tsx에 NavigationContainer가 있을 수 있습니다.
    // 여기서는 (tabs) 내의 스택을 정의하므로 NavigationContainer는 생략하거나,
    // 최상위 _layout.tsx 파일에 정의되어 있다고 가정합니다.
    <Stack.Navigator initialRouteName="Login">
      {/* 로그인 화면 설정 */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // 로그인 화면에서는 헤더를 숨깁니다.
      />
      {/* 회원가입 화면 설정 */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: '회원가입', headerStyle: { backgroundColor: '#F0F8FF' }, headerTintColor: '#4682B4' }} // 회원가입 화면 헤더 스타일
      />
      {/* 홈 화면 설정 (로그인/회원가입 성공 시 이동) */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // 홈 화면에서는 헤더를 숨깁니다.
      />
    </Stack.Navigator>
  );
}
