import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { IconTrash, IconEdit, IconCheck, IconX } from '@tabler/icons-react';

export default function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [updating, setUpdating] = useState(false);

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
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('posts')
        .update({ title: editTitle, content: editContent })
        .eq('id', id)
        .eq('user_id', user.id); // só o dono pode editar

      if (error) throw error;

      // Atualiza a lista localmente
      setPosts(posts.map(post =>
        post.id === id
          ? { ...post, title: editTitle, content: editContent }
          : post
      ));
      cancelEdit();
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message);
    } finally {
      setUpdating(false);
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
          <div
            key={post.id}
            className="glass mb-6"
            style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}
          >
            {editingId === post.id ? (
              // ===== MODO DE EDIÇÃO =====
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ marginBottom: '0.75rem', fontWeight: '600' }}
                  maxLength={100}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  style={{ marginBottom: '1rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-ghost"
                    onClick={cancelEdit}
                    disabled={updating}
                  >
                    <IconX size={18} /> Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => saveEdit(post.id)}
                    disabled={updating || !editTitle.trim() || !editContent.trim()}
                  >
                    <IconCheck size={18} />
                    {updating ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            ) : (
              // ===== MODO DE VISUALIZAÇÃO =====
              <>
                <h2 style={{ marginBottom: '0.5rem', paddingRight: '5rem' }}>{post.title}</h2>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                  }}
                >
                  Publicado em:{' '}
                  {new Date(post.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                {user && user.id === post.user_id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      display: 'flex',
                      gap: '0.5rem',
                    }}
                  >
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '0.5rem' }}
                      onClick={() => startEdit(post)}
                      title="Editar postagem"
                    >
                      <IconEdit size={18} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.5rem' }}
                      onClick={() => deletePost(post.id)}
                      title="Apagar postagem"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}