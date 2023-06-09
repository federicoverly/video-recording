import { useEffect } from 'react';
import { PageLayout } from './components/PageLayout/PageLayout';
import { useAuth } from './contexts/useAuth';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/content');
    }
  }, [user, navigate]);
  return (
    <>
      <PageLayout>
        <div>More content will be here</div>
      </PageLayout>
    </>
  );
}

export default App;
