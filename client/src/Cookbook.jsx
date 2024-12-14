import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import * as cookie from 'cookie';

function Cookbook() {
  const { recipes, setRecipes, user } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    const results = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRecipes(results);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const myRecipes = recipes.filter(recipe => recipe.user === user.id);
  const publicRecipes = recipes.filter(recipe => recipe.public && recipe.user !== user.id);

  return (
    <div className='cookbook'>
      <h1>Search Recipes</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
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
              <Link to={`/ViewRecipeById/${recipe.id}`}><button>View Recipe</button></Link>
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
      <hr />

      <h1>My Recipes</h1>
      {myRecipes.map(recipe => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <div>
            {recipe.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          {/* <h3>Instructions</h3>
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
          </ul> */}

          <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
          <Link to={`/ViewRecipeById/${recipe.id}`}><button>View Recipe</button></Link>
        </div>
      ))}
      <hr />

      <h1>Public Recipes</h1>
      {publicRecipes.map(recipe => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <ul>
            {recipe.tags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          {/* <h3>Instructions</h3>
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
          </ul> */}

          <Link to={`/ViewRecipeById/${recipe.id}`}><button>View Recipe</button></Link>
        </div>
      ))}
    </div>
  );
}

export default Cookbook;