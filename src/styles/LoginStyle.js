import { StyleSheet } from "react-native";

export const LoginStyles = StyleSheet.create({
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