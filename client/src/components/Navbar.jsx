import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">TechWatch Hub</div>
      <Link to="/login" className="navbar-account">
        👤
      </Link>
    </header>
  );
}

export default Navbar;
