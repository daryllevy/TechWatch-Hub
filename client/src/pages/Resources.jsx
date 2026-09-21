import { useState, useEffect } from "react";
import api from "../services/api";
import ResourceCard from "../components/ResourceCard";
import ResourceFormModal from "../components/ResourceFormModal";
import "./Resources.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState("false");
  const [technology, setTechnology] = useState("");
  const [level, setLevel] = useState("");
  const [tag, setTag] = useState("");

  function buildQueryParams() {
    const params = new URLSearchParams(); // permet de construire des chaines de requête
    if (keyword) params.append("keyword", keyword);
    if (technology) params.append("technology", technology);
    if (level) params.append("level", level);
    if (tag) params.append("tag", tag);
    return params.toString();
  }

  async function chargerRessources() {
    try {
      const token = localStorage.getItem("token");
      const query = buildQueryParams();
      const response = await api.get(
        `/api/resources?${query ? `${query}` : ""}`, // évite d'envoyer une URL se terminant par ?
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setResources(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    chargerRessources();
  }, [technology, level, tag]);

  function handleSaved(savedResource) {
    setResources((prev) => {
      const exists = prev.some((r) => r._id === savedResource._id);
      return exists
        ? prev.map((r) => (r._id === savedResource._id ? savedResource : r))
        : [...prev, savedResource];
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer définitivement cette ressource ?")) return; // popup de confirmation
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="resources-page">
      <div className="resources-toolbar">
        <input
          type="text"
          placeholder="rechercher..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && chargerRessources()}
          className="search-input"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-filters"
        >
          ⚙ filtres
        </button>
        <button onClick={chargerRessources} className="btn-secondary">
          Rechercher
        </button>
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Ajouter une ressource
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <input
            placeholder="Technologie"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
          />
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Tous niveaux</option>
            <option value="débutant">Débutant</option>
            <option value="intermédiaire">Intermédiaire</option>
            <option value="avancé">Avancé</option>
          </select>
          <input
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
      )}

      <div className="resource-grid">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            onStatusChange={handleSaved}
            onEdit={setEditingResource}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <ResourceFormModal
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}
      {editingResource && (
        <ResourceFormModal
          onClose={() => setEditingResource(null)}
          onSaved={handleSaved}
          resourceToEdit={editingResource}
        />
      )}
    </div>
  );
}

export default Resources;
