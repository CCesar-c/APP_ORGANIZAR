import {
  Text,
  View,
  TextInput
} from "react-native";

import {
  Platform
} from 'react-native';
const Notifications = Platform.OS !== 'web' ? require('expo-notifications') : null;

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  container,
  inputs,
  titulo
} from "./estilo";
import {
  Boton
} from "./componentes";
import {
  useState,
  useEffect
} from "react";

function Inicio() {
  const [datos,
    setdatos] = useState([]);

  const obtenerTareas = async () => {

    // await AsyncStorage.clear()
    try {
      var todas_tareas = await AsyncStorage.getItem("stacks")
      console.log(todas_tareas)
      if (todas_tareas == "null") {
        return;
      } else {
        var novaLista = Array(JSON.parse(todas_tareas))
        console.log(novaLista)
        setdatos(novaLista)

      }
    } catch (e) {
      console.error("Error al leer la memoria", e);
    }
  };

  useEffect(() => {

    obtenerTareas();
  }, []);
  // deletar item
  async function deleteItem(i) {
    const list = [...datos];
    await AsyncStorage.removeItem(`${list[i].nome}`);
    list.splice(i, 1);
    setdatos(list);

    const lista_json = JSON.stringify(list);
    console.log(lista_json);
  }
  // Función para cambiar el estado de ✅ a ❌
  async function changeState(i) {
    try {
      // 1. Clonamos la lista actual para no modificar el original directamente
      const nuevaLista = [...datos];

      // 2. Cambiamos solo la propiedad 'feita' de la tarea que tocamos
      nuevaLista[i].feita = !nuevaLista[i].feita;

      // 3. Actualizamos el estado con la LISTA COMPLETA, no solo con un booleano
      setdatos(nuevaLista);
      const lista_json = JSON.stringify(nuevaLista[i]);
      console.log(lista_json);
      await AsyncStorage.setItem(`${nuevaLista[i].nome}`, lista_json);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={container}>
      <Text style={titulo}>Cosas Por Hacer</Text>
      <View
        style={{
          borderColor: "black",
          borderWidth: 1,
          width: "100%",
          flex: 1
        }}
      >
        {
          // console.log(datos)
          // datos.forEach((item) => {
          //   console.log(item.nome)
          // })
          datos &&
          datos.map((item, index) => (
            console.log(item),
            <View
              key={index}
              style={{
                borderWidth: 1,
                borderColor: "black",
                margin: 5,
                padding: 10

              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <Boton
                  onPress={() =>
                    alert(
                      "descripcion: " + item.descripcion
                    )
                  }
                >
                  {"Nome: " + item.nome}
                </Boton>
                <Boton
                  onPress={() => {
                    changeState(index);
                  }}
                >
                  {`Esta echa? ${item.feita ? "✅" : "❌"}`}
                </Boton>
                <Boton onPress={() => deleteItem(index)}>
                  delete
                </Boton>
              </View>
              <Text style={{ fontSize: 10 }}>{
                "fecha: " + item.fecha}</Text>
            </View>
          ))}
      </View>
    </View>
  );
}

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

  if (Platform.OS === "android") {
    // 1. Configuramos cómo se ven las notificaciones cuando la app está abierta
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        // ❌ Antes: shouldShowAlert: true
        // ✅ Ahora:
        shouldShowBanner: true, // Muestra el cartelito flotante arriba
        shouldShowList: true, // Muestra la notificación en la cortina de notificaciones
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });


    async function guardar_notifications() {
      try {
        // 1. Aseguramos que el canal exista (Crucial para Android)
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('tareas-canal', {
            name: 'Recordatorios de Tareas',
            importance: Notifications.AndroidImportance.MAX,
          });
        }

        // 2. Programamos la notificación con el Trigger EXACTO
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "¡Oye Cesar!",
            body: "Ya pasaron los 5 segundos de la tarea",
            android: {
              channelId: 'tareas-canal', // <--- Primera mención del canal
            },
          },
          // El secreto está en no dejar el trigger como un objeto genérico
          trigger: {
            seconds: 5,
            channelId: 'tareas-canal', // <--- Segunda mención (algunas versiones lo piden aquí)
          },
        });

        console.log("✅ Notificación programada correctamente");
      } catch (error) {
        console.error("❌ Error al programar:", error);
      }
    }
    console.log("se leyo las notificaciones")
  }

  async function guardar_tarea() {
    var tareas_anteriores = Array([])
    try {
      var json_info = {
        nome: nome,
        descripcion: descripcion,
        manana: mnn,
        tarde: td,
        noche: nc,
        fecha: new Date().toLocaleDateString("es-ES"),
        feita: false
      };

      tareas_anteriores = await AsyncStorage.getItem("stacks")
      console.log(tareas_anteriores)
      if (tareas_anteriores == "null") {
        await AsyncStorage.setItem(`stacks`, JSON.stringify(json_info));
        console.log(json_info);
      } else {
        tareas_anteriores.push(json_info)
        await AsyncStorage.setItem(`stacks`, JSON.stringify(tareas_anteriores));
        console.log(tareas_anteriores);
      }
    } catch (e) {
      console.error(e);
    }
    // await AsyncStorage.setItem("hello", json_info)
  }

  return (
    <View style={container}>
      <Text style={titulo}>Crea una tarea</Text>
      <View
        style={[container, { height: "auto", width: "auto", gap: 10 }]}
      >
        <TextInput
          style={inputs}
          placeholder='nombre de la tarea'
          onChangeText={texto => setnome(texto)}
        />
        <TextInput
          style={inputs}
          placeholder='descripcion'
          onChangeText={texto => setdescripcion(texto)}
        />
        {/* no se te olvide de la logica de marca si ya fue echa la tarea */}
        <Boton
          onPress={() => {
            setmnn(!mnn);
          }}
        >{`manana?${mnn ? "✅" : "❌"}`}</Boton>

        <Boton
          onPress={() => {
            settd(!td);
          }}
        >{`tarde?${td ? "✅" : "❌"}`}</Boton>

        <Boton
          onPress={() => {
            setnc(!nc);
          }}
        >{`noche?${nc ? "✅" : "❌"}`}</Boton>
        <Boton
          onPress={() => {
            if (Platform.OS === "android") {
              guardar_notifications()
            }
            guardar_tarea();
          }}
        >
          Crear tarea
        </Boton>
      </View>
    </View>
  );
}

export {
  Inicio,
  Crear_tareas
};