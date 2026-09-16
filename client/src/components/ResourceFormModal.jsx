import { useState } from "react";
import "./ResourceFormModal.css";
import api from "../services/api";

function ResourceFormModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("débutant");
  const [technology, setTechnology] = useState("");
  const [status, setStatus] = useState("à découvrir");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault;
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/resources",
        {
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
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onCreated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Ajouter une ressource</h2>
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
            <button type="submit">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResourceFormModal;
