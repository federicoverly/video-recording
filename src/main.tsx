import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ProvideUser } from './contexts/ProvideUser.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage.tsx';
import { Content } from './routes/Content/Content.tsx';
import SignUp from './routes/SignUp/SignUp.tsx';
import Login from './routes/Login/Login.tsx';
import { VideoDetails } from './routes/VideoDetails/VideoDetails.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

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
  },
  {
    path: 'video/:id',
    element: <VideoDetails />
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 15 * 60000,
      keepPreviousData: false,
      refetchInterval: 15 * 60000,
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retryOnMount: true,
      staleTime: 4 * 60000
    },
    mutations: {
      retry: 0
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProvideUser>
        <RouterProvider router={router} />
      </ProvideUser>
    </QueryClientProvider>
  </React.StrictMode>
);
