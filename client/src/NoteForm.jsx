import React, { useState } from 'react';
import * as cookie from 'cookie';
import { useOutletContext } from 'react-router-dom';

function NoteForm() {
  const { notes, setNotes } = useOutletContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  async function createNote(e) {
    e.preventDefault();

    const res = await fetch("/notes/", {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify({ 
        title, 
        content 
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
      },
    });
    const body = await res.json();
    setNotes([...notes, body.note]);
    setTitle('');
    setContent('');
  }

  return (
    <form onSubmit={createNote} className='new-note-form'>
      Title
      <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
      Content
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button type='submit'>Create Note</button>
    </form>
  );
}

export default NoteForm;