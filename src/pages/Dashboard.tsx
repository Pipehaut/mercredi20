import React from 'react';
import { Card } from '../components/ui/Card';
import { Calendar, DollarSign, Cigarette, Clock } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import SessionsContainer from '../components/SessionsContainer';

const mockProfile = {
  quit_date: '2024-03-14T00:00:00.000Z',
  daily_cigarettes: 15,
  pack_price: 11.50,
  first_appointment: '2024-03-20T14:30:00.000Z',
  second_appointment: '2024-03-27T15:00:00.000Z'
};

export default function Dashboard() {
  const calculateSavings = () => {
    const daysQuit = differenceInDays(new Date(), new Date(mockProfile.quit_date));
    const cigarettesPerPack = 20;
    const dailyCost = (mockProfile.daily_cigarettes / cigarettesPerPack) * mockProfile.pack_price;
    return Math.max(0, daysQuit * dailyCost);
  };

  const formatAppointment = (date: string) => {
    return format(new Date(date), "d MMMM yyyy 'à' HH'h'mm", { locale: fr });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold mb-4">Vos rendez-vous</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Premier rendez-vous</p>
              <p className="text-gray-600">{formatAppointment(mockProfile.first_appointment)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Second rendez-vous</p>
              <p className="text-gray-600">{formatAppointment(mockProfile.second_appointment)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Jours sans tabac</p>
              <h3 className="text-3xl font-bold text-blue-600">
                {differenceInDays(new Date(), new Date(mockProfile.quit_date))}
              </h3>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Économies réalisées</p>
              <h3 className="text-3xl font-bold text-green-600">
                {calculateSavings().toFixed(2)} €
              </h3>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-red-50 to-rose-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cigarettes non fumées</p>
              <h3 className="text-3xl font-bold text-red-600">
                {differenceInDays(new Date(), new Date(mockProfile.quit_date)) * mockProfile.daily_cigarettes}
              </h3>
            </div>
            <Cigarette className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Vos séances audio</h2>
        <SessionsContainer />
      </div>
    </div>
  );
}