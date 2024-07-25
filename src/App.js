import './App.css';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AllRoutes from "./AllRoutes";
import { ToastContainerError, ToastContainerSuccess } from "./ReactToast.js";
import NavBar from "./Pages/Navbar/Navbar.jsx";
import React from "react";

function App() {
  const [navChange, setNavChange] = useState(true);
  const [fade, setFade] = useState(true);
  const location = useLocation();

  const handleNavChange = (data) => {
    setFade(data);
  };

  useEffect(() => {
    // Update navChange based on the current route
    setNavChange(location.pathname !== "/" && location.pathname !== "/Login");
  }, [location]);

  return (
    <div className="App">
      {navChange && (
        <div style={{ position: "relative", zIndex: "2" }}>
          <NavBar onDataChange={handleNavChange} />
        </div>
      )}
      <div style={{ filter: fade ? "blur(0)" : "blur(2px)" }}>
        <AllRoutes />
      </div>
      {ToastContainerError}
      {ToastContainerSuccess}
    </div>
  );
}

export default App;
