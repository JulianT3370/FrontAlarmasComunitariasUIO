import { Audio } from 'expo-av';
import { TouchableOpacity} from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from 'axios';

function Microphone({ navigation }) {
    const [permiso, setPermiso] = useState(false);
    const [audio, setAudio] = useState(null);
    const [uri, setUri] = useState(null)

    const getPermiso = async () => {
        const status = await Audio.requestPermissionsAsync();
        console.log(status)
        if (status.status == "granted") {
            console.log('concedido')
            initGrab()
        }
        else {
            console.log('no concedido')
        }
        setPermiso(status.status == 'granted')
    }

    useEffect(() => {
        getPermiso();
    }, []);

    const initGrab = async () => {
        try {
            console.log("Empezando...")
            // Configuraciones para dispositivos IOS
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            });
            // Iniciar la grabación
            const { recording } = await Audio.Recording.createAsync(
                // Con preconfiguraciones el audio será en alta calidad como estéreo y alta frecuencia
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            // Asignar el resultado a la variable de estado
            setAudio(recording)
            console.log("Grabación iniciada")
        } catch (error) {
            console.error('Error al iniciar la grabación', error);
        }
    }

    const stopRec = async() => {
        try {
            console.log('Deteniendo grabación');
            // Detiene la grabación y libera los recursos asoociados a la grabación
            await audio.stopAndUnloadAsync();
            // Se almacena la ruta donde se almaceno el archivo de audio
            const newUri = audio.getURI();
            console.log('Grabación terminada, URI:', newUri);
            // Asignar el path a una variable de estado
            setUri(newUri);
            const fileUri = newUri;
            // Obtiene el nombre del audio eliminando el path anterior al mismo
            const fileName = fileUri.split('/').pop();
            saveFile(fileUri, fileName);
        } catch (error) {
            console.error('Error al detener la grabación', error);
        }
    }

    const saveFile = async (fileUri, fileName) => {
        // FormData usado para manejar datos compatibles con multipart/form-data
        const formData = new FormData();
        const file = {
            uri: fileUri,
            type: 'audio/m4a',
            name: fileName
        };
        // Agregar el file al Form data bajo el atributo de file
        formData.append('file', file);
        try {
            console.log("Enviando archivo...");
            await axios.post("http://192.168.0.104:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((response)=>{
                console.log('Archivo enviado correctamente');
                console.log(response.data)
            })
            .catch((error)=>{
                console.log(error)
            });
            
        } catch (error) {
            console.error("Error al enviar el archivo:", error);
        }
    };

    return (
        <>
            <TouchableOpacity onPress={stopRec}>
                <Icon name="mic" size={40} color="blue" />
            </TouchableOpacity>
        </>
    )
}

export default Microphone;