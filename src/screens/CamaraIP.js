import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text } from 'react-native';

function CamaraIP() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cámara Activada</Text>
            <WebView 
                source={{ uri: 'http://dispo:dispo@192.168.0.104:8080/video' }}
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