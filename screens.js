import {
  Text,
  View,
  TextInput
} from "react-native";
import {
  Platform
} from 'react-native';
const Notifications = Platform.OS !== 'web' ? require('expo-notifications'): null;

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
var horas;
var minutos;
function Inicio() {
  const [datos,
    setdatos] = useState([]);

  const obtenerTareas = async () => {
    // await AsyncStorage.clear()
    try {
      // console.log("cargada")
      const cargar_horas = JSON.parse(await AsyncStorage.getItem("cargar_horas"))
      const cargar_minutos = JSON.parse(await AsyncStorage.getItem("cargar_minutos"))
      horas = cargar_horas
      minutos = cargar_minutos
      // console.log(typeof (minutos))
      if (horas == undefined || horas == null && minutos == undefined || minutos == null) {
        console.log("si esta entrando en el if o esta vazio o tiene error")
        horas = [7,
          13,
          19];
        minutos = [0,
          0,
          0];
      }
      //   console.log(horas)
      // console.log(minutos)
      if (Notifications) {
        const notificaciones_agendadas = await Notifications.getAllScheduledNotificationsAsync()
        console.log(notificaciones_agendadas)
      }
      var todas_tareas = await AsyncStorage.getItem("stacks")
      // console.log(todas_tareas)
      var novaLista = JSON.parse(todas_tareas)
      if (novaLista == "null" || novaLista == null) {
        return;
      } else {
        // console.log(novaLista)
        setdatos(novaLista)
      }
    } catch (e) {
      console.error("Error al leer la memoria", e);
    }
  };

  useEffect(() => {
    obtenerTareas()
    // var id_time = setInterval(()=> {
    //   obtenerTareas()
    //   // alert("ejecutando el set inter")
    // }, 5000)
    // return (() => {
    //   clearInterval(id_time)
    // })()
  }, []);


  // deletar item
  async function deleteItem(i, nome_tarea) {
    const notificaciones_agendadas = await Notifications.getAllScheduledNotificationsAsync()
    var borrar_agendas = []
    // console.log(Array.isArray(borrar_agendas))
    if (notificaciones_agendadas !== undefined) {
      for (let i = 0; i < notificaciones_agendadas.length; i++) {
        let notificacio_temporal = notificaciones_agendadas.find(n => n.content.body.includes(nome_tarea)) || [];
        if (notificacio_temporal == undefined || notificacio_temporal == null) {
          console.log("el notificacio_temporal no encontro nada")} else {
          borrar_agendas.push(notificacio_temporal)
          console.log(notificaciones_agendadas)
          await Notifications.cancelScheduledNotificationAsync(borrar_agendas[i].identifier);
        }
      }
      console.log("tarea borrada: ", borrar_agendas.content.body);
      console.log("tareas restantes" + notificaciones_agendadas)
    } else {
      console.log("notificaciones_agendadas es undefined o tiene algo que no deveria")
    }

    // Al borrar la tarea:
    // await Notifications.cancelScheduledNotificationAsync(id);
    const list = [...datos];
    list.splice(i, 1);
    setdatos(list);

    const lista_json = JSON.stringify(list);
    await AsyncStorage.setItem(`stacks`, lista_json);
    // console.log(lista_json);
  }

  // Función para cambiar el estado de ✅ a ❌
  async function changeState(i) {
    try {
      // 1. Clonamos la lista actual para no modificar el original directamente
      const nuevaLista = [...datos];

      // 2. Cambiamos solo la propiedad 'feita' de la tarea que tocamos
      nuevaLista[i].feita = !nuevaLista[i].feita;
      console.log(nuevaLista[i].feita)

      // 3. Actualizamos el estado con la LISTA COMPLETA, no solo con un booleano
      setdatos(nuevaLista);
      const lista_json = JSON.stringify(nuevaLista);
      console.log(lista_json);
      await AsyncStorage.setItem(`stacks`, lista_json);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={container}>
      <Text style={titulo}>Cosas Por Hacer</Text>
      <View
        style={ {
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
          // console.log(item),
          <View
            key={index}
            style={ {
              borderWidth: 1,
              borderColor: "black",
              margin: 5,
              padding: 10

            }}
            >
            <View
              style={ {
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
                {`Esta echa? ${item.feita ? "✅": "❌"}`}
              </Boton>
              <Boton onPress={() => deleteItem(index, item.nome)}>
                delete
              </Boton>
            </View>
            <Text style={ { fontSize: 10 }}>{
              "fecha de creacion: " + item.fecha}</Text>
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
  }

  async function guardar_tarea() {
    try {
      // 1. Aseguramos que el canal exista (Crucial para Android)
      if (Platform.OS === 'android') {
        for (let i = 0; i < horas.length; i++) {
          // console.log(horas[i])
          // console.log(typeof (horas[i]))
          var id_temporal = await Notifications.scheduleNotificationAsync({
            content: {
              title: "¡Oye! Tarea Diaria",
              body: `Es hora de: ${nome}`,
              android: {
                channelId: 'tareas-canal', // 🎯 EL CANAL VA AQUÍ
                sound: true,
                priority: Notifications.AndroidImportance.MAX,
              },
            },
            // 🎯 FUERZA EL TIPO DE TIEMPO:
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: horas[i], // 0 - 23
              minute: minutos[i], // 0 - 59
              repeats: true, // 🔄 Se repite cada 24 horas
            },
            // trigger: {
            //   type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // <--- Esto es clave
            //   seconds: 5,
            // },
          });

          const nueva_tarea = {
            id: id_temporal,
            // Guardamos el ID de la notificación para poder cancelarla después
            nome: nome,
            descripcion: descripcion,
            manana: mnn,
            tarde: td,
            noche: nc,
            fecha: new Date().toLocaleDateString("es-ES"),
            feita: false
          };

          // 2. Leemos lo que ya existe en "stacks"
          const resultado = await AsyncStorage.getItem("stacks");

          // 3. Preparamos la lista final
          let lista_actualizada = [];

          if (resultado !== null) {
            // Si ya hay tareas, las parseamos y agregamos la nueva
            const tareas_previas = JSON.parse(resultado);
            lista_actualizada = [nueva_tarea,
              ...tareas_previas];
          } else {
            // Si es la primera vez, la lista solo tiene la nueva tarea
            lista_actualizada = [nueva_tarea];
          }

          // 4. GUARDADO CRUCIAL: Guardamos la "lista_actualizada", NO el estado
          await AsyncStorage.setItem("stacks", JSON.stringify(lista_actualizada));

          // 5. Actualizamos el estado para que se vea en la pantalla (Inicio)
          // console.log(datos_reciencreados)

          console.log("✅ Guardado con éxito:", lista_actualizada);
        }
      }
    } catch (e) {
      console.error("❌ Error al guardar:", e);
    }
    // await AsyncStorage.setItem("hello", json_info)
  }

  return (
    <View style={container}>
      <Text style={titulo}>Crea una tarea</Text>
      <View
        style={[container, { gap: 10 }]}
        >
        <TextInput
          style={inputs}
          placeholder={'nombre de la tarea'}
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
          >{`manana?${mnn ? "✅": "❌"}`}</Boton>

        <Boton
          onPress={() => {
            settd(!td);
          }}
          >{`tarde?${td ? "✅": "❌"}`}</Boton>

        <Boton
          onPress={() => {
            setnc(!nc);
          }}
          >{`noche?${nc ? "✅": "❌"}`}</Boton>
        <Boton
          onPress={() => {
            if (Platform.OS === "android") {
              guardar_tarea();
            }

          }}
          >
          Crear tarea
        </Boton>
      </View>
    </View>
  );
}

function Opciones() {
  const [mnn,
    setmnn] = useState([]);
  const [td,
    settd] = useState([]);
  const [nc,
    setnc] = useState([]);

  async function guardar_hora() {
    if (mnn && td && nc) {
      horas = []
      minutos = []
      console.log(mnn);
      console.log(td);
      console.log(nc);

      horas.push(mnn[0])
      minutos.push(mnn[1])

      horas.push(td[0])
      minutos.push(td[1])

      horas.push(nc[0])
      minutos.push(nc[1])

      console.log("horas " + horas)
      console.log("minutos " + minutos)
      await AsyncStorage.setItem("cargar_horas", JSON.stringify(horas))
      await AsyncStorage.setItem("cargar_minutos", JSON.stringify(minutos))
    } else {
      console.log("ni tiene nada")
    }
    // console.log(Array.isArray(horas))
  }
  return (
    <View style={container}>
      <Text style={titulo}>Opcoes</Text>
      <View
        style={ {
          borderColor: "black",
          borderWidth: 1,
          gap: 10,
          width: "100%",
          flex: 1
        }}>
        <View
          style={ {
            flexDirection: "row",
            alignItems: "center",
            gap: 10
          }}>
          <Text>coloca el horario la mañana: </Text>
          <TextInput placeholder={`ex: ${horas[0]}.${minutos[0]}`} style={inputs}
            value={mnn}
            maxLength={5}
            keyboardType="numeric"
            onChangeText={(t => {

              let texto = String(t)
              let texto_partido = texto.split("")
              let array_texto_hr = texto.split("", 2)

              let array_texto_min = texto_partido.slice(3)
              // console.log(array_texto_hr)
              // console.log(array_texto_min)
              setmnn([Number(array_texto_hr.join("")), Number(array_texto_min.join(""))])
            })}
            />
        </View>
        <View
          style={ {
            flexDirection: "row",
            alignItems: "center",
            gap: 10
          }}
          >
          <Text>coloca el horario la tarde: </Text>
          <TextInput placeholder={`ex: ${horas[1]}.${minutos[1]}`} style={inputs}
            value={td}
            maxLength={5}
            keyboardType="numeric"
            onChangeText={(t => {
              let texto = String(t)
              let texto_partido = texto.split("")
              let array_texto_hr = texto.split("", 2)

              let array_texto_min = texto_partido.slice(3)
              // console.log(array_texto_hr)
              // console.log(array_texto_min)
              settd([Number(array_texto_hr.join("")), Number(array_texto_min.join(""))])
            })}
            />
        </View>
        <View
          style={ {
            flexDirection: "row",
            alignItems: "center",
            gap: 10
          }}
          >
          <Text>coloca el horario la noche: </Text>
          <TextInput placeholder={`ex: ${horas[2]}.${minutos[2]}`} style={inputs}
            value={nc}
            maxLength={5}
            keyboardType="numeric"
            onChangeText={(t => {
              let texto = String(t)
              let texto_partido = texto.split("")
              let array_texto_hr = texto.split("", 2)

              let array_texto_min = texto_partido.slice(3)
              // console.log(array_texto_hr)
              // console.log(array_texto_min)
              setnc([Number(array_texto_hr.join("")), Number(array_texto_min.join(""))])
            })}
            />
        </View>
        <Boton onPress={() => {
          guardar_hora()
        }}> guardar horarios</Boton>
      </View>
    </View>
  )
}

export {
  Inicio,
  Crear_tareas,
  Opciones
};