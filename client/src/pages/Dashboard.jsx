import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const STATUSES = ["à découvrir", "en cours", "terminée", "favori"];


function Dashboard() {
  const [resources, setResources] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function charger() {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [resResponse, colResponse] = await Promise.all([
        api.get("/api/resources", { headers }),
        api.get("/api/collections/public"),
      ]);
      setResources(resResponse.data);
      setTopCollections(colResponse.data.slice(0, 5));
    }
    charger();
  }, []);

  const counts = STATUSES.map((status) => ({
    status,
    count: resources.filter((r) => r.status === status).length,
  }));

  const recentActivity = [...resources]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const [topCollections, setTopCollections] = useState([]);

  return (
    <div>
      <div className="dashboard-counts">
        {counts.map(({ status, count }) => (
          <div key={status} className="dashboard-count-card">
            <span className="dashboard-count-number">{count}</span>
            <span className="dashboard-count-label">{status}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-panels">
        <div className="dashboard-panel">
          <h4>Activité récente</h4>
          {recentActivity.length === 0 && (
            <p className="notes-placeholder">Rien pour l'instant.</p>
          )}
          {recentActivity.map((r) => (
            <div key={r._id} className="dashboard-activity-item">
              {r.title}
            </div>
          ))}
        </div>
        <div className="dashboard-panel">
          <h4>Collections populaires</h4>
          {topCollections.length === 0 && (
            <p className="notes-placeholder">
              Aucune collection publique pour l'instant.
            </p>
          )}
          {topCollections.map((c) => (
            <Link
              key={c._id}
              to={`/collections/${c._id}`}
              className="dashboard-activity-item"
            >
              {c.title} — ♥ {c.likesCount}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
