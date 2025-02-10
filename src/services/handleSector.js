import { axiosApi } from "./axiosFlask";

export const handleSector = async ({ newSector }) => {
    try {
        const response = await axiosApi.post("/sendSector", {
            data: newSector
        });
        return response.data.message
    } catch (error) {
        if (error.response) {
            return error.response.data.message
        }
    }
}