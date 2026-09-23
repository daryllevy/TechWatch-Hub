import { useState, useEffect } from "react";
import api from "../services/api";

function CollectionFormModal({ onClose, onSaved, collectionToEdit }) {
  const isEditing = Boolean(collectionToEdit);

  const [title, setTitle] = useState(collectionToEdit?.title || "");
  const [description, setDescription] = useState(
    collectionToEdit?.description || "",
  );
  const [isPublic, setIsPublic] = useState(collectionToEdit?.isPublic || false);
  const [allResources, setAllResources] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    collectionToEdit?.resources?.map((r) =>
      typeof r === "string" ? r : r._id,
    ) || [],
  );
  const [error, setError] = useState("");

  useEffect(() => {
    async function chargerRessources() {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllResources(response.data);
    }
    chargerRessources();
  }, []);

  async function toggleResource(id) {
    if (isEditing) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
      );
      return;
    }

    const token = localStorage.getItem("token");
    const alreadyIn = selectedIds.includes(id);

    try {
      if (alreadyIn) {
        await api.delete(`/api/collections/${collectionToEdit._id}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        selectedIds((prev) => prev.filter((r) => r !== id));
      } else {
        await api.post(
          `/api/collections/${collectionToEdit._id}/resources`,
          {
            resourceId: id,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSelectedIds((prev) => [...prev, id]);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = isEditing
        ? await api.put(
            `/api/collections/${collectionToEdit._id}`,
            { title, description, isPublic },
            { headers: { Authorization: `Bearer ${token}` } },
          )
        : await api.post(
            "/api/collections",
            {
              title,
              description,
              isPublic,
              resources: selectedIds,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
      onSaved({
        ...response.data,
        resources: isEditing ? selectedIds : response.data.resources,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue.");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Titre de la collection
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="visibility-box">
            <span>Visibilité</span>
            <div className="visibility-toggle">
              <button
                type="button"
                className={!isPublic ? "active" : ""}
                onClick={() => setIsPublic(false)}
              >
                Privé
              </button>
              <button
                type="button"
                className={isPublic ? "active" : ""}
                onClick={() => setIsPublic(true)}
              >
                Public
              </button>
            </div>
          </div>

          <div>
            <span>Ressources à inclure</span>
            <div className="resource-checklist">
              {allResources.map((r) => (
                <label key={r._id} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r._id)}
                    onChange={() => toggleResource(r._id)}
                  />
                  {r.title}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}
          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}

export default CollectionFormModal;
