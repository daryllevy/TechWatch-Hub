import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ResourceCard from "../components/ResourceCard";
import ResourceFormModal from "../components/ResourceFormModal";
import getCurrentUserId from "../utils/getCurrentUserId";

function CollectionDetail() {
  const navigate = useNavigate();
  const hasLoaded = useRef(false);

  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const currentUserId = getCurrentUserId();

  async function chargerCollection() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollection(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function chargerComments() {
    try {
      const response = await api.get(`/api/collections/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    chargerComments();
  }, [id]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    chargerCollection();
  }, [id]);

  const isOwner =
    collection && collection.userId?._id
      ? collection.userId._id === getCurrentUserId()
      : collection?.userId === getCurrentUserId();

  async function handleDelete(resourceId) {
    if (!window.confirm("Retirer cette ressource de la collection ?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/collections/${id}/resources/${resourceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    chargerCollection();
  }

  async function handleAddComment(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Connectez-vous pour commenter.");
      return;
    }
    if (!newComment.trim()) return;

    await api.post(
      `/api/collections/${id}/comments`,
      { content: newComment },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setNewComment("");
    chargerComments();
  }

  async function handleUpdateComment(commentId) {
    const token = localStorage.getItem("token");
    await api.put(
      `/api/collections/${id}/comments/${commentId}`,
      { content: editingContent },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setEditingCommentId(null);
    chargerComments();
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/collections/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    chargerComments();
  }

  async function handleDeleteCollection() {
    if (!window.confirm("Supprimer définitivement cette collection ?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/collections/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/collections");
  }

  if (!collection) return <p>Chargement...</p>;

  return (
    <div>
      <div className="collection-card-header">
        <h2>{collection.title}</h2>
        <div className="resources-card-icons">
          <span
            className={`badge badge-${collection.isPublic ? "green" : "gray"}`}
          >
            {collection.isPublic ? "Public" : "Privé"}
          </span>
          {isOwner && (
            <button
              onClick={handleDeleteCollection}
              className="icon-btn"
              title="Supprimer"
            >
              🗑
            </button>
          )}
        </div>
      </div>
      <p>{collection.description}</p>

      <div className="resource-grid" style={{ marginTop: "1.5rem" }}>
        {collection.resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            onStatusChange={isOwner ? chargerCollection : undefined}
            onEdit={isOwner ? setEditingResource : undefined}
            onDelete={isOwner ? handleDelete : undefined}
          />
        ))}
      </div>

      <div className="comments-section">
        <h4>Commentaires</h4>

        <form onSubmit={handleAddComment} className="comment-form">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
          />
          <button type="submit">Publier</button>
        </form>

        {comments.map((c) => (
          <div key={c._id} className="comment-item">
            {editingCommentId === c._id ? (
              <>
                <input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button onClick={() => handleUpdateComment(c._id)}>✓</button>
              </>
            ) : (
              <>
                <p>
                  <strong>{c.userId?.username || "utilisateur"}</strong> —{" "}
                  {c.content}
                </p>
                {c.userId?._id === currentUserId && (
                  <div className="comment-actions">
                    <button
                      onClick={() => {
                        setEditingCommentId(c._id);
                        setEditingContent(c.content);
                      }}
                    >
                      ✎
                    </button>
                    <button onClick={() => handleDeleteComment(c._id)}>
                      🗑
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {editingResource && (
        <ResourceFormModal
          onClose={() => setEditingResource(null)}
          onSaved={chargerCollection}
          resourceToEdit={editingResource}
        />
      )}
    </div>
  );
}

export default CollectionDetail;
