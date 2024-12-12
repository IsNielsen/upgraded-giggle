import React from 'react';
import { useOutletContext } from 'react-router-dom';
import * as cookie from 'cookie';

function Cookbook() {
  const { recipes, setRecipes, user } = useOutletContext();

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

  if (!user) {
    return <div>Loading...</div>;
  }

  const myRecipes = recipes.filter(recipe => recipe.user === user.id);
  const publicRecipes = recipes.filter(recipe => recipe.public && recipe.user !== user.id);

  return (
    <div className='cookbook'>
      <h1>My Recipes</h1>
      {myRecipes.map(recipe => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <div>
            {recipe.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <h3>Instructions</h3>
          <ul>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.amount}
              </li>
            ))}
          </ul>

          <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
        </div>
      ))}

      <h1>Public Recipes</h1>
      {publicRecipes.map(recipe => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <div>
            {recipe.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <h3>Instructions</h3>
          <ul>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.amount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Cookbook;