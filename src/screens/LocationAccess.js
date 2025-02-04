import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  // Keyboard,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import styles from "../styles/LocationAccessStyles";
import { axiosApi } from "../services/axiosFlask";
import Dialog from "react-native-dialog";

function LocationAccess() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  // const [subscription, setSubscription] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  // const [inputFocused, setInputFocused] = useState(false);
  const [text, setText] = useState("");
  const [datos, setDatos] = useState(null);
  const [dialog, setDialog] = useState(false)
  const [dialogError, setDialogError] = useState(false)
  const radius = 45;

  // Alarmas predefinidas
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return <Text>Map component is not supported on Web</Text>;
    }
    else{
      requestLocationPermission();
    }
    // return () => {
    //   if (subscription) subscription.remove();
    // };
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      startLocationTracking();
    } else {
      console.log("Permiso de ubicación no concedido");
    }
  };

  const getTitle = async (text) => {
    console.log("Enviando descripción")
    await axiosApi.post("/text", {
      text: text
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        const res = response.data.trim()
        if (res == "No está relacionado.") {
          console.log("no se relaciona con seguridad comunitaria")
          setDialogError(true)
        }
        else {
          enviarAlarma(res)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

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

          // Agregar alarmas dentro del radio de 20m
          setAlarms([
            {
              id: 1,
              name: "La Gasca",
              address: "1671 North Avenue, Tucson, AZ",
              latitude: -0.367159,
              longitude: -78.547700,
            },
            {
              id: 2,
              name: "Principal A",
              address: "1234 Desert Road, Tucson, AZ",
              latitude: -0.367000,
              longitude: -78.547500,
            },
          ]);
        }
      }
    );
    // setSubscription(locationSubscription);
  };

  const handleCancel = () => {
    setDatos(null)
    setText("")
    setDialog(false);
  };

  const enviarAlarma = async (title) => {
    const data = {
      "sectores": alarms,
      "coordenadas": location,
      "titulo": title
    }
    // console.log(data)
    await axiosApi.post("/haversine", {
      data: data
    }, {}).then((response) => {
      console.log(response.data)
      setDatos(response.data)
      setDialog(true)
    })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
            {alarms.map((alarm) => (
              <Marker
                key={alarm.id}
                coordinate={{ latitude: alarm.latitude, longitude: alarm.longitude }}
                onPress={() => navigation.navigate("AlarmaDetalle", { alarm })}
              >
                <Icon name="alarm" size={40} color="blue" />
              </Marker>
            ))}
          </MapView>
        ) : (
          <Text style={styles.text}>Obteniendo ubicación...</Text>
        )}

        <View style={styles.alarmBox}>
          <Text style={styles.alarmTitle}>Alarmas Comunitarias Registradas en el sector:</Text>
          {alarms.map((alarm) => (
            <TouchableOpacity
              key={alarm.id}
              style={styles.alarmItem}
              onPress={() => navigation.navigate("AlarmaDetalle", { alarm })}
            >
              <Icon name="notifications" size={20} color="blue" />
              <View>
                <Text style={styles.alarmName}>{alarm.name}</Text>
                <Text style={styles.alarmAddress}>{alarm.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            // onPress={() => navigation.navigate("AgregarAlarma")}
            onPress={() => navigation.navigate("CamaraIP")}
          >
            <Icon name="add" size={40} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.generateAlarm}>
          <Text style={styles.generateTitle}>Generar Alarma Comunitaria</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mensaje..."
              value={text}
              onChangeText={(value) => setText(value)}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Microphone")}>
              <Icon name="mic" size={30} color="blue" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              if (text) {
                getTitle(text)
              }
            }}
          >
            {datos ?
              <Dialog.Container visible={dialog}>
                <Dialog.Title>{datos["title"]}</Dialog.Title>
                <Dialog.Description>
                  <Text>La alerta se envió a los siguientes sectores:</Text>
                  {alarms
                    .filter((itemA) => {
                      return datos["sectores"].some(
                        (item) => itemA["name"] === item["name"] && item["status"] === true
                      );
                    })
                    .map((itemA, index) => (
                      <Text key={index}> {itemA["name"]}</Text>
                    ))}
                  <Text style={styles.origen}>
                    <Text>{"\n"}Origen</Text>{"\n"}
                    Latitud: {datos["origen"]["latitude"]}{"\n"}
                    Longitud: {datos["origen"]["longitude"]}
                  </Text>
                </Dialog.Description>
                <Dialog.Button label="Aceptar" onPress={handleCancel} />
              </Dialog.Container>
              : null}
            <Dialog.Container visible={dialogError}>
              <Dialog.Title>Error</Dialog.Title>
              <Dialog.Description>
                <Text>El texto proporcionado no se relaciona con seguridad comunitaria.</Text>
              </Dialog.Description>
              <Dialog.Button label="Aceptar" onPress={() => setDialogError(false)} />
            </Dialog.Container>
            <Text style={styles.generateButtonText}>Generar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


export default LocationAccess;
