import { useState, useEffect } from "react";
import api from "../services/api";
import CollectionFormModal from "../components/CollectionFormModal";
import { Link } from "react-router-dom";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    async function charger() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/collections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollections(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    charger();
  }, []);

  function handleSaved(saved) {
    setCollections((prev) => {
      const exists = prev.some((c) => c._id === saved._id);
      return exists
        ? prev.map((c) => (c._id === saved._id ? saved : c))
        : [...prev, saved];
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer définitivement cette collection ?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggleVisibility(collection) {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/collections/${collection._id}/visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      handleSaved(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="resources-toolbar">
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Créer une collection
        </button>
      </div>

      <div className="resource-grid">
        {collections.map((c) => (
          <div key={c._id} className="resource-card">
            <div className="collection-card-header">
              <Link
                to={`/collections/${c._id}`}
                className="resource-card-title"
              >
                <h3>{c.title}</h3>
              </Link>
              <div className="resources-card-icons">
                <button
                  onClick={() => handleToggleVisibility(c)}
                  className={`badge badge-clickable-toggle badge-${c.isPublic ? "green" : "gray"}`}
                >
                  {c.isPublic ? "Public" : "Privé"}
                </button>
                <button
                  onClick={() => setEditingCollection(c)}
                  className="icon-btn"
                  title="Modifier"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="icon-btn"
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>
            </div>
            <p className="resource-card-description">{c.description}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <CollectionFormModal
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {editingCollection && (
        <CollectionFormModal
          onClose={() => setEditingCollection(null)}
          onSaved={handleSaved}
          collectionToEdit={editingCollection}
        />
      )}
    </div>
  );
}

export default Collections;
