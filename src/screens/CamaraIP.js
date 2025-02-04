import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { axiosApi } from '../services/axiosFlask';

function CamaraIP() {

  const recordRTSP = async () => {
    await axiosApi.post("/process-video", {
      rtsp_url : "rtsp://dispo:dispo@192.168.0.103:8080/h264_ulaw.sdp",
      output_file : "output.mp4"
    })
    .then((response)=>{
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  };

  useEffect(() => {
    recordRTSP()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cámara Activada</Text>
      <View>
        <Text>IP Webcam</Text>
      </View>
      <WebView
        source={{ uri: 'http://dispo:dispo@192.168.0.103:8080/video' }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  webview: {
    flex: 1,
  }
});

export default CamaraIP;