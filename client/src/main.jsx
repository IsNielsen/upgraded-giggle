import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import RecipeForm from './RecipeForm.jsx';
import Cookbook from './Cookbook.jsx';
import SearchRecipes from './SearchRecipes.jsx';
import Calendar from './Calendar.jsx';
import ViewRecipe from './ViewRecipe.jsx'; // Import the new ViewRecipe component
import ShoppingList from './ShoppingList.jsx';
import './index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';

// Create a router with initial routes
const router = createHashRouter([
  {
    path: '/', // Root path
    element: <App />, // Main component to render for the root path
    children: [
      {
        path: "Cookbook", // Path for the Cookbook component
        element: <Cookbook /> // Component to render for the Cookbook path
      },
      {
        path: "RecipeForm", // Path for the RecipeForm component
        element: <RecipeForm /> // Component to render for the RecipeForm path
      },
      {
        path: "SearchRecipes", // Path for the SearchRecipes component
        element: <SearchRecipes /> // Component to render for the SearchRecipes path
      },
      {
        path: "Calendar", // Path for the Calendar component
        element: <Calendar /> // Component to render for the Calendar path
      },
      {
        path: "ViewRecipe/:eventId", // Path for the ViewRecipe component with eventId
        element: <ViewRecipe /> // Component to render for the ViewRecipe path
      },
      {
        path: "ViewRecipeById/:recipeId", // Path for the ViewRecipe component with recipeId
        element: <ViewRecipe /> // Component to render for the ViewRecipe path
      },
      {
        path: "ShoppingList", // Path for the ShoppingList component
        element: <ShoppingList /> // Component to render for the ShoppingList path
      },
    ]
  }
]);

// Render the router provider with the created router
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);