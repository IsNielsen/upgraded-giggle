import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import NoteForm from './NoteForm.jsx';
import Notebook from './Notebook.jsx';
import './index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "Notebook",
        element: <Notebook />
      },
      {
        path: "NoteForm",
        element: <NoteForm />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);