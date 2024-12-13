import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [events, setEvents] = useState([]); // State to track the events

  // User authentication

  async function getUser() {
    const res = await fetch('/me/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setUser(body.user);
    setLoading(false);
  }

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

  // Recipe CRUD

  async function getRecipes() {
    const res = await fetch('/recipes/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setRecipes(body.recipes);
  }

  // Fetch events
  async function getEvents() {
    const res = await fetch('/events/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setEvents(body.events);
  }

  // place function calls inside useEffect to make sure they grab the data before rendering

  useEffect(() => {
    getUser();
    getRecipes();
    getEvents();
  }, []);

  /*
  * Outlet does the routing for child components
  * Link is used to navigate to different pages
  */
  return (
    <div className='content'>
      <div className='login'>
        {loading && <div>Loading...</div>}
        {user && <div>Logged in as {user.first_name}</div>}
        <button onClick={logout}>Logout</button>
      </div>
      

      <div className='header'>

        <Link to="/RecipeForm"><button>Create Recipe</button></Link>
        <Link to="/Cookbook"><button>View Recipes</button></Link>
        {/* <Link to="/SearchRecipes"><button>Search Recipes</button></Link> */}
        <Link to="/Calendar"><button>View Calendar</button></Link>
      </div>

      <Outlet context={{ recipes, setRecipes, user, events, setEvents }} />
    </div>
  );
}

export default App;