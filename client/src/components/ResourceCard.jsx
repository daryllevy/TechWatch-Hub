import api from "../services/api";
// import "./Resources.css";

const statusColors = {
  "à découvrir": "gray",
  "en cours": "blue",
  terminée: "green",
  "à revoir": "orange",
  favori: "purple",
};

const allStatuses = [
  "à découvrir",
  "en cours",
  "terminée",
  "à revoir",
  "favori",
];

const levelColors = {
  débutant: "green",
  intermédiaire: "orange",
  avancé: "red",
};

function ResourceCard({ resource, onStatusChange }) {
  const statusColor = statusColors[resource.status] || "gray";
  const levelColor = levelColors[resource.level] || "gray";

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
        <h3>{resource.title}</h3>
        <select
          className={`badge-select badge-${statusColor}`}
          value={resource.status}
          onChange={handleStatusChange}
        >
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <p className="resource-card-description">{resource.description}</p>
      <div className="resource-card-footer">
        <span className="badge">{resource.technology}</span>
        <span className={`badge badge-${levelColor}`}>{resource.level}</span>
      </div>
    </div>
  );
}

export default ResourceCard;
