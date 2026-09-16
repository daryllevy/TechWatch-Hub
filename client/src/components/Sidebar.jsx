import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-links">
        {/*pour éviter de recharger complètement la page*/}
        <Link to="/">Accueil</Link>
        <Link to="/resources">Resources</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
