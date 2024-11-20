import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Mail, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  first_appointment: string | null;
  second_appointment: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    firstAppointmentDate: '',
    firstAppointmentTime: '',
    secondAppointmentDate: '',
    secondAppointmentTime: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const firstAppointment = formData.firstAppointmentDate && formData.firstAppointmentTime
        ? `${formData.firstAppointmentDate}T${formData.firstAppointmentTime}`
        : null;
      
      const secondAppointment = formData.secondAppointmentDate && formData.secondAppointmentTime
        ? `${formData.secondAppointmentDate}T${formData.secondAppointmentTime}`
        : null;

      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          first_appointment: firstAppointment,
          second_appointment: secondAppointment,
        }]);

      if (error) throw error;

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        firstAppointmentDate: '',
        firstAppointmentTime: '',
        secondAppointmentDate: '',
        secondAppointmentTime: '',
      });
      setShowForm(false);
      fetchClients();
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (clientId: string, field: string, value: string | null) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ [field]: value })
        .eq('id', clientId);

      if (error) throw error;
      fetchClients();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des clients</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau client</span>
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input
                label="Nom"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input
              type="email"
              label="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1er rendez-vous
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.firstAppointmentDate}
                    onChange={(e) => setFormData({ ...formData, firstAppointmentDate: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={formData.firstAppointmentTime}
                    onChange={(e) => setFormData({ ...formData, firstAppointmentTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2ème rendez-vous
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.secondAppointmentDate}
                    onChange={(e) => setFormData({ ...formData, secondAppointmentDate: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={formData.secondAppointmentTime}
                    onChange={(e) => setFormData({ ...formData, secondAppointmentTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </Button>
              <Button type="submit" loading={loading}>
                Créer le client
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                1er RDV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                2ème RDV
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {client.first_name} {client.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{client.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={client.first_appointment ? format(new Date(client.first_appointment), 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = client.first_appointment 
                          ? format(new Date(client.first_appointment), 'HH:mm')
                          : '00:00';
                        updateAppointment(client.id, 'first_appointment', date ? `${date}T${time}` : null);
                      }}
                    />
                    <Input
                      type="time"
                      value={client.first_appointment ? format(new Date(client.first_appointment), 'HH:mm') : ''}
                      onChange={(e) => {
                        const time = e.target.value;
                        const date = client.first_appointment 
                          ? format(new Date(client.first_appointment), 'yyyy-MM-dd')
                          : format(new Date(), 'yyyy-MM-dd');
                        updateAppointment(client.id, 'first_appointment', `${date}T${time}`);
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={client.second_appointment ? format(new Date(client.second_appointment), 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = client.second_appointment 
                          ? format(new Date(client.second_appointment), 'HH:mm')
                          : '00:00';
                        updateAppointment(client.id, 'second_appointment', date ? `${date}T${time}` : null);
                      }}
                    />
                    <Input
                      type="time"
                      value={client.second_appointment ? format(new Date(client.second_appointment), 'HH:mm') : ''}
                      onChange={(e) => {
                        const time = e.target.value;
                        const date = client.second_appointment 
                          ? format(new Date(client.second_appointment), 'yyyy-MM-dd')
                          : format(new Date(), 'yyyy-MM-dd');
                        updateAppointment(client.id, 'second_appointment', `${date}T${time}`);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}