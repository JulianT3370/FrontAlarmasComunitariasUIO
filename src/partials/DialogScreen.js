import { Text } from 'react-native'
import Dialog from "react-native-dialog";

export default function DialogScreen({
    status,
    titulo,
    descripcion,
    eventCancel
}) {

    return (
        <Dialog.Container visible={status}>
            <Dialog.Title>{titulo}</Dialog.Title>
            <Dialog.Description>
                {descripcion && <Text>{descripcion}</Text>}
            </Dialog.Description>
            <Dialog.Button label="Aceptar" onPress={eventCancel} />
        </Dialog.Container>
    )
}