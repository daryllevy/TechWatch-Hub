function ResourceCard({ resource }) {
  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <h3>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.title}
          </a>
        </h3>
        <span className="badge badge-status">{resource.status}</span>
      </div>
      <div className="resource-card-footer">
        <span className="badge">{resource.technology}</span>
        <span className="badge">{resource.level}</span>
      </div>
    </div>
  );
}

export default ResourceCard;
