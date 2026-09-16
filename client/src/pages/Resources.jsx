import { useState, useEffect } from "react";
import api from "../services/api";
import ResourceCard from "../components/ResourceCard";
import ResourceFormModal from "../components/ResourceFormModal";
import "./Resources.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function chargerRessources() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResources(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    chargerRessources();
  }, []);

  function handleCreated(newResource) {
    setResources((prev) => [...prev, newResource]); // prev : état actuel juste avant la mise à jour
  }

  return (
    <div className="resources-page">
      <div className="resources-toolbar">
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Ajouter
        </button>
      </div>

      <div className="resource-grid">
        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>

      {showForm && (
        <ResourceFormModal
          onClose={() => setShowForm(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

export default Resources;
