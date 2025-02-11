import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Usamos minHeight en lugar de height para que el contenedor se expanda si es necesario
  modalContainer: {
    width: 300,
    minHeight: 320,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  microphoneIcon: {
    marginBottom: 40,
  },
  recordingText: {
    fontSize: 16,
    color: "blue",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: "green",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export const waveStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
    height: 50,
    marginBottom: 20,
  },
  bar: {
    width: 10,
    height: 50,
    backgroundColor: "blue",
    borderRadius: 5,
  },
});
