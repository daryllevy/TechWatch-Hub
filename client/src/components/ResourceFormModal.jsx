import { useState } from "react";
import "./ResourceFormModal.css";
import api from "../services/api";

function ResourceFormModal({ onClose, onSaved, resourceToEdit }) {
  const isEditing = Boolean(resourceToEdit);

  const [title, setTitle] = useState(resourceToEdit?.title || "");
  const [url, setUrl] = useState(resourceToEdit?.url || "");
  const [description, setDescription] = useState(
    resourceToEdit?.description || "",
  );
  const [level, setLevel] = useState(resourceToEdit?.level || "débutant");
  const [technology, setTechnology] = useState(
    resourceToEdit?.technology || "",
  );
  const [status, setStatus] = useState(resourceToEdit?.status || "à découvrir");
  const [tags, setTags] = useState(resourceToEdit?.tags?.join(", ") || "");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault;
    setError("");
    const token = localStorage.getItem("token");
    const payload = {
      title,
      url,
      description,
      technology,
      level,
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      const response = isEditing
        ? await api.put(`/api/resources/${resourceToEdit._id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await api.post("/api/resources", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
      onSaved(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Modifer la resource" : "Ajouter une ressource"} </h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Titre
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Lien
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
          <label>
            Technologie
            <input
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              required
            />
          </label>
          <label>
            Niveau
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
            </select>
          </label>
          <label>
            statut
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="à découvrir">A découvrir</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
              <option value="à revoir">A revoir</option>
              <option value="favori">Favori</option>
            </select>
          </label>
          <label>
            Tags (séparés par des virgules)
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, back-end, web"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit">{isEditing ? "Enregistrer" : "Créer"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResourceFormModal;
