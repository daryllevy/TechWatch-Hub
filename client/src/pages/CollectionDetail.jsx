import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ResourceCard from "../components/ResourceCard";
import ResourceFormModal from "../components/ResourceFormModal";

function CollectionDetail() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  async function chargerCollection() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollection(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    chargerCollection();
  }, [id]);

  async function handleDelete(resourceId) {
    if (!window.confirm("Retirer cette ressource de la collection ?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/collections/${id}/resources/${resourceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    chargerCollection();
  }

  async function handleDeleteCollection() {
    if (!window.confirm("Supprimer définitivement cette collection ?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/collections/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/collections");
  }

  if (!collection) return <p>Chargement...</p>;

  return (
    <div>
      <div className="collection-card-header">
        <h2>{collection.title}</h2>
        <div className="resources-card-icons">
          <span
            className={`badge badge-${collection.isPublic ? "green" : "gray"}`}
          >
            {collection.isPublic ? "Public" : "Privé"}
          </span>
          <button
            onClick={handleDeleteCollection}
            className="icon-btn"
            title="Supprimer"
          >
            🗑
          </button>
        </div>
      </div>
      <p>{collection.description}</p>

      <div className="resource-grid" style={{ marginTop: "1.5rem" }}>
        {collection.resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            onStatusChange={chargerCollection}
            onEdit={setEditingResource}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingResource && (
        <ResourceFormModal
          onClose={() => setEditingResource(null)}
          onSaved={chargerCollection}
          resourceToEdit={editingResource}
        />
      )}
    </div>
  );
}

export default CollectionDetail;
