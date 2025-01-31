import useState from 'react'
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function CamaraIP() {
    return (
        <WebView
            source={{ uri: 'http://dispo:dispo@192.168.0.100:8080/video' }}
            style={{ marginTop: 20 }}
        />
    )
}

export default CamaraIP;