import React from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

function ViewRecipe() {
  const { eventId, recipeId } = useParams();
  const navigate = useNavigate();
  const { events, setEvents, recipes } = useOutletContext(); // Use context to get events, setEvents, and recipes

  let recipe;

  if (eventId) {
    if (!events) {
      return <div>Loading...</div>;
    }

    const event = events.find(event => event.id === parseInt(eventId));

    if (!event) {
      return <div>Event not found</div>;
    }

    recipe = event.recipe;
  } else if (recipeId) {
    if (!recipes) {
      return <div>Loading...</div>;
    }

    recipe = recipes.find(recipe => recipe.id === parseInt(recipeId));

    if (!recipe) {
      return <div>Recipe not found</div>;
    }
  } else {
    return <div>Invalid request</div>;
  }

  const handleDelete = async () => {
    if (eventId) {
      const csrftoken = getCookie('csrftoken');
      const res = await fetch(`/events/${eventId}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrftoken,
        },
      });

      if (res.ok) {
        setEvents(events.filter(e => e.id !== parseInt(eventId)));
        navigate('/Calendar');
      } else {
        console.error('Failed to delete event');
      }
    }
  };

  // Function to get the CSRF token from cookies
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <div className="view-recipe">
      <h1>{recipe.title}</h1>
      <div>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.name} - {ingredient.amount}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Instructions</h3>
        <ul>
          {recipe.instructions && recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>
      {eventId && <button onClick={handleDelete}>Delete from Event List</button>}
    </div>
  );
}

export default ViewRecipe;