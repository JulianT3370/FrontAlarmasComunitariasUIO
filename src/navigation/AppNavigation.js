import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CrearSector from "../screens/CrearSector";
import ListaSectores from "../screens/ListaSectores";
import ActivarAlarma from "../screens/ActivarAlarma";

const AppNavigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/crear-sector" element={<CrearSector />} />
        <Route path="/sectores" element={<ListaSectores />} />
        <Route path="/activar-alarma" element={<ActivarAlarma />} />
      </Routes>
    </Router>
  );
};

export default AppNavigation;
