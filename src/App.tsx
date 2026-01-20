import "./index.css";
import { AppRouter } from "./app/router";
import { useEffect } from "react";
import { initializeGameData } from "./lib/gameDataService";

function App() {
  console.log("App component rendering");

  // Inicializar servicio de datos del juego al cargar la app
  useEffect(() => {
    initializeGameData().catch((error) => {
      console.error("Failed to initialize game data:", error);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AppRouter />
    </div>
  );
}

export default App;
