import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

function Login({navigation}) {
    const [seePassword, setSeePassword] = useState(false);
    const navigate = useNavigation()

    const onPress = ()=>{
        setSeePassword(!seePassword);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.view}>
                <Image style={styles.image} source={require("../assets/Logo.png")} />
                <Text style={styles.title}>Iniciar Sesión</Text>
                <Text style={styles.subtitle}>Bienvenid@</Text>
                <View>
                    <View style={styles.input}>
                        <View style={styles.content}>
                            <Text style={styles.label}>Usuario</Text>
                            <View style={styles.inputView}>
                                <Icon name="person" size={24} color="gray" style={styles.icon} />
                                <TextInput
                                    placeholder="Ingrese su usuario"
                                    style={styles.textInput}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.input}>
                        <View style={styles.content}>
                            <Text style={styles.label}>Contraseña</Text>
                            <View style={styles.inputView}>
                                <Icon name="lock" size={24} color="gray" style={styles.icon} />
                                <TextInput
                                    placeholder="***********"
                                    secureTextEntry = {!seePassword}
                                    style={styles.textInput}
                                />
                                <TouchableOpacity onPress={onPress}>
                                    <Icon name={seePassword ? "visibility-off" : "visibility"} size={24} color="gray" />
                                </TouchableOpacity>
                            </View>
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
        alignItems: "center"
    },
    view: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    title: {
        fontSize: 43,
        fontWeight: "bold",
        marginBottom: 10
    },
    subtitle: {
        marginBottom: 20
    },
    input: {
        width: "100%",
        marginBottom: 20
    },
    label: {
        margin: 6,
        fontSize: 16,
        color: "gray"
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: "100%"
    },
    icon: {
        marginRight: 10
    },
    textInput: {
        flex: 1,
        height: 40
    },
    button: {
        borderRadius: 10,
        padding: 15,
        backgroundColor: "blue",
        alignItems: "center",
        marginTop: 20
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
    content: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: "contain"
    }
});

export default Login;
