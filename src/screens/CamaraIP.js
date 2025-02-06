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
        source={{ uri: 'http://dispo:dispo@10.216.220.111:8080' }}
        // source={{ uri: 'http://190.210.250.149:91' }}
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