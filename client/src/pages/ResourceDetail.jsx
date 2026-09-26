import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { statusColors, levelColors } from "../utils/resourceColors";
import useNote from "../hooks/useNotes";

function ResourceDetail() {
  const { id } = useParams(); // lit les segments dynamiques de l'url
  const [resource, setResource] = useState(null);
  const [error, setError] = useState("");
  const note = useNote(id);

  useEffect(() => {
    async function chargerRessource() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/api/resources/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResource(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Impossible d'accéder à cette ressource.",
        );
      }
    }
    chargerRessource();
    note.load();
  }, [id]);

  if (error) {
    return <p className="auth-error">{error}</p>;
  }

  if (!resource) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="resource-detail">
      <div className="resource-detail-header">
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          🔗 lien vers la ressource
        </a>
        <span
          className={`badge badge-${statusColors[resource.status] || "gray"}`}
        >
          {resource.status}
        </span>
      </div>

      <div className="resource-detail-tags">
        <span className="badge">{resource.technology}</span>
        <span
          className={`badge badge-${levelColors[resource.level] || "gray"}`}
        >
          {resource.level}
        </span>
        {resource.tags?.map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>

      <p>{resource.description}</p>

      <div className="notes-section">
        <div className="notes-header">
          <span>📝 mes notes</span>
        </div>
        <textarea
          value={note.content}
          onChange={(e) => note.setContent(e.target.value)}
          placeholder="Écris ta note ici..."
        />
        <div className="notes-save-row">
          {note.justSaved && (
            <span style={{ color: "#0f6e5c", fontSize: "0.8rem" }}>
              ✓ Enregistrée
            </span>
          )}
          {note.error && <span className="auth-error">{note.error}</span>}
          <button
            onClick={note.save}
            className="btn-secondary"
            disabled={note.saving}
          >
            {note.saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetail;
