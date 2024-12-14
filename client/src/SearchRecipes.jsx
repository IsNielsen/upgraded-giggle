import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function SearchRecipes() {
  const { recipes } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // search the recipes for title
  const handleSearch = (e) => {
    e.preventDefault();
    const results = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(results);
  };

  return (
    <div className="search-recipes">
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
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </div>
  );
}

export default SearchRecipes;