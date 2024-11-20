import React from 'react';
import { Link } from 'react-router-dom';
import { Cigarette, Heart, PiggyBank } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Prenez le contrôle de votre</span>
          <span className="block text-indigo-600">vie sans tabac</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
          Commencez votre parcours vers une vie plus saine avec QuitCoach. Notre approche personnalisée vous accompagne à chaque étape de votre sevrage tabagique.
        </p>
        <div className="mt-8">
          <Link to="/login">
            <Button size="lg">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-indigo-100 p-3">
              <Heart className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Suivi personnalisé</h3>
            <p className="mt-2 text-base text-gray-500">
              Un accompagnement adapté à vos habitudes et objectifs personnels.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-indigo-100 p-3">
              <PiggyBank className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Économies réalisées</h3>
            <p className="mt-2 text-base text-gray-500">
              Visualisez l'argent économisé depuis l'arrêt du tabac.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-indigo-100 p-3">
              <Cigarette className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Objectifs progressifs</h3>
            <p className="mt-2 text-base text-gray-500">
              Des étapes claires et atteignables pour votre sevrage.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}