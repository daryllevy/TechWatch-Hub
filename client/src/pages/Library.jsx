import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Library() {
  const [collections, setCollections] = useState([]);
  const [keyword, setKeyword] = useState("");

  async function charger() {
    try {
      const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""; // échappe les caractères spéciaux des mots-clés dans l'url
      const response = await api.get(`/api/collections/public${query}`);
      setCollections(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  return (
    <div>
      <div className="resources-toolbar">
        <input
          type="text"
          value={keyword}
          placeholder="rechercher une collection..."
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && charger()}
          className="search-input"
        />
      </div>

      <div className="resource-grid">
        {collections.map((c) => (
          <Link
            key={c._id}
            to={`/collections/${c._id}`}
            className="library-card-link"
          >
            <div className="resource-card">
              <h3>{c.title}</h3>
              <p className="resource-card-description">{c.description}</p>
              <p className="library-owner">
                par {c.userId?.username || "utilisateur"}
              </p>
              <div className="library-stats">
                <span>♥ {c.likesCount}</span>
                <span>👁 {c.viewCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Library;
