import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import { LoginStyles } from "../styles/LoginStyle";

function Login({ navigation }) {
    const [seePassword, setSeePassword] = useState(false);

    const onPress = () => {
        setSeePassword(!seePassword);
    };

    return (
        <ScrollView contentContainerStyle={LoginStyles.scrollView}>
            <StatusBar
                backgroundColor="#6200ee"
                barStyle="light-content" 
                hidden={false}           
            />
            <View style={LoginStyles.view}>
                {/* Carga del logo */}
                <Image style={LoginStyles.image} source={require("../assets/Logo.png")} />
                <Text style={LoginStyles.title}>Iniciar Sesión</Text>
                <Text style={LoginStyles.subtitle}>Bienvenid@</Text>
                <View style={LoginStyles.inputContainer}>
                    <View style={LoginStyles.inputWrapper}>
                        <Text style={LoginStyles.label}>Usuario</Text>
                        <View style={LoginStyles.inputView}>
                            {/* Icono de usuario */}
                            <Icon name="person" size={24} color="gray" />
                            <TextInput
                                placeholder="Ingrese su usuario"
                                style={LoginStyles.textInput}
                            />
                        </View>
                    </View>
                    <View style={LoginStyles.inputWrapper}>
                        <Text style={LoginStyles.label}>Contraseña</Text>
                        <View style={LoginStyles.inputView}>
                            {/* Icono de candado */}
                            <Icon name="lock" size={24} color="gray" />
                            <TextInput
                                placeholder="***********"
                                secureTextEntry={!seePassword}
                                style={LoginStyles.textInput}
                            />
                            {/* Cambio de icono si se desea mostrar la constraseña */}
                            <TouchableOpacity onPress={onPress}>
                                <Icon name={seePassword ? "visibility-off" : "visibility"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={LoginStyles.button} onPress={() => { navigation.navigate("LocationAccess") }}>
                    <Text style={LoginStyles.buttonText}>Ingresar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default Login;
