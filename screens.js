import { Text, View, TextInput } from 'react-native';
import { container, titulo } from './estilo'
import { Boton } from './componentes';
import { useState } from 'react';
function Inicio() {
    return (
        <View style={container}>
            <Text style={titulo}>Cosas Pendientes</Text>
            <View style={{ borderColor: "black", borderWidth: 1, width: "100%", height: "100%" }}>
                <Text>Empty</Text>
            </View>
        </View>
    )
}
function Crear_tareas() {
    const [mnn, setmnn] = useState(false);
    const [td, settd] = useState(false);
    const [nc, setnc] = useState(false);
    const [nome, setnome] = useState('');
    const [descripcion, setdescripcion] = useState('');
    var json_info = JSON.stringify({
        "nome": nome,
        "descripcion": descripcion
    })

    return (
        <View style={container}>
            <Text style={titulo}>Crea una tarea</Text>
            <View style={[container, { height: "auto", width: "auto", gap: 10 }]}>
                <TextInput placeholder='nombre de la tarea' />
                <TextInput placeholder='descripcion' />
                {/* no se te olvide de la logica de marca si ya fue echa la tarea */}
                <Boton onPress={() => { setmnn(!mnn) }} >{`manana?${mnn ? "✅" : "❌"}`}</Boton>

                <Boton onPress={() => { settd(!td) }} >{`tarde?${td ? "✅" : "❌"}`}</Boton>

                <Boton onPress={() => { setnc(!nc) }} >{`noche?${nc ? "✅" : "❌"}`}</Boton>
                <Boton>Crear tarea</Boton>
            </View>
        </View>
    )
}

export { Inicio, Crear_tareas };