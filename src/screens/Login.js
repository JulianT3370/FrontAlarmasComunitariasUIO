import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";

function Login({ navigation }) {
    const [seePassword, setSeePassword] = useState(false);

    const onPress = () => {
        setSeePassword(!seePassword);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <StatusBar
                backgroundColor="#6200ee"
                barStyle="light-content" 
                hidden={false}           
            />
            <View style={styles.view}>
                <Image style={styles.image} source={require("../assets/Logo.png")} />
                <Text style={styles.title}>Iniciar Sesión</Text>
                <Text style={styles.subtitle}>Bienvenid@</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Usuario</Text>
                        <View style={styles.inputView}>
                            <Icon name="person" size={24} color="gray" />
                            <TextInput
                                placeholder="Ingrese su usuario"
                                style={styles.textInput}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.inputView}>
                            <Icon name="lock" size={24} color="gray" />
                            <TextInput
                                placeholder="***********"
                                secureTextEntry={!seePassword}
                                style={styles.textInput}
                            />
                            <TouchableOpacity onPress={onPress}>
                                <Icon name={seePassword ? "visibility-off" : "visibility"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate("LocationAccess") }}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    view: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: "100%",
    },
    title: {
        fontSize: 43,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        marginBottom: 20,
        fontSize: 16,
        color: "gray",
    },
    inputContainer: {
        width: "100%",
        paddingHorizontal: 20,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 6,
        fontSize: 16,
        color: "gray",
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: "#f9f9f9",
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    button: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: "blue",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20,
    },
});

export default Login;
