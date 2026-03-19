import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import { Inicio, Crear_tareas } from './screens';
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Inicio" component={Inicio} />
        <Drawer.Screen name="Crear tareas" component={Crear_tareas} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}