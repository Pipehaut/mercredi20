import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestionnaireState {
  tobaccoType: 'cigarette' | 'rolling' | null;
  dailyConsumption: number;
  packagePrice: number;
  smokingHabits: string[];
  startDate: string | null;
  setTobaccoType: (type: 'cigarette' | 'rolling') => void;
  setDailyConsumption: (amount: number) => void;
  setPackagePrice: (price: number) => void;
  setSmokingHabits: (habits: string[]) => void;
  setStartDate: (date: string) => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      tobaccoType: null,
      dailyConsumption: 0,
      packagePrice: 0,
      smokingHabits: [],
      startDate: null,
      setTobaccoType: (type) => set({ tobaccoType: type }),
      setDailyConsumption: (amount) => set({ dailyConsumption: amount }),
      setPackagePrice: (price) => set({ packagePrice: price }),
      setSmokingHabits: (habits) => set({ smokingHabits: habits }),
      setStartDate: (date) => set({ startDate: date }),
    }),
    {
      name: 'questionnaire-storage',
    }
  )
);