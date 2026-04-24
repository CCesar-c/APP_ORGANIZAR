import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Inicio, Crear_tareas, Opciones } from "./screens";

const Drawer = createDrawerNavigator();

const COLORS = {
  bg: "#0D0F14",
  surface: "#161A22",
  card: "#1C2130",
  border: "#252C3D",
  accent: "#C9A84C",
  text: "#E8EAF0",
  textSecondary: "#8892A4",
  textMuted: "#4E5668",
};

function CustomDrawerContent({ navigation, state }) {
  const routes = state.routes;
  const activeIndex = state.index;

  const items = [
    { name: "Inicio", icon: "📋", label: "Panel Principal" },
    { name: "Crear tareas", icon: "＋", label: "Nueva Tarea" },
    { name: "Opciones", icon: "⚙", label: "Configuración" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Brand header */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 28,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: COLORS.accent,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: COLORS.bg }}>✦</Text>
          </View>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "700",
              fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
              letterSpacing: 0.5,
            }}
          >
            APP ORGANIZAR
          </Text>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 11, letterSpacing: 1, marginLeft: 46 }}>
          GESTIÓN DE TAREAS
        </Text>
      </View>

      {/* Nav items */}
      <View style={{ padding: 12, flex: 1 }}>
        {items.map((item, i) => {
          const isActive = routes[activeIndex]?.name === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 4,
                backgroundColor: isActive ? "rgba(201,168,76,0.12)" : "transparent",
              }}
            >
              {isActive && (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    backgroundColor: COLORS.accent,
                    borderRadius: 2,
                  }}
                />
              )}
              <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              <View>
                <Text
                  style={{
                    color: isActive ? COLORS.accent : COLORS.text,
                    fontSize: 13,
                    fontWeight: isActive ? "700" : "500",
                    letterSpacing: 0.3,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View
        style={{
          padding: 24,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <Text style={{ color: COLORS.textMuted, fontSize: 10, letterSpacing: 0.8 }}>
          ·  ENTERPRISE EDITION
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0D0F14",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#252C3D",
          },
          headerTintColor: "#C9A84C",
          headerTitleStyle: {
            color: "#E8EAF0",
            fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: 0.5,
          },
          drawerStyle: {
            backgroundColor: "#0D0F14",
            width: 260,
          },
        }}
      >
        <Drawer.Screen name="Inicio" component={Inicio} options={{ title: "Panel Principal" }} />
        <Drawer.Screen name="Crear tareas" component={Crear_tareas} options={{ title: "Nueva Tarea" }} />
        <Drawer.Screen name="Opciones" component={Opciones} options={{ title: "Configuración" }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}