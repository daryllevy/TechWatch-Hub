import api from "../services/api";
// import "./Resources.css";

const statusColors = {
  "à découvrir": "gray",
  "en cours": "blue",
  terminée: "green",
  "à revoir": "orange",
  favori: "purple",
};

const statusOrder = ["à découvrir", "en cours", "terminée"];

const levelColors = {
  débutant: "green",
  intermédiaire: "orange",
  avancé: "red",
};

function getNextStatus(current) {
  const index = statusOrder.indexOf(current);
  if (index === -1 || index === statusOrder.length - 1) return null;
  return statusOrder[index + 1];
}

function ResourceCard({ resource, onStatusChange }) {
  const statusColor = statusColors[resource.status] || "gray";
  const levelColor = levelColors[resource.level] || "gray";
  const nextStatus = getNextStatus(resource.status);

  async function handleAdvanceStatus() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/resources/${resource._id}/status`,
        {
          status: nextStatus,
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
        <span
          className={`badge badge-${statusColor} ${nextStatus ? "badge-clickable" : ""}`}
          onClick={nextStatus ? handleAdvanceStatus : undefined}
          title={
            nextStatus ? `Cliquer pour passer à "${nextStatus}"` : undefined
          }
        >
          {resource.status}
        </span>
      </div>
      <div className="resource-card-footer">
        <span className="badge">{resource.technology}</span>
        <span className={`badge badge-${levelColor}`}>{resource.level}</span>
      </div>
    </div>
  );
}

export default ResourceCard;
