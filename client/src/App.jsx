import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  async function getUser() {
    const res = await fetch('/me/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setUser(body.user);
    setLoading(false);
  }

  async function getNotes() {
    const res = await fetch('/notes/', {
      credentials: "same-origin",
    });
    const body = await res.json();
    setNotes(body.notes);
  }

  useEffect(() => {
    getUser();
    getNotes();
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
      <Link to="/NoteForm"><button>Create Note</button></Link>
      <Link to="/Notebook"><button>View Notes</button></Link>
      <Outlet context={{ notes, setNotes }} />
    </div>
  );
}

export default App;