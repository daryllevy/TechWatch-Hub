import { useState } from "react";
import api from "../services/api";

function useNote(resourceId) {
  const [content, setContent] = useState("");
  const [exists, setExists] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/resources/${resourceId}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(response.data.content);
      setExists(true);
    } catch (err) {
      // 404 = pas encore de note, comportement normal
    }
    setLoaded(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const method = exists ? "put" : "post";
      await api[method](
        `/api/resources/${resourceId}/notes`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setExists(true);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return {
    content,
    setContent,
    exists,
    loaded,
    load,
    save,
    saving,
    error,
    justSaved,
  };
}

export default useNote;
