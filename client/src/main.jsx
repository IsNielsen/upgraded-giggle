import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import RecipeForm from './RecipeForm.jsx';
import Cookbook from './Cookbook.jsx';
import './index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "Cookbook",
        element: <Cookbook />
      },
      {
        path: "RecipeForm",
        element: <RecipeForm />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);