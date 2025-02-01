import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function CamaraIP() {
    return (
        <View>
            <WebView
                source={{ uri: 'http://10.167.174.104:8080/video' }}
                style={{ marginTop: 20 }}
            />
        </View>
    )
}

export default CamaraIP;