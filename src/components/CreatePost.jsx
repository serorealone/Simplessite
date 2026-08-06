import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { IconSend } from '@tabler/icons-react';

export default function CreatePost({ user, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { title, content, user_id: user.id }
        ])
        .select();

      if (error) throw error;
      
      setTitle('');
      setContent('');
      if (onPostCreated) onPostCreated(data[0]);
    } catch (error) {
      alert('Erro ao criar post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass mb-8" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      <h3 className="mb-4">Criar nova postagem</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Título impactante" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div className="mb-4">
          <textarea 
            placeholder="No que você está pensando?" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" type="submit" disabled={loading || !title || !content}>
            <IconSend size={18} />
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}
