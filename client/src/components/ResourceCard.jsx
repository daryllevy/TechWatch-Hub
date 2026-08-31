const statusColors = {
  "à découvrir": "gray",
  "en cours": "blue",
  terminée: "green",
  "à revoir": "orange",
  favori: "purple",
};

const levelColors = {
  débutant: "green",
  intermédiaire: "orange",
  avancé: "red",
};

function ResourceCard({ resource }) {
  const statusColor = statusColors[resource.status] || "gray";
  const levelColor = levelColors[resource.level] || "gray";

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <h3>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.title}
          </a>
        </h3>
        <span className={`badge badge-${statusColor}`}>{resource.status}</span>
      </div>
      <div className="resource-card-footer">
        <span className="badge">{resource.technology}</span>
        <span className={`badge badge-${levelColor}`}>{resource.level}</span>
      </div>
    </div>
  );
}

export default ResourceCard;
