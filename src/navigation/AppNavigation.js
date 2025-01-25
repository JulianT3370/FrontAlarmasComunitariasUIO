import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CrearSector from "../screens/CrearSector";
import ListaSectores from "../screens/ListaSectores";
import ActivarAlarma from "../screens/ActivarAlarma";
import Login from "../screens/Login";

const AppNavigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crear-sector" element={<CrearSector />} />
        <Route path="/sectores" element={<ListaSectores />} />
        <Route path="/activar-alarma" element={<ActivarAlarma />} />
      </Routes>
    </Router>
  );
};

export default AppNavigation;
