import React, { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

export default function InitialQuestionnaire({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dailyCigarettes: '',
    packPrice: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          daily_cigarettes: parseInt(formData.dailyCigarettes),
          pack_price: parseFloat(formData.packPrice),
        })
        .eq('id', user.id);

      if (error) throw error;
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Quelques informations pour commencer</h2>
        
        <div className="space-y-4">
          <Input
            type="number"
            label="Combien de cigarettes fumez-vous par jour ?"
            required
            min="1"
            value={formData.dailyCigarettes}
            onChange={(e) => setFormData({ ...formData, dailyCigarettes: e.target.value })}
          />

          <div className="relative">
            <Input
              type="number"
              step="0.01"
              min="0"
              label="Quel est le prix de votre paquet ?"
              required
              value={formData.packPrice}
              onChange={(e) => setFormData({ ...formData, packPrice: e.target.value })}
            />
            <span className="absolute right-3 top-9">€</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!formData.dailyCigarettes || !formData.packPrice}
        >
          Commencer
        </Button>
      </form>
    </Card>
  );
}