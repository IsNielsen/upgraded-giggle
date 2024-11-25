import React from 'react';
import { useOutletContext } from 'react-router-dom';

function Notebook() {
  const { notes } = useOutletContext();

  return (
    <div className='notebook'>
      {notes.map(note => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Notebook;