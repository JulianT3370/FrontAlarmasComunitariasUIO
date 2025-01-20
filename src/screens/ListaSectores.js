import React, { useEffect, useState } from "react";
import { obtenerSectores } from "../services/apiService";

const ListaSectores = () => {
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const data = await obtenerSectores();
        setSectores(data);
      } catch (error) {
        console.error("Error al obtener sectores:", error);
      }
    };

    fetchSectores();
  }, []);

  return (
    <div>
      <h2>Sectores</h2>
      <ul>
        {sectores.map((sector, index) => (
          <li key={index}>
            {sector.nombre} - {sector.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaSectores;
