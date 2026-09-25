import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import getCurrentUserId from "../utils/getCurrentUserId";

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

  async function handleToggleLike(e, collectionId) {
    e.preventDefault(); //empêche le clic sur le coeur de déclencher le <Link> englobant
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Connectez vous pour pouvoir liker une collection.");
      return;
    }

    try {
      const response = await api.post(
        `/api/collections/${collectionId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCollections((prev) =>
        prev.map((c) =>
          c._id === collectionId
            ? {
                ...c,
                likesCount: response.data.likesCount,
                _justToggled: response.data.liked,
              }
            : c,
        ),
      );
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
        {collections.map((c) => {
          const currentUserId = getCurrentUserId();
          const isLiked =
            c._justToggled !== undefined
              ? c._justToggled
              : c.likedBy?.some(
                  (id) => id === currentUserId || id?._id === currentUserId,
                );
          return (
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
                  <button
                    onClick={(e) => handleToggleLike(e, c._id)}
                    className={`like-btn ${isLiked ? "liked" : ""}`}
                  >
                    {isLiked ? "♥" : "♡"}
                  </button>
                  <span>👁 {c.viewCount}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Library;
