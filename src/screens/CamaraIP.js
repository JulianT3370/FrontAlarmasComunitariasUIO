import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function CamaraIP() {
    return (
            <WebView
                source={{ uri: 'http://dispo:dispo@10.167.174.104:8080/video' }}
                style={{ marginTop: 20 }}
            />
    )
}

export default CamaraIP;