import { axiosApi } from "./axiosFlask";

export const handleSector = async ({ newSector }) => {
    try {
        await axiosApi.post("/sendSector", {
            data: newSector
        });
    } catch (error) {
        console.error("Error sending sector data:", error);
        throw error;
    }
}