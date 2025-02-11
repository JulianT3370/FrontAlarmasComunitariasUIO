import { axiosApi } from "./axiosFlask";

export const saveFile = async ({ fileUri }) => {
    const fileName = fileUri.split('/').pop();
    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        type: 'audio/m4a',
        name: fileName,
    });

    try {
        console.log("Enviando archivo...");
        const response = await axiosApi.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Archivo enviado correctamente");
        // console.log(response.data)
        return response.data.transcripcion
    } catch (error) {
        console.error("Error al enviar el archivo:", error);
        if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
        } else if (error.request) {
            console.error("No se recibió respuesta del servidor:", error.request);
        } else {
            console.error("Error en la solicitud:", error.message);
        }
    }
};