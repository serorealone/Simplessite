import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { IconMail, IconLock, IconLogin } from '@tabler/icons-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Cadastro realizado! Verifique seu email ou faça login se o auto-confirm estiver ativado no Supabase.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
      <div className="text-center mb-6">
        <IconLogin size={48} color="var(--primary)" />
        <h2 className="mt-4">{isSignUp ? 'Criar Conta' : 'Fazer Login'}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isSignUp ? 'Junte-se ao nosso blog' : 'Bem-vindo de volta'}
        </p>
      </div>

      <form onSubmit={handleAuth}>
        <div className="mb-4">
          <div style={{ position: 'relative' }}>
            <IconMail size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="email" 
              placeholder="Seu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '40px' }}
              required 
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div style={{ position: 'relative' }}>
            <IconLock size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="password" 
              placeholder="Sua senha secreta" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '40px' }}
              required 
            />
          </div>
        </div>

        {message && (
          <div className="mb-4" style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <button 
          className="btn btn-primary" 
          type="submit" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
        </button>
      </form>

      <div className="text-center mt-6">
        <button 
          type="button"
          className="btn btn-ghost" 
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ fontSize: '0.9rem' }}
        >
          {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
}
