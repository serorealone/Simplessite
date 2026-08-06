import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import { IconLogout, IconSparkles } from '@tabler/icons-react';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="container text-center mt-8">Carregando o aplicativo...</div>;
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <IconSparkles size={32} />
          Meu Blog
        </h1>
        
        {session ? (
          <button className="btn btn-ghost" onClick={handleLogout}>
            <IconLogout size={20} /> Sair
          </button>
        ) : (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Modo de Leitura</span>
        )}
      </header>

      <main>
        {session ? (
          <>
            <CreatePost user={session.user} onPostCreated={() => window.location.reload()} />
            <h3 className="mb-4" style={{ color: 'var(--text-secondary)' }}>Feed Recente</h3>
            <PostList user={session.user} />
          </>
        ) : (
          <>
            <Auth />
            <div style={{ marginTop: '4rem' }}>
              <h3 className="mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>Ou apenas leia as novidades abaixo</h3>
              <PostList user={null} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
