import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaViewBase } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer'

const Drawer = createDrawerNavigator();

export default function App() {
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={inicio} />
  </Drawer.Navigator>
}

function inicio() {
  return (
    <SafeAreaViewBase style={styles.container}>
      <Text>Home Screen</Text>
      
      <StatusBar style="auto" />
    </SafeAreaViewBase>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
