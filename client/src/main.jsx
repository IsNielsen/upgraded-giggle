import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import RecipeForm from './RecipeForm.jsx';
import Cookbook from './Cookbook.jsx';
import SearchRecipes from './SearchRecipes.jsx';
import Calendar from './Calendar.jsx';
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
      // Add more routes here
      // {
      //   path: "newPath", // New path
      //   element: <NewComponent /> // Component to render for the new path
      // }
    ]
  }
]);

// Render the router provider with the created router
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);