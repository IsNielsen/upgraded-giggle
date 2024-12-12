import React, { useState } from 'react';
import * as cookie from 'cookie';
import { useOutletContext } from 'react-router-dom';

const predefinedTags = ['GlutenFree', 'Vegan', 'Vegetarian', 'DairyFree', 'NutFree'];

function RecipeForm() {
  const { recipes, setRecipes } = useOutletContext();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [instructionInput, setInstructionInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

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
        public: isPublic,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
      },
    });
    const body = await res.json();
    setRecipes([...recipes, body.recipe]);
    setTitle('');
    setIngredients([]);
    setInstructions([]);
    setTags([]);
    setIsPublic(false);
  }

  function addIngredient(e) {
    e.preventDefault();
    if (ingredientName && ingredientAmount) {
      setIngredients([...ingredients, { name: ingredientName, amount: ingredientAmount }]);
      setIngredientName('');
      setIngredientAmount('');
    }
  }

  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function addInstruction(e) {
    e.preventDefault();
    if (instructionInput) {
      setInstructions([...instructions, instructionInput]);
      setInstructionInput('');
    }
  }

  function removeInstruction(index) {
    setInstructions(instructions.filter((_, i) => i !== index));
  }

  function handleTagChange(tag) {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <form onSubmit={createRecipe} className='new-recipe-form'>
      <div>
        <label>Recipe Name</label>
        <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Ingredients</label>
        <div>
          <input
            type='text'
            placeholder='Ingredient Name'
            value={ingredientName}
            onChange={e => setIngredientName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Amount'
            value={ingredientAmount}
            onChange={e => setIngredientAmount(e.target.value)}
          />
          <button type='button' onClick={addIngredient}>Add Ingredient</button>
        </div>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.amount}
              <button type='button' onClick={() => removeIngredient(index)}>x</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label>Instructions</label>
        <div>
          <input
            type='text'
            placeholder='Instruction'
            value={instructionInput}
            onChange={e => setInstructionInput(e.target.value)}
          />
          <button type='button' onClick={addInstruction}>Add Instruction</button>
        </div>
        <ul>
          {instructions.map((instruction, index) => (
            <li key={index}>
              {instruction}
              <button type='button' onClick={() => removeInstruction(index)}>x</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label>Tags</label>
        <div>
          {predefinedTags.map(tag => (
            <div key={tag}>
              <label>
                <input
                  type='checkbox'
                  checked={tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>
          <input
            type='checkbox'
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
          />
          Public
        </label>
      </div>

      <button type='submit'>Create Recipe</button>
    </form>
  );
}

export default RecipeForm;