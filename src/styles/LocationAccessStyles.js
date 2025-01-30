import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    map: {
        height: 400,
        width: "100%"
    },
    text: {
        padding: 10,
        fontSize: 15,
        textAlign: "center"
    },
    alarmItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    alarmText: {
        marginLeft: 10,
        fontSize: 16
    },
    addButton: {
        backgroundColor: "blue",
        alignSelf: "center",
        padding: 15,
        borderRadius: 30,
        marginVertical: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    input: {
        flex: 1,
        height: 40
    },
    generateButton: {
        backgroundColor: "blue",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 20
    },
    generateButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default styles;
