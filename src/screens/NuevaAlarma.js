import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";

const NuevaAlarma = ({ navigation }) => {
    const [alarmName, setAlarmName] = useState("");
    const [sector, setSector] = useState("");

    // Lista de elementos de seguridad
    const elementosSeguridad = [
        "Cámara IP",
        "Alarma",
        "Sensor de Proximidad",
        "Sensores de Movimiento",
        "Sensores de Puertas y Ventanas",
        "Sistema de Control de Acceso"
    ];

    // Estado para almacenar los elementos seleccionados
    const [seleccionados, setSeleccionados] = useState({});

    // Manejar selección de elementos
    const toggleSeleccion = (elemento) => {
        setSeleccionados((prev) => ({
            ...prev,
            [elemento]: !prev[elemento]  // Alternar selección
        }));
    };

    const handleContinue = () => {
        console.log("Nombre de la alarma:", alarmName);
        console.log("Sector:", sector);
        console.log("Elementos seleccionados:", Object.keys(seleccionados).filter((key) => seleccionados[key]));
        navigation.navigate("SiguientePantalla");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ubicación Actual</Text>

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
                {elementosSeguridad.map((elemento, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Checkbox
                            status={seleccionados[elemento] ? "checked" : "unchecked"}
                            onPress={() => toggleSeleccion(elemento)}
                        />
                        <Text style={styles.tableCell}>{elemento}</Text>
                    </View>
                ))}
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
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    tableCell: {
        fontSize: 16,
        marginLeft: 10,
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
