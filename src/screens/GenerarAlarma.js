import { View, Text, StyleSheet } from "react-native";

function GenerarAlarma() {
    return (
        <View style={styles.container}>
            <Text>Generar Alarma Comunitaria</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default GenerarAlarma;
