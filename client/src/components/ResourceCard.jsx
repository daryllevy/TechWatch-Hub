import { Link } from "react-router-dom";
import { useState } from "react";
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
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState();
  const [noteExists, setNoteExists] = useState(false);
  const [noteLoaded, setNoteLoaded] = useState(false);

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

  async function toggleNotes() {
    const willShow = !showNotes;
    setShowNotes(willShow);

    if (willShow && !noteLoaded) {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/api/resources/${resource._id}/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNoteContent(response.data.content);
        setNoteExists(true);
      } catch (err) {
        // 404 = pas encore de note, comportement normal, pas une vraie erreur
      }

      setNoteLoaded(true);
    }
  }

  async function saveNote() {
    const token = localStorage.getItem("token");
    const method = noteExists ? "put" : "post";
    const response = await api[method](
      `/api/resources/${resource._id}/notes`,
      { content: noteContent },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setNoteExists(true);
  }

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        {onEdit ? (
          <Link
            to={`/resources/${resource._id}`}
            className="resource-card-title"
          >
            <h3>{resource.title}</h3>
          </Link>
        ) : (
          <a
            href={resource.url}
            className="resource-card-title"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>{resource.title}</h3>
          </a>
        )}

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

          {onEdit && (
            <button
              onClick={toggleNotes}
              className="icon-btn"
              title="Mes notes"
            >
              📝
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

      {showNotes && (
        <div className="notes-drawer">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Écris ta note ici ..."
          />
          <button onClick={saveNote} className="btn-secondary">
            Enregistrer
          </button>
        </div>
      )}
    </div>
  );
}

export default ResourceCard;
