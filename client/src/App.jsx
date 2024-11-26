import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  async function getUser() {
    const res = await fetch('/me/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setUser(body.user);
    setLoading(false);
  }

  async function getRecipes() {
    const res = await fetch('/recipes/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setRecipes(body.recipes);
  }

  useEffect(() => {
    getUser();
    getRecipes();
  }, []);

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin",
    });

    if (res.ok) {
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }

  return (
    <div className='content'>
      {loading && <div>Loading...</div>}
      {user && <div>Logged in as {user.first_name}</div>}
      <button onClick={logout}>Logout</button>
      <Link to="/RecipeForm"><button>Create Recipe</button></Link>
      <Link to="/Cookbook"><button>View Recipes</button></Link>
      <Outlet context={{ recipes, setRecipes }} />
    </div>
  );
}

export default App;