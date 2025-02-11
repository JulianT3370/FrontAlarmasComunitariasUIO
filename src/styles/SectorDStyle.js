import { StyleSheet } from "react-native";

export const SectoDStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    detailContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 16,
        marginVertical: 8,
    },
    button: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});