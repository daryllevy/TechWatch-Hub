import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { statusColors, levelColors } from "../utils/resourceColors";

function ResourceDetail() {
  const { id } = useParams(); // lit les segments dynamiques de l'url
  const [resource, setResource] = useState(null);
  const [error, setError] = useState("");

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
          <button
            className="btn-add"
            disabled
            title="(A implémenter plus tard)"
          >
            + ajouter
          </button>
        </div>
        <div className="notes-placeholder">A implémenter plus tard</div>
      </div>
    </div>
  );
}

export default ResourceDetail;
