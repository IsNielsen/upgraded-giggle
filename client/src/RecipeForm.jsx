import React, { useState } from 'react';
import * as cookie from 'cookie';
import { useOutletContext } from 'react-router-dom';

function RecipeForm() {
  const { recipes, setRecipes } = useOutletContext();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  async function createRecipe(e) {
    e.preventDefault();

    const res = await fetch("/recipes/", {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify({
        title,
        ingredients,
        instructions,
        tags,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
      },
    });
    const body = await res.json();
    setRecipes([...recipes, body.recipe]);
    setTitle('');
    setIngredients('');
    setInstructions('');
    setTags([]);
    setTagInput('');
  }

  function addTag(e) {
    e.preventDefault();
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  }

  function removeTag(tagToRemove) {
    setTags(tags.filter(t => t !== tagToRemove));
  }

  return (
    <form onSubmit={createRecipe} className='new-recipe-form'>
      Recipe Name
      <input type='text' value={title} onChange={e => setTitle(e.target.value)} />

      Ingredients
      <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} />

      Instructions
      <textarea value={instructions} onChange={e => setInstructions(e.target.value)} />

      Tags
      <div>
        {tags.map(tag => (
          <span key={tag}>
            {tag} <button type="button" onClick={() => removeTag(tag)}>x</button>
          </span>
        ))}
      </div>
      <input type='text' value={tagInput} onChange={e => setTagInput(e.target.value)} />
      <button type='button' onClick={addTag}>Add Tag</button>


      <button type='submit'>Create Recipe</button>
    </form>
  );
}

export default RecipeForm;