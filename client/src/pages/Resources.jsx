import { useState, useEffect } from "react";
import api from "../services/api";
import ResourceCard from "../components/ResourceCard";
import ResourceFormModal from "../components/ResourceFormModal";
import "./Resources.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
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

  function handleSaved(savedResource) {
    setResources((prev) => {
      const exists = prev.some((r) => r._id === savedResource._id);
      return exists
        ? prev.map((r) => (r._id === savedResource._id ? savedResource : r))
        : [...prev, savedResource];
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer définitivement cette ressource ?")) return; // popup de confirmation
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
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
          <ResourceCard
            key={resource._id}
            resource={resource}
            onStatusChange={handleSaved}
            onEdit={setEditingResource}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <ResourceFormModal
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}
      {editingResource && (
        <ResourceFormModal
          onClose={() => setEditingResource(null)}
          onSaved={handleSaved}
          resourceToEdit={editingResource}
        />
      )}
    </div>
  );
}

export default Resources;
