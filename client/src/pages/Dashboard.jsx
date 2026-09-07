import { useState, useEffect } from "react";
import axios from "axios";
import ResourceCard from "../components/ResourceCard";

function Dashboard() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function chargerRessources() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/resources",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setResources(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    chargerRessources();
  }, []);

  return (
    <div className="resource-grid">
      {resources.map((resource) => (
        <ResourceCard key={resource._id} resource={resource} />
      ))}
    </div>
  );
}

export default Dashboard;
