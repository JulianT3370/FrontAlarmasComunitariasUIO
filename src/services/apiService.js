import axios from "axios";
import API from "./api";

const apiService = {
  getSectores: async () => {
    try {
      const response = await axios.get(API.SECTORES);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo sectores:", error);
      throw error;
    }
  },

  createSector: async (data) => {
    try {
      const response = await axios.post(API.SECTORES, data);
      return response.data;
    } catch (error) {
      console.error("Error creando sector:", error);
      throw error;
    }
  },

  activarAlarma: async (data) => {
    try {
      const response = await axios.post(API.ALARMA, data);
      return response.data;
    } catch (error) {
      console.error("Error activando alarma:", error);
      throw error;
    }
  },
};

export default apiService;
