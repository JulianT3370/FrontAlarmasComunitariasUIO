import { 
    ScrollView, 
    Text, 
    View, 
    TouchableOpacity, 
    TextInput, 
    KeyboardAvoidingView, 
    StatusBar, 
    Modal, 
    StyleSheet,
    Animated
  } from "react-native";
  import * as Location from "expo-location";
  import MapView, { Marker, Circle } from "react-native-maps";
  import Icon from "react-native-vector-icons/MaterialIcons";
  import { useNavigation } from "@react-navigation/native";
  import { useState, useEffect, useCallback, useRef } from "react";
  import { useFocusEffect } from "@react-navigation/native";
  import styles from "../styles/LocationAccessStyles";
  import { axiosApi } from "../services/axiosFlask";
  import DialogScreen from "../partials/DialogScreen";
  import { getSectores } from "../services/getSectores";
  import { Audio } from "expo-av";
  
  // Componente principal: LocationAccess
  export default function LocationAccess() {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);
    const [text, setText] = useState("");
    const [datos, setDatos] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [dialogError, setDialogError] = useState(false);
    const [message, setMessage] = useState("");
    const [sectores, setSectores] = useState([]);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const radius = 45;
  
    const fetchSectores = async () => {
      const data = await getSectores();
      setSectores(data);
    };
  
    useFocusEffect(
      useCallback(() => {
        fetchSectores();
      }, [])
    );
  
    useEffect(() => {
      requestLocationPermission();
      fetchSectores();
    }, []);
  
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        startLocationTracking();
      } else {
        console.log("Permiso de ubicación no concedido");
      }
    };
  
    const startLocationTracking = async () => {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 1,
        },
        (newLocation) => {
          const userLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setLocation(userLocation);
          if (!mapRegion) {
            setMapRegion({
              ...userLocation,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            });
          }
        }
      );
    };
  
    const getTitle = async (text) => {
      await axiosApi
        .post(
          "/text",
          { text: text },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          const res = response.data.trim();
          if (res === "No está relacionado.") {
            setMessage(res);
            setDialogError(true);
          } else {
            calcularHaversine(res);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error del servidor:", error.response.data.message);
          } else if (error.request) {
            console.error("No se recibió respuesta del servidor.");
          } else {
            console.error("Error al configurar la solicitud:", error.message);
          }
        });
    };
  
    const calcularHaversine = async (title) => {
      const data = {
        sectores: sectores,
        coordenadas: location,
        titulo: title,
      };
      await axiosApi
        .post("/haversine", { data: data })
        .then((response) => {
          setDatos(response.data);
          setDialog(true);
        })
        .catch((error) => {
          if (error.response) {
            setMessage(error.response.data.message);
            setDialogError(true);
          } else if (error.request) {
            console.error("No se recibió respuesta del servidor.");
          } else {
            console.error("Error al configurar la solicitud:", error.message);
          }
          setDialogError(true);
        });
    };
  
    const handleCancel = () => {
      setDatos(null);
      setText("");
      setDialog(false);
    };
  
    return (
      <View style={styles.container} behavior={"height"}>
        <StatusBar backgroundColor="#6200ee" barStyle="light-content" hidden={false} />
        <DialogScreen
          status={dialogError}
          titulo="Advertencia!"
          descripcion={message}
          eventCancel={() => setDialogError(false)}
        />
        {datos ? (
          <DialogScreen
            status={dialog}
            titulo={datos["title"]}
            descripcion={
              <>
                <Text>La alerta se envió a los siguientes sectores:</Text>
                {datos["sectores"].map((itemA, index) => (
                  <Text key={index} style={{ fontWeight: "bold" }}>
                    " {itemA["name"]} "
                  </Text>
                ))}
                <Text style={styles.origen}>
                  {"\n"}Origen{"\n"}Latitud: {datos["origen"]["latitude"]}
                  {"\n"}Longitud: {datos["origen"]["longitude"]}
                </Text>
              </>
            }
            eventCancel={handleCancel}
          />
        ) : null}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {location ? (
            <MapView style={styles.map} initialRegion={mapRegion}>
              <Marker coordinate={location} />
              <Circle
                center={location}
                radius={radius}
                strokeColor="rgba(0, 0, 255, 0.5)"
                fillColor="rgba(0, 0, 255, 0.2)"
              />
              {sectores.map((sector, index) => (
                <Marker
                  key={index}
                  coordinate={{ latitude: sector.latitud, longitude: sector.longitud }}
                  onPress={() => navigation.navigate("AlarmaDetalle", { sector })}
                >
                  <Icon name="alarm" size={20} color="blue" />
                </Marker>
              ))}
            </MapView>
          ) : (
            <Text style={styles.text}>Obteniendo ubicación...</Text>
          )}
  
          <View style={styles.alarmBox}>
            <Text style={styles.alarmTitle}>
              Alarmas Comunitarias Registradas en el sector:
            </Text>
            {sectores.map((sector, index) => (
              <TouchableOpacity
                key={index}
                style={styles.alarmItem}
                onPress={() => navigation.navigate("AlarmaDetalle", { sector })}
              >
                <Icon name="notifications" size={20} color="blue" />
                <View>
                  <Text style={styles.alarmName}>{sector.id}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AgregarAlarma")}
            >
              <Icon name="add" size={40} color="white" />
            </TouchableOpacity>
          </View>
  
          <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={60}>
            <View style={styles.generateAlarm}>
              <Text style={styles.generateTitle}>Generar Alarma Comunitaria</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Mensaje..."
                  value={text}
                  onChangeText={(value) => setText(value)}
                />
                {/* Al pulsar el ícono del micrófono se muestra el modal de grabación */}
                <TouchableOpacity onPress={() => setShowVoiceModal(true)}>
                  <Icon name="mic" size={30} color="blue" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={() => {
                  if (text) {
                    getTitle(text);
                  }
                }}
              >
                <Text style={styles.generateButtonText}>Generar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
  
        {/* Modal para grabar voz */}
        {showVoiceModal && (
          <VoiceRecorderModal
            onClose={() => setShowVoiceModal(false)}
            calcularHaversine={calcularHaversine}
            setMessage={setMessage}
            setDialogError={setDialogError}
          />
        )}
      </View>
    );
  }
  
  // Componente WaveVisualizer: visualización de barras animadas (ondas)
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
  
  const waveStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 150,
      height: 50,
    },
    bar: {
      width: 10,
      height: 50,
      backgroundColor: "blue",
      borderRadius: 5,
    },
  });
  
  // Componente VoiceRecorderModal: modal de grabación de voz con temporizador, ícono de micrófono, animación de ondas personalizada y manejo correcto de la grabación
  function VoiceRecorderModal({ onClose, calcularHaversine, setMessage, setDialogError }) {
    const [elapsed, setElapsed] = useState(0);
    const [recording, setRecording] = useState(null);
    const timerRef = useRef(null);
  
    const startRecording = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        // Si existe una grabación previa, la detenemos y liberamos recursos
        if (recording) {
          await recording.stopAndUnloadAsync();
          setRecording(null);
        }
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
        // Inicia el contador que se actualiza cada 100ms hasta 5 segundos
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
        console.error("Error al iniciar la grabación:", error);
      }
    };
  
    useEffect(() => {
      startRecording();
      return () => {
        // Al desmontar el modal, detenemos y liberamos la grabación si existe
        if (recording) {
          recording.stopAndUnloadAsync().catch(() => {});
          setRecording(null);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, []);
  
    const stopRecording = async () => {
      try {
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          if (timerRef.current) clearInterval(timerRef.current);
          setRecording(null);
          // Envía el archivo de audio y continúa el flujo (igual que en el mensaje de texto)
          saveFile(uri);
        }
      } catch (error) {
        console.error("Error al detener la grabación:", error);
      }
    };
  
    const handleClose = async () => {
      // Si se pulsa la "X" para cerrar, detenemos la grabación (si existe) y limpiamos el temporizador
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (error) {
          console.error("Error al detener la grabación al cerrar:", error);
        }
        setRecording(null);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onClose();
    };
  
    const saveFile = async (fileUri) => {
      const fileName = fileUri.split("/").pop();
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "audio/m4a",
        name: fileName,
      });
      try {
        await axiosApi
          .post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            sendText(response.data);
          })
          .catch((error) => {
            console.error("Error al enviar el archivo:", error);
          });
      } catch (error) {
        console.error("Error en saveFile:", error);
      }
    };
  
    const sendText = async (textResponse) => {
      await axiosApi
        .post(
          "/text",
          { text: textResponse },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          const res = response.data.trim();
          if (res === "No está relacionado.") {
            setMessage(res);
            setDialogError(true);
          } else {
            calcularHaversine(res);
          }
        })
        .catch((error) => {
          console.error("Error al enviar el texto:", error);
        });
      onClose();
    };
  
    const formatTime = (ms) => {
      const seconds = Math.floor(ms / 1000);
      const centiseconds = Math.floor((ms % 1000) / 10);
      const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
      const centisecondsStr = centiseconds < 10 ? `0${centiseconds}` : `${centiseconds}`;
      return `${secondsStr}:${centisecondsStr}`;
    };
  
    return (
      <Modal transparent={true} animationType="fade">
        <View style={voiceStyles.overlay}>
          <View style={voiceStyles.modalContainer}>
            {/* Botón para cerrar el modal */}
            <TouchableOpacity style={voiceStyles.closeButton} onPress={handleClose}>
              <Icon name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={voiceStyles.modalTitle}>Grabando...</Text>
            {/* Temporizador */}
            <View style={voiceStyles.timerContainer}>
              <Text style={voiceStyles.timerText}>{formatTime(elapsed)}</Text>
              <Text style={voiceStyles.timerText}> - 05:00</Text>
            </View>
            {/* Ícono de micrófono antes de las ondas */}
            <Icon name="mic" size={40} color="blue" style={{ marginBottom: 40 }} />
            {/* Visualización de ondas personalizada */}
            <WaveVisualizer />
          </View>
        </View>
      </Modal>
    );
  }
  
  const voiceStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: 300,
      height: 320,
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
  });
  