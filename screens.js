import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Platform
} from "react-native";
const Notifications =
  Platform.OS !== "web" ? require("expo-notifications") : null;

import { Alert, Linking } from "react-native";
import remoteConfig from "@react-native-firebase/remote-config";
import Constants from "expo-constants";
import {
  Divider,
  Badge,
  PrimaryButton,
  IconButton,
  StyledInput,
  SectionHeader,
  ScreenWrapper
} from './componentes'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useState,
  useEffect,
  useRef
} from "react";

import {
  COLORS,
  FONTS
} from "./estilo";

// ─── VARIABLES GLOBALES ───────────────────────────────────────────────────────
var horas;
var minutos;

// ─── PANTALLA: INICIO ─────────────────────────────────────────────────────────
function Inicio() {
  const [datos,
    setdatos] = useState([]);
  const [stats,
    setStats] = useState({
      total: 0, completed: 0
    });

  const checkVersion = async () => {
    // 1. Sincronizar Firebase
    await remoteConfig().fetchAndActivate();

    const minVersion = remoteConfig().getValue('min_version').asString();
    const downloadUrl = remoteConfig().getValue('url_last_version').asString();
    const currentVersion = Constants.expoConfig.version;

    // 2. Comparar versiones (Lógica simple)
    if (currentVersion < minVersion) {
      Alert.alert(
        "Actualización Obligatoria",
        "Tu versión es antigua. Descarga la nueva para continuar.",
        [{ text: "Descargar", onPress: () => Linking.openURL(downloadUrl) }],
        { cancelable: false } // No deja cerrar el aviso
      );
    }
  };
  const solicitarPermisos = async () => {
    // 1. Verificamos si ya tenemos permiso
    const {
      status: existingStatus
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 2. Si no tenemos permiso, lo pedimos
    if (existingStatus !== 'granted') {
      const {
        status
      } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 3. Si el usuario dijo que NO, avisamos que la app no funcionará igual
    if (finalStatus !== 'granted') {
      throw new Error("mira pedazo de mierda, o me das el permiso o les doy el permiso de meterte el pito");
    };
    // alert("el app no funcionara igual porfavor, active las Notifications del este app")
    // BackHandler.exitApp();

    // 4. Configuración extra para Android (Canales)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const obtenerTareas = async () => {
    try {


      //await Notifications.cancelAllScheduledNotificationsAsync();
      if (Platform.OS == "android") {
        console.log(await Notifications.getAllScheduledNotificationsAsync())
      }
      const cargar_horas = JSON.parse(await AsyncStorage.getItem("cargar_horas"));
      const cargar_minutos = JSON.parse(await AsyncStorage.getItem("cargar_minutos"));
      horas = cargar_horas;
      minutos = cargar_minutos;
      if (!horas || !minutos) {
        horas = [7,
          13,
          19];
        minutos = [0,
          0,
          0];
      }
      var todas_tareas = await AsyncStorage.getItem("stacks");
      // console.log(todas_tareas)
      var novaLista = JSON.parse(todas_tareas);
      if (!novaLista) return;
      setdatos(novaLista);
      setStats({
        total: novaLista.length,
        completed: novaLista.filter((t) => t.feita).length,
      });
    } catch (e) {
      console.error("Error al leer la memoria", e);
    }
  };
  const copiaStack = useRef(datos);

  useEffect(() => {
    checkVersion();
    solicitarPermisos()
    obtenerTareas();
  }, []);

  async function deleteItem(i, id_manana, id_tarde, id_noche) {
    try {

      id_manana ? await Notifications.cancelScheduledNotificationAsync(id_manana) : null;
      id_tarde ? await Notifications.cancelScheduledNotificationAsync(id_tarde) : null;
      id_noche ? await Notifications.cancelScheduledNotificationAsync(id_noche) : null;

      console.log(id_manana + "\n" + id_tarde + "\n" + id_noche)

      const list = [...datos];
      list.splice(i, 1);
      setdatos(list);
      setStats({
        total: list.length, completed: list.filter((t) => t.feita).length
      });
      await AsyncStorage.setItem("stacks", JSON.stringify(list));
    } catch (e) {
      console.error(e)
    }
  }

  async function changeState(i) {
    try {
      const nuevaLista = [...datos];
      nuevaLista[i].feita = !nuevaLista[i].feita;
      setdatos(nuevaLista);
      setStats({
        total: nuevaLista.length,
        completed: nuevaLista.filter((t) => t.feita).length,
      });
      await AsyncStorage.setItem("stacks",
        JSON.stringify(nuevaLista));
    } catch (e) {
      console.error(e);
    }
  }

  const progressPct = stats.total > 0 ? stats.completed / stats.total : 0;

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header KPI */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <Text style={{
            color: COLORS.textSecondary,
            fontSize: 11,
            letterSpacing: 1.2,
            fontWeight: "700",
            marginBottom: 12
          }}>
            RESUMEN DEL DÍA
          </Text>
          <View style={{
            flexDirection: "row",
            gap: 20,
            marginBottom: 16
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: COLORS.text,
                fontSize: 32,
                fontWeight: "700",
                ...FONTS.display
              }}>{stats.total}</Text>
              <Text style={{
                color: COLORS.textSecondary,
                fontSize: 12
              }}>Tareas totales</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: COLORS.success,
                fontSize: 32,
                fontWeight: "700",
                ...FONTS.display
              }}>{stats.completed}</Text>
              <Text style={{
                color: COLORS.textSecondary,
                fontSize: 12
              }}>Completadas</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                color: COLORS.accent,
                fontSize: 32,
                fontWeight: "700",
                ...FONTS.display
              }}>
                {stats.total > 0 ? Math.round(progressPct * 100) : 0}%
              </Text>
              <Text style={{
                color: COLORS.textSecondary,
                fontSize: 12
              }}>Progreso</Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={{
            height: 4,
            backgroundColor: COLORS.border,
            borderRadius: 2,
            overflow: "hidden"
          }}>
            <View
              style={{
                height: "100%",
                width: `${progressPct * 100}%`,
                backgroundColor: COLORS.accent,
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        <SectionHeader title="Cosas Por Hacer" subtitle={`${stats.total - stats.completed} pendientes`} />
        {datos.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>📋</Text>
            <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>
              No hay tareas registradas
            </Text>
          </View>
        )}

        {datos.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: item.feita ? COLORS.surface : COLORS.card,
              borderWidth: 1,
              borderColor: item.feita ? COLORS.border : COLORS.accentSoft,
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              opacity: item.feita ? 0.65 : 1,
            }}
          >

            {/* Row 1: title + badges + actions */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: item.feita ? COLORS.textSecondary : COLORS.text,
                    fontSize: 15,
                    fontWeight: "600",
                    textDecorationLine: item.feita ? "line-through" : "none",
                    ...FONTS.heading,
                  }}
                >
                  {item.nome + " " + index}
                </Text>
              </View>
              <Badge
                label={item.feita ? "HECHA" : "PENDIENTE"}
                variant={item.feita ? "success" : "default"}
              />
            </View>

            {item.descripcion ? (
              <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 10, lineHeight: 18 }}>
                {item.descripcion}
              </Text>
            ) : null}

            <Divider style={{ marginBottom: 10 }} />

            {/* Row 2: date + actions */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 10 }}>🗓</Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 11, ...FONTS.mono }}>
                  {item.fecha}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <TouchableOpacity
                  onPress={() => alert("Descripción: " + item.descripcion)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text style={{ color: COLORS.textSecondary, fontSize: 11 }}>Ver detalle</Text>
                </TouchableOpacity>
                <IconButton
                  onPress={() => changeState(index)}
                  icon={item.feita ? "↩" : "✓"}
                  variant={item.feita ? "ghost" : "success"}
                />
                <IconButton
                  onPress={() => deleteItem(index, item.id_manana, item.id_tarde, item.id_noche)}
                  icon="✕"
                  variant="danger"
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

// ─── PANTALLA: CREAR TAREAS ───────────────────────────────────────────────────
function Crear_tareas() {
  const [mnn,
    setmnn] = useState(false);
  const [td,
    settd] = useState(false);
  const [nc,
    setnc] = useState(false);
  const [nome,
    setnome] = useState("");
  const [descripcion,
    setdescripcion] = useState("");
  const [saving,
    setSaving] = useState(false);
  const [saved,
    setSaved] = useState(false);

  if (Platform.OS === "android" && Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  async function guardar_tarea() {
    if (!nome.trim()) return;
    setSaving(true);
    try {
      if (Platform.OS === "android" && Notifications) {
        if (mnn == false && td == false && nc == false) {
          alert("No colacaste que horario va a tocar la alarmar");
        }
        var id_mnn = ""
        var id_td = ""
        var id_nc = ""

        if (mnn == true) {
          id_mnn = await Notifications.scheduleNotificationAsync({
            content: {
              title: "¡Oye! Tarea Diaria matutina",
              body: `Es hora de: ${nome}`,
              android: {
                channelId: "tareas-canal",
                sound: true,
                priority: Notifications.AndroidImportance.MAX,
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: horas[0],
              minute: minutos[0],
              repeats: true,
            },
          });
        }
        if (td == true) {
          id_td = await Notifications.scheduleNotificationAsync({
            content: {
              title: "¡Oye! Tarea Diaria vespertina",
              body: `Es hora de: ${nome}`,
              android: {
                channelId: "tareas-canal",
                sound: true,
                priority: Notifications.AndroidImportance.MAX,
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: horas[1],
              minute: minutos[1],
              repeats: true,
            },
          });
        }
        if (nc == true) {
          id_nc = await Notifications.scheduleNotificationAsync({
            content: {
              title: "¡Oye! Tarea Diaria nocturna",
              body: `Es hora de: ${nome}`,
              android: {
                channelId: "tareas-canal",
                sound: true,
                priority: Notifications.AndroidImportance.MAX,
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: horas[2],
              minute: minutos[2],
              repeats: true,
            },
          });
        }

        console.log("id manana " + id_mnn)
        console.log("id tarde " + id_td)
        console.log("id noche " + id_nc)

        const nueva_tarea = {
          nome: nome,
          descripcion: descripcion,
          id_manana: id_mnn,
          id_tarde: id_td,
          id_noche: id_nc,
          fecha: new Date().toLocaleDateString("es-ES"),
          feita: false,
        };

        const resultado = await AsyncStorage.getItem("stacks");
        let lista_actualizada = [];
        if (resultado !== null) {
          const tareas_previas = JSON.parse(resultado);
          lista_actualizada = [nueva_tarea,
            ...tareas_previas];
        } else {
          lista_actualizada = [nueva_tarea];
        }
        await AsyncStorage.setItem("stacks", JSON.stringify(lista_actualizada));

      } else {
        // Web/iOS fallback — save without notifications
        const nueva_tarea = {
          nome,
          descripcion,
          fecha: new Date().toLocaleDateString("es-ES"),
          feita: false,
        };
        const resultado = await AsyncStorage.getItem("stacks");
        let lista_actualizada = resultado ? [nueva_tarea,
          ...JSON.parse(resultado)] : [nueva_tarea];
        await AsyncStorage.setItem("stacks", JSON.stringify(lista_actualizada));
      }

      setnome("");
      setdescripcion("");
      setmnn(false);
      settd(false);
      setnc(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("❌ Error al guardar:", e);
    }
    setSaving(false);
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Nueva Tarea" subtitle="Complete los campos para registrar la tarea" />

        {saved && (
          <View
            style={{
              backgroundColor: COLORS.successMuted,
              borderWidth: 1,
              borderColor: COLORS.success,
              borderRadius: 8,
              padding: 14,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>✅</Text>
            <Text style={{ color: COLORS.success, fontWeight: "600", fontSize: 13 }}>
              Tarea creada correctamente
            </Text>
          </View>
        )}

        {/* Form card */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            gap: 16,
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 8 }}>
              NOMBRE DE LA TAREA *
            </Text>
            <StyledInput
              placeholder="Ej: Revisar correos pendientes"
              value={nome}
              onChangeText={(t) => setnome(t)}
            />
          </View>

          <View>
            <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 8 }}>
              DESCRIPCIÓN
            </Text>
            <StyledInput
              placeholder="Detalles o notas adicionales..."
              value={descripcion}
              onChangeText={(t) => setdescripcion(t)}
              multiline
            />
          </View>
        </View>

        {/* Horario section */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 16 }}>
            RECORDATORIO DIARIO
          </Text>

          {[{
            label: "Mañana", icon: "🌅", value: mnn, setter: setmnn
          },
          {
            label: "Tarde", icon: "☀️", value: td, setter: settd
          },
          {
            label: "Noche", icon: "🌙", value: nc, setter: setnc
          },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => item.setter(!item.value)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
              <Text style={{ color: COLORS.text, fontSize: 14, flex: 1, ...FONTS.body }}>
                {item.label}
              </Text>
              <View
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: item.value ? COLORS.accent : COLORS.border,
                  padding: 2,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: COLORS.white,
                    alignSelf: item.value ? "flex-end" : "flex-start",
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          onPress={guardar_tarea}
          icon="＋"
          disabled={!nome.trim() || saving}
        >
          {saving ? "Guardando..." : "Registrar Tarea"}
        </PrimaryButton>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ─── PANTALLA: OPCIONES ───────────────────────────────────────────────────────
function Opciones() {
  const [mnn,
    setmnn] = useState([]);
  const [td,
    settd] = useState([]);
  const [nc,
    setnc] = useState([]);
  const [saved,
    setSaved] = useState(false);

  async function guardar_hora() {
    if (mnn && td && nc) {
      horas = [];
      minutos = [];
      horas.push(mnn[0]);
      minutos.push(mnn[1]);
      horas.push(td[0]);
      minutos.push(td[1]);
      horas.push(nc[0]);
      minutos.push(nc[1]);
      await AsyncStorage.setItem("cargar_horas", JSON.stringify(horas));
      await AsyncStorage.setItem("cargar_minutos", JSON.stringify(minutos));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  const horarios = [{
    label: "Mañana",
    icon: "🌅",
    value: mnn,
    setter: setmnn,
    placeholder: `${(horas && horas[0]) || 7}.${(minutos && minutos[0]) || "00"}`,
  },
  {
    label: "Tarde",
    icon: "☀️",
    value: td,
    setter: settd,
    placeholder: `${(horas && horas[1]) || 13}.${(minutos && minutos[1]) || "00"}`,
  },
  {
    label: "Noche",
    icon: "🌙",
    value: nc,
    setter: setnc,
    placeholder: `${(horas && horas[2]) || 19}.${(minutos && minutos[2]) || "00"}`,
  },
  ];

  function parseHorario(text, setter) {
    let texto = String(text);
    let texto_partido = texto.split("");
    let array_texto_hr = texto.split("", 2);
    let array_texto_min = texto_partido.slice(3);
    setter([
      Number(array_texto_hr.join("")),
      Number(array_texto_min.join("")),
    ]);
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Configuración" subtitle="Ajusta los horarios de recordatorio" />

        {saved && (
          <View
            style={{
              backgroundColor: COLORS.successMuted,
              borderWidth: 1,
              borderColor: COLORS.success,
              borderRadius: 8,
              padding: 14,
              marginBottom: 20,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16 }}>✅</Text>
            <Text style={{ color: COLORS.success, fontWeight: "600", fontSize: 13 }}>
              Horarios guardados correctamente
            </Text>
          </View>
        )}

        {/* Horarios card */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 20 }}>
            HORARIOS DE NOTIFICACIÓN
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 20, lineHeight: 18 }}>
            Ingresa el horario en formato{" "}
            <Text style={{ color: COLORS.accent, ...FONTS.mono }}>HH.MM</Text> — por ejemplo{" "}
            <Text style={{ color: COLORS.accent, ...FONTS.mono }}>7.30</Text> para las 7:30 AM.
          </Text>

          {horarios.map((item, i) => (
            <View key={item.label} style={{ marginBottom: i < horarios.length - 1 ? 20 : 0 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: "600" }}>
                  {item.label}
                </Text>
              </View>
              <TextInput
                placeholder={`Actual: ${item.placeholder}`}
                placeholderTextColor={COLORS.textMuted}
                value={
                  Array.isArray(item.value) && item.value.length > 0
                    ? `${item.value[0]}.${String(item.value[1]).padStart(2, "0")}` : ""
                }
                maxLength={5}
                keyboardType="numeric"
                onChangeText={(t) => parseHorario(t, item.setter)}
                style={{
                  backgroundColor: COLORS.surface,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: COLORS.text,
                  fontSize: 14,
                  ...FONTS.mono,
                }}
              />
            </View>
          ))}
        </View>

        {/* Info card */}
        <View
          style={{
            backgroundColor: COLORS.accentMuted,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.accentSoft,
            padding: 16,
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 18 }}>ℹ️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: "700", marginBottom: 4 }}>
              NOTA IMPORTANTE
            </Text>
            <Text style={{ color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 }}>
              Los cambios de horario solo afectan a las tareas creadas desde este momento en adelante.
              Las notificaciones existentes mantienen su horario original.
            </Text>
          </View>
        </View>

        <PrimaryButton onPress={guardar_hora} icon="💾">
          Guardar Horarios
        </PrimaryButton>
      </ScrollView>
    </ScreenWrapper>
  );
}

export {
  Inicio,
  Crear_tareas,
  Opciones
};