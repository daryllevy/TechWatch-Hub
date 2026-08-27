import { useState, useEffect } from "react";
import axios from "axios";
import ResourceCard from "./components/ResourceCard";
import "./App.css";

function App() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function loadResources() {
      try {
        const tokenTemporaire =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODZiNTA3YmU4YjM0NGNiOTZhOWI1YyIsInVzZXJuYW1lIjoiaWUiLCJpYXQiOjE3ODc4NDgxMzgsImV4cCI6MTc4NzkzNDUzOH0.2vEGpQl5IBmv_XzHbgQhkBTeR7PEJjquKz9h2mNhxsM";

        const response = await axios.get(
          "http://localhost:5000/api/resources",
          { headers: { Authorization: `Bearer ${tokenTemporaire}` } },
        );
        setResources(response.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    loadResources();
  }, []);

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar-logo">TechWatch Hub</div>
        <nav className="navbar-links">
          <a href="/">Accueil</a>
          <a href="/resources">Ressources</a>
          <a href="/collections">Collections</a>
        </nav>
        <div className="navbar-account">👤</div>
      </header>

      <main className="content">
        <div className="resource-grid">
          {resources.map((resource) => (
            <ResourceCard key= {resource.id} resource = {resource} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
