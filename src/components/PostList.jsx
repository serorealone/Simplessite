import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { IconTrash } from '@tabler/icons-react';

export default function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar esta postagem?')) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id, user_id: user.id });

      if (error) throw error;
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      alert('Erro ao apagar: ' + error.message);
    }
  };

  if (loading) return <div className="text-center mt-8">Carregando postagens...</div>;

  return (
    <div className="posts-container">
      {posts.length === 0 ? (
        <div className="glass text-center" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Nenhuma postagem ainda.</h3>
          <p>Seja o primeiro a publicar algo!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="glass mb-6" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
            <h2 style={{ marginBottom: '0.5rem', paddingRight: '2rem' }}>{post.title}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Publicado em: {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
            
            {user && user.id === post.user_id && (
              <button 
                className="btn btn-danger"
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem' }}
                onClick={() => deletePost(post.id)}
                title="Apagar postagem"
              >
                <IconTrash size={18} />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
