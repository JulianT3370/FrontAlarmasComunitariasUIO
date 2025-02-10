import { axiosApi } from "./axiosFlask";

export const getSectores = async () => {
    try {
        const response = await axiosApi.get("/fgetSectores");
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error del servidor:', error.response.data.message);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor.');
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
    }
}
