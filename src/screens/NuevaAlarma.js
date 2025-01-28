import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const NuevaAlarma = ({ navigation }) => {
    const [alarmName, setAlarmName] = useState("");
    const [sector, setSector] = useState("");

    const handleContinue = () => {
        // Lógica para manejar el botón "Continuar"
        console.log("Nombre de la alarma:", alarmName);
        console.log("Sector:", sector);
        navigation.navigate("SiguientePantalla"); // Navegar a la siguiente pantalla
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Unicación Actual</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información</Text>

                <Text style={styles.label}>Nombre de Alarma</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese el nombre de la alarma"
                    value={alarmName}
                    onChangeText={setAlarmName}
                />

                <Text style={styles.label}>Sector</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese el nombre del sector"
                    value={sector}
                    onChangeText={setSector}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Elementos de Seguridad Incorporados</Text>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Cámara IP</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Alarma</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Sensor de Proximidad</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    table: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    tableRow: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    tableCell: {
        flex: 1,
        fontSize: 16,
    },
    continueButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default NuevaAlarma;