import React, { useState } from "react";
import { activarAlarma } from "../services/apiService";

const ActivarAlarma = () => {
  const [sector, setSector] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { sector };
      const response = await activarAlarma(data);
      alert(response.message);
    } catch (error) {
      alert("Error al activar la alarma");
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <label>
        Sector:
        <input
          type="text"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Activar Alarma</button>
    </form>
  );
};

export default ActivarAlarma;
