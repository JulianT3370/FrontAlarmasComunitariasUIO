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
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setAudio(recording)
            console.log("Grabación iniciada")
        } catch (error) {
            console.error('Error al iniciar la grabación', error);
        }
    }

    const stopRec = () => {
        try {
            console.log('Deteniendo grabación');
            audio.stopAndUnloadAsync();
            const newUri = audio.getURI();
            console.log('Grabación terminada, URI:', uri);
            setUri(newUri);
            const fileUri = newUri;
            const fileName = fileUri.split('/').pop();
            saveFile(fileUri, fileName);
        } catch (error) {
            console.error('Error al detener la grabación', error);
        }
    }

    const saveFile = async (fileUri, fileName) => {
        const formData = new FormData();
        const file = {
            uri: fileUri,
            type: 'audio/m4a',
            name: fileName
        };

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