import { useQuery } from '@tanstack/react-query';
import { fetchSessions } from '../lib/api';

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data?.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  });
}