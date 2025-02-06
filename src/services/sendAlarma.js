import { axiosApi } from "../services/axiosFlask";

export const postAlarma = async ({ datos, setDialog }) => {
    await axiosApi.post("/alarma", {
        data: datos
    })
        .then((response) => {
            console.log(response.data)
            setDialog(true)
        })
        .catch((error) => {
            if (error.response) {
                console.error('Error del servidor:', error.response.data.message);
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor.');
            } else {
                console.error('Error al configurar la solicitud:', error.message);
            }
        })
}
