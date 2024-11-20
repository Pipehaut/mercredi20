import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function Login() {
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      if (email !== 'pipehaut@gmail.com') {
        setMessage('Vérifiez votre boîte mail pour le lien de connexion !');
      }
    } catch (error: any) {
      setMessage(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = email === 'pipehaut@gmail.com';

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Bienvenue sur QuitCoach</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isAdmin ? 'Connexion administrateur' : 'Connectez-vous pour commencer votre parcours'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            type="email"
            required
            label="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
          />

          {isAdmin && (
            <Input
              type="password"
              required
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
            />
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            {isAdmin ? 'Se connecter' : 'Recevoir le lien de connexion'}
          </Button>

          {message && (
            <p className={`mt-4 text-sm text-center ${
              message.includes('erreur') ? 'text-red-600' : 'text-gray-600'
            }`}>
              {message}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}