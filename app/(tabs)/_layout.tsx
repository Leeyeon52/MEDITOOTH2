import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          display: 'flex',
        },
      }}
    >
      <Tabs.Screen
        name="index" // ✅ app/(tabs)/index.tsx
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MyPage" // ✅ app/(tabs)/MyPage.tsx
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      {/* 추가 탭 예시 (있을 경우) */}
      {/* 
      <Tabs.Screen
        name="Chatbot" // ✅ app/(tabs)/Chatbot.tsx
        options={{
          title: '챗봇',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />
      */}
    </Tabs>
  );
}
