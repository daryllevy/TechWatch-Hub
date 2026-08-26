import './App.css';

function App() {
  return (
    <div className='app-layout'>
      <header className="navbar">
        <div className="navbar-logo">TechWatch Hub</div>
        <nav className="navbar-links">
          <a href="/">Accueil</a>
          <a href="/resources">Ressources</a>
          <a href="/collections">Collections</a>
        </nav>
         <div className="navbar-account">👤</div>
      </header>

      <main className="content">
        {/* Cette zone accueillera les pages, plus tard avec React Router */}
        <p>Zone de contenu — changera selon la page</p>
      </main>
    </div>
  );
}

export default App;