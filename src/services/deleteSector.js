import { axiosApi } from "./axiosFlask";

export const deleteSector = async ({ sector_name }) => {
    try {
        const response = await axiosApi.post("/deleteSector", {
            sector_name : sector_name
        })
        return response.data.message
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