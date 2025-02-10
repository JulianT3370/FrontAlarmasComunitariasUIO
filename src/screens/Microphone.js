import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import { axiosApi } from "../services/axiosFlask";
import { styles, waveStyles } from "../styles//MicrophoneStyle"; // Importamos los estilos

// Componente para visualizar las ondas animadas
function WaveVisualizer() {
  const numBars = 5;
  const bars = useRef(
    Array.from({ length: numBars }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const animateBar = (bar, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 2,
            duration: 300,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    bars.forEach((bar, index) => {
      animateBar(bar, index * 100);
    });
  }, [bars]);

  return (
    <View style={waveStyles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            waveStyles.bar,
            { transform: [{ scaleY: bar }] },
          ]}
        />
      ))}
    </View>
  );
}

// Función para formatear el tiempo (mm:ss)
const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const centisecondsStr = centiseconds < 10 ? `0${centiseconds}` : `${centiseconds}`;
  return `${secondsStr}:${centisecondsStr}`;
};

function Microphone({ visible, onClose, onFinish }) {
  const [permiso, setPermiso] = useState(false);
  const [audio, setAudio] = useState(null);
  const [title, setTitle] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Solicitar permisos de grabación
  const getPermiso = async () => {
    const status = await Audio.requestPermissionsAsync();
    if (status.status === "granted") {
      console.log("Permiso concedido");
      setPermiso(true);
      startRecording(); // Iniciar la grabación automáticamente
    } else {
      console.log("Permiso no concedido");
      setPermiso(false);
    }
  };

  // Iniciar la grabación y arrancar el temporizador hasta 5 segundos
  const startRecording = async () => {
    try {
      console.log("Iniciando grabación...");
      // Iniciar la grabación
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setAudio(recording);
      console.log("Grabación iniciada");
      // Inicia el timer que incrementa cada 100 ms hasta 5 segundos (5000 ms)
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= 5000) {
            clearInterval(timerRef.current);
            stopRecording();
            return 5000;
          }
          return prev + 100;
        });
      }, 100);
    } catch (error) {
      console.error("Error al iniciar la grabación", error);
    }
  };

  // Detener la grabación y enviar el audio
  const stopRecording = async () => {
    try {
        console.log("Deteniendo grabación...");
        if (audio) {
            await audio.stopAndUnloadAsync();
            const fileUri = audio.getURI();
            console.log("Grabación terminada, URI:", fileUri);

            setAudio(null); // Liberamos el objeto de grabación
            saveFile(fileUri); //  Guardar y enviar el archivo

            onClose(); //  Cierra el modal correctamente
        }
    } catch (error) {
        console.error("Error al detener la grabación", error);
    }
};


  // Guardar y enviar el archivo de audio
  const saveFile = async (fileUri) => {
    const fileName = fileUri.split('/').pop();
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'audio/m4a',
      name: fileName,
    });

    try {
      console.log("Enviando archivo...");
      const response = await axiosApi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Archivo enviado correctamente");
      console.log(response.data);
      sendText(response.data); // Enviar el texto transcrito
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
      } else {
        console.error("Error en la solicitud:", error.message);
      }
    }
  };

  // Enviar el texto transcrito
  const sendText = async (text) => {
    try {
      const response = await axiosApi.post(
        "/text",
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data === "No está relacionado.") {
        console.log("No se relaciona con seguridad comunitaria");
      } else {
        console.log(response.data);
        setTitle(response.data); // Actualizar el título con la respuesta
        if (onFinish) {
          onFinish(response.data); // Llamar a onFinish con el resultado
        }
      }
    } catch (error) {
      console.error("Error al enviar el texto:", error);
    } finally {
      onClose(); // Cerrar el modal después de enviar el texto
    }
  };

  // Solicitar permisos al abrir el modal y limpiar el timer al cerrarlo
  useEffect(() => {
    if (visible) {
      getPermiso();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsed(0);
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Botón para cerrar el modal */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="gray" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Grabando...</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
            <Text style={styles.timerText}> - 05:00</Text>
          </View>

          {/* Icono de micrófono */}
          <Icon name="mic" size={40} color="blue" style={styles.microphoneIcon} />

          {/* Visualización de las ondas animadas */}
          <WaveVisualizer />

          {title !== "" ? (
            <Text style={styles.resultText}>{title}</Text>
          ) : (
            <Text style={styles.recordingText}>Grabando...</Text>
          )}

          {/* Botón para detener la grabación manualmente */}
          <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
            <Text style={styles.stopButtonText}>Detener grabación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default Microphone;
