// app/(tabs)/explore.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>탐색(Explore) 페이지</Text>
      <Text style={styles.content}>여기에서 기능을 탐색할 수 있어요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
});
