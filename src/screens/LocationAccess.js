import { ScrollView, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, StatusBar } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../styles/LocationAccessStyles";
import { axiosApi } from "../services/axiosFlask";
import DialogScreen from "../partials/DialogScreen";
import { getSectores } from "../services/getSectores";
import CamaraIP from "./CamaraIP";
import { deleteSector } from "../services/deleteSector";
import Microphone from './Microphone'; // Importamos el nuevo componente

export default function LocationAccess() {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState(null);
    const [text, setText] = useState("");
    const [datos, setDatos] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [dialogResponse, setDialogResponse] = useState(false);
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
    }, []),
  );

  useEffect(() => {
    requestLocationPermission();
    fetchSectores();
  }, []);

  const requestLocationPermission = async () => {
    const {status} = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      startLocationTracking();
    } else {
      console.log('Permiso de ubicación no concedido');
    }
  };

  const startLocationTracking = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 1,
      },
      newLocation => {
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
      },
    );
  };

    const getTitle = async (text) => {
        await axiosApi.post("/text", {
            text: text
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        },)
            .then((response) => {
                const res = response.data.trim()
                if (res == "No está relacionado.") {
                    setMessage(res)
                    setDialogResponse(true)
                }
                else {
                    calcularHaversine(res)
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Error del servidor:', error.response.data.message);
                } else if (error.request) {
                    console.error('No se recibió respuesta del servidor.');
                } else {
                    console.error('Error al configurar la solicitud:', error.message);
                }
            })
    }

    const calcularHaversine = async (title) => {
        const data = {
            "sectores": sectores,
            "coordenadas": location,
            "titulo": title
        }
        await axiosApi.post("/haversine", {
            data: data
        })
            .then((response) => {
                setDatos(response.data)
                setDialog(true)
            })
            .catch((error) => {
                if (error.response) {
                    setMessage(error.response.data.message)
                    setDialogResponse(true)
                } else if (error.request) {
                    console.error('No se recibió respuesta del servidor.');
                } else {
                    console.error('Error al configurar la solicitud:', error.message);
                }
                setDialogResponse(true)
            })
    }

    const handleCancel = () => {
        setDatos(null)
        setText("")
        setDialog(false);
        navigation.navigate("CamaraIP")
    };

    const deleteS = (sector_name) => {
      const response = deleteSector({ sector_name })
      if (response) {
          setMessage(response)
          setDialogResponse(true)
          fetchSectores()
      }
  }

    return (
        <View
            style={styles.container}
            behavior={"height"}
        >
            <StatusBar
                backgroundColor="#6200ee"
                barStyle="light-content"
                hidden={false}
            />
            <DialogScreen
                status={dialogResponse}
                titulo="Advertencia!"
                descripcion={message}
                eventCancel={() => setDialogResponse(false)}
            />
            {datos ?
                <DialogScreen
                    status={dialog}
                    titulo={datos["title"]}
                    descripcion={
                        <>
                            <Text>La alerta se envió a los siguientes sectores:</Text>
                            {datos["sectores"].map(
                                (itemA, index) => (
                                    <Text key={index} style={{ fontWeight: "bold" }}> "{itemA["name"]}" </Text>
                                ))}
                            <Text style={styles.origen}>
                                <Text>{"\n"}Origen</Text>{"\n"}
                                Latitud: {datos["origen"]["latitude"]}{"\n"}
                                Longitud: {datos["origen"]["longitude"]}
                            </Text>
                        </>
                    }
                    eventCancel={handleCancel}
                />
                : null
            }
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
                                onPress={() => navigation.navigate("SectorDetalle", { sector })}
                            >
                                <Icon name="alarm" size={20} color="blue" />
                            </Marker>
                        ))}
                    </MapView>
                ) : (
                    <Text style={styles.text}>Obteniendo ubicación...</Text>
                )}

                <View style={styles.alarmBox}>
                    <Text style={styles.alarmTitle}>Alarmas Comunitarias Registradas en el sector:</Text>
                    {sectores.map((sector, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.alarmItem}
                            onPress={() => navigation.navigate("SectorDetalle", { sector })}
                        >
                            <Icon name="notifications" size={20} color="blue" />
                            <View>
                                <Text style={styles.alarmName}>{sector.id}</Text>
                            </View>
                            <TouchableOpacity onPress={ () => deleteS(sector.id) } style = {{ flex:1, alignItems:"flex-end" }}>
                                <Icon name = "delete" size = {20} color = "red" />
                            </TouchableOpacity >
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate("AgregarSector")}
                    //onPress={() => navigation.navigate("CamaraIP")}
                    >
                        <Icon name="add" size={40} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AgregarSector')}
            //onPress={() => navigation.navigate("CamaraIP")}
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
                onChangeText={value => setText(value)}
              />
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
              }}>
              <Text style={styles.generateButtonText}>Generar</Text>
            </TouchableOpacity>
            {showVoiceModal && (
                <Microphone
                    visible={showVoiceModal}
                    onClose={() => setShowVoiceModal(false)}
                    onFinish={handleRecordingFinish} // Pasar la función para manejar el resultado
                />
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
