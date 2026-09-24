import { Link } from "react-router-dom";
import api from "../services/api";
import { statusColors, levelColors } from "../utils/resourceColors";

function ResourceCard({ resource, onStatusChange, onEdit, onDelete }) {
  const statusColor = statusColors[resource.status] || "gray";
  const levelColor = levelColors[resource.level] || "gray";
  const allStatuses = [
    "à découvrir",
    "en cours",
    "terminée",
    "à revoir",
    "favori",
  ];

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/resources/${resource._id}/status`,
        {
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onStatusChange(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <Link to={`/resources/${resource._id}`} className="resource-card-title">
          <h3>{resource.title}</h3>
        </Link>
        <div className="resource-card-icons">
          {onEdit && (
            <button
              onClick={() => onEdit(resource)}
              className="icon-btn"
              title="Modifier"
            >
              ✎
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(resource._id)}
              className="icon-btn"
              title="Supprimer"
            >
              🗑
            </button>
          )}
        </div>
      </div>
      <select
        className={`badge-select badge-${statusColor}`}
        value={resource.status}
        onChange={onStatusChange ? handleStatusChange : undefined}
        disabled={!onStatusChange}
      >
        {allStatuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <p className="resource-card-description">{resource.description}</p>
      <div className="resource-card-footer">
        <span className="badge">{resource.technology}</span>
        <span className={`badge badge-${levelColor}`}>{resource.level}</span>
      </div>
    </div>
  );
}

export default ResourceCard;
