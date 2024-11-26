import React, { useState } from 'react';
import * as cookie from 'cookie';
import { useOutletContext } from 'react-router-dom';

function RecipeForm() {
  const { recipes, setRecipes } = useOutletContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  async function createRecipe(e) {
    e.preventDefault();

    const res = await fetch("/recipes/", {
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
    setRecipes([...recipes, body.recipe]);
    setTitle('');
    setContent('');
  }

  return (
    <form onSubmit={createRecipe} className='new-recipe-form'>
      Recipe Name
      <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
      Content
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button type='submit'>Create Recipe</button>
    </form>
  );
}

export default RecipeForm;