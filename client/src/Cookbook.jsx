import React from 'react';
import { useOutletContext } from 'react-router-dom';
import * as cookie from 'cookie';

function Cookbook() {
  const { recipes, setRecipes } = useOutletContext();

  async function deleteRecipe(id) {
    const res = await fetch(`/recipes/${id}/`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookie.parse(document.cookie).csrftoken,
      },
    });

    if (res.ok) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } else {
      console.error('Failed to delete recipe');
    }
  }

  return (
    <div className='cookbook'>
      {recipes.map(recipe => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <p>{recipe.content}</p>
          <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Cookbook;