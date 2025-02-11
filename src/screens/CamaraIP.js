import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text } from 'react-native';

function CamaraIP() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cámara Activada</Text>
      <View>
        <Text>IP Webcam</Text>
      </View>
      <WebView
        //source={{ uri: 'http://dispo:dispo@10.216.220.111:8080' }}
        source={{ uri: 'http://62.131.207.209:8080/' }}
        style={styles.webview}
      />
    </View>
  );
}


export default CamaraIP;