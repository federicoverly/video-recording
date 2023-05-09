import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ProvideUser } from './contexts/ProvideUser.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage.tsx';
import { Content } from './routes/Content.tsx';
import SignUp from './routes/SignUp/SignUp.tsx';
import Login from './routes/Login/Login.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'signup',
    element: <SignUp />
  },
  {
    path: 'content',
    element: <Content />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProvideUser>
      <RouterProvider router={router} />
    </ProvideUser>
  </React.StrictMode>
);
