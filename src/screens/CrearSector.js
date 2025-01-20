import React, { useState } from "react";
import { crearSector } from "../services/apiService";

const CrearSector = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { nombre, descripcion };
      const response = await crearSector(data);
      alert(response.message);
    } catch (error) {
      alert("Error al crear el sector");
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Descripción:
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Crear Sector</button>
    </form>
  );
};

export default CrearSector;
