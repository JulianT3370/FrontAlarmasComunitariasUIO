import { WebView } from 'react-native-webview';
import { View, Text } from 'react-native';
import { styleCamera } from '../styles/CamaraStyle';

function CamaraIP() {

  return (
    <View style={styleCamera.container}>
      <Text style={styleCamera.title}>Cámara Activada</Text>
      <View>
        <Text>IP Webcam</Text>
      </View>
      <WebView
        //source={{ uri: 'http://dispo:dispo@10.216.220.111:8080' }}
        source={{ uri: 'http://62.131.207.209:8080/' }}
        style={styleCamera.webview}
      />
    </View>
  );
}

export default CamaraIP;