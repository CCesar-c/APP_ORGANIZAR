import { TouchableOpacity, Text } from "react-native";
import { boton } from './estilo'

function Boton({ onPress, children, style, ...props }) {
    return (
        <TouchableOpacity onPress={onPress} style={[boton, style, { alignItems: "center", justifyContent: "center", padding: 10 }]}  {...props} >
            <Text >
                {children}
            </Text>
        </TouchableOpacity>
    )
}


export { Boton };