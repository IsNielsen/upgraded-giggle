import React from 'react';
import { useOutletContext } from 'react-router-dom';
import * as cookie from 'cookie';

function Notebook() {
  const { notes, setNotes } = useOutletContext();

  async function deleteNote(id) {
    const res = await fetch(`/notes/${id}/`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookie.parse(document.cookie).csrftoken,
      },
    });

    if (res.ok) {
      setNotes(notes.filter(note => note.id !== id));
    } else {
      console.error('Failed to delete note');
    }
  }

  return (
    <div className='notebook'>
      {notes.map(note => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Notebook;