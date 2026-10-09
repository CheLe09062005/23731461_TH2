import { create } from 'zustand';

interface LocationState {
  status: 'undetermined' | 'granted' | 'denied' | 'blocked';
  distance: number;
  fee: number;
  setLocationData: (
    status: 'undetermined' | 'granted' | 'denied' | 'blocked',
    distance: number,
    fee: number,
  ) => void;
}

export const useLocationStore = create<LocationState>(set => ({
  status: 'undetermined',
  distance: 0,
  fee: 0,
  setLocationData: (status, distance, fee) => set({ status, distance, fee }),
}));
