"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useLocalStorage from '../hooks/useLocalStorage';
import { loadUserData, saveUserData } from '../lib/userPersistence';

export interface UserProfile {
  name: string;
  email: string;
}

export interface Biometrics {
  height: string;
  weight: string;
  age: string;
  gender: string;
}

export interface Macros {
  carbs: string;
  protein: string;
  fat: string;
}

export interface MealEntry {
  id: string;
  name: string;
  emoji?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  time: string;
  fullDate: string; // ISO Date YYYY-MM-DD
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
}

export interface ExerciseEntry {
  id: string;
  name: string;
  calories: number;
  duration: string;
  time: string;
  fullDate: string; // ISO Date YYYY-MM-DD
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface WaterLog {
  date: string;
  glasses: number;
}

interface UserContextType {
  profile: UserProfile;
  biometrics: Biometrics;
  macros: Macros;
  goal: string;
  meals: MealEntry[];
  exercises: ExerciseEntry[];
  weightLogs: WeightLog[];
  waterLogs: WaterLog[];
  dynamicTargets: { cals: number; carbs: number; protein: number; fat: number };
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateBiometrics: (biometrics: Partial<Biometrics>) => void;
  updateMacros: (macros: Partial<Macros>) => void;
  updateGoal: (goal: string) => void;
  addMeal: (meal: Omit<MealEntry, 'id' | 'time' | 'fullDate'>, date?: string) => void;
  deleteMeal: (id: string) => void;
  addExercise: (exercise: Omit<ExerciseEntry, 'id' | 'time' | 'fullDate'>, date?: string) => void;
  addWeightLog: (weight: number, date?: string) => void;
  updateWater: (glasses: number, date?: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useLocalStorage<UserProfile>('fb_profile', { name: '', email: '' });
  const [biometrics, setBiometrics] = useLocalStorage<Biometrics>('fb_biometrics', { height: '', weight: '', age: '', gender: '' });
  const [macros, setMacros] = useLocalStorage<Macros>('fb_macros', { carbs: '', protein: '', fat: '' });
  const [goal, setGoal] = useLocalStorage<string>('fb_goal', '');
  const [meals, setMeals] = useLocalStorage<MealEntry[]>('fb_meals', []);
  const [exercises, setExercises] = useLocalStorage<ExerciseEntry[]>('fb_exercises', []);
  const [weightLogs, setWeightLogs] = useLocalStorage<WeightLog[]>('fb_weightLogs', []);
  const [waterLogs, setWaterLogs] = useLocalStorage<WaterLog[]>('fb_waterLogs', []);
  const [dynamicTargets, setDynamicTargets] = useState({ cals: 2000, carbs: 250, protein: 125, fat: 67 });
  const [remoteSyncReady, setRemoteSyncReady] = useState(false);

  const currentEmail = session?.user?.email;
  const currentName = session?.user?.name ?? profile.name;

  useEffect(() => {
    if (!currentEmail) {
      return;
    }

    const loadRemoteData = async () => {
      const remoteData = await loadUserData(currentEmail);
      if (remoteData) {
        setProfile({ name: remoteData.name || currentName, email: currentEmail });
        setBiometrics(remoteData.biometrics);
        setMacros(remoteData.macros);
        setGoal(remoteData.goal ?? '');
        setMeals(remoteData.meals ?? []);
        setExercises(remoteData.exercises ?? []);
        setWeightLogs(remoteData.weight_logs ?? []);
        setWaterLogs(remoteData.water_logs ?? []);
      } else {
        await saveUserData(currentEmail, {
          name: currentName,
          biometrics,
          macros,
          goal,
          meals,
          exercises,
          weight_logs: weightLogs,
          water_logs: waterLogs
        });
      }
      setRemoteSyncReady(true);
    };

    loadRemoteData();
  }, [currentEmail]);

  useEffect(() => {
    if (!currentEmail || status === 'loading' || !remoteSyncReady) {
      return;
    }

    saveUserData(currentEmail, {
      name: profile.name || currentName,
      biometrics,
      macros,
      goal,
      meals,
      exercises,
      weight_logs: weightLogs,
      water_logs: waterLogs
    });
  }, [currentEmail, currentName, status, remoteSyncReady, profile, biometrics, macros, goal, meals, exercises, weightLogs, waterLogs]);

  const normalizeBiometrics = (updates: Partial<Biometrics>): Biometrics => {
    const next = { ...biometrics, ...updates };
    const allowedGenders = ['Male', 'Female', 'Other'];

    return {
      height: next.height.trim(),
      weight: next.weight.trim(),
      age: next.age.trim(),
      gender: allowedGenders.includes(next.gender) ? next.gender : next.gender.trim()
    };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateBiometrics = (updates: Partial<Biometrics>) => {
    const nextBiometrics = normalizeBiometrics(updates);
    setBiometrics(nextBiometrics);

    if (nextBiometrics.weight) {
      const weight = parseFloat(nextBiometrics.weight);
      if (!Number.isNaN(weight)) {
        addWeightLog(weight);
      }
    }
  };

  const updateMacros = (updates: Partial<Macros>) => {
    setMacros(prev => ({ ...prev, ...updates }));
  };

  const updateGoal = (newGoal: string) => {
    setGoal(newGoal);
  };

  const addMeal = (meal: Omit<MealEntry, 'id' | 'time' | 'fullDate'>, date?: string) => {
    const newMeal: MealEntry = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullDate: date || new Date().toISOString().split('T')[0]
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const addExercise = (ex: Omit<ExerciseEntry, 'id' | 'time' | 'fullDate'>, date?: string) => {
    const newExercise: ExerciseEntry = {
      ...ex,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullDate: date || new Date().toISOString().split('T')[0]
    };
    setExercises(prev => [newExercise, ...prev]);
  };

  const addWeightLog = (weight: number, date?: string) => {
    setWeightLogs(prev => [{
      date: date || new Date().toISOString(),
      weight
    }, ...prev]);
  };

  const updateWater = (glasses: number, date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    setWaterLogs(prev => {
      const existing = prev.find(l => l.date === targetDate);
      if (existing) {
        return prev.map(l => (l.date === targetDate ? { ...l, glasses } : l));
      }
      return [{ date: targetDate, glasses }, ...prev];
    });
  };

  useEffect(() => {
    const w = parseFloat(biometrics.weight);
    const h = parseFloat(biometrics.height);
    const a = parseInt(biometrics.age, 10);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr = biometrics.gender === 'Male' ? bmr + 5 : bmr - 161;

    const multiplier = 1.375;
    let tdee = bmr * multiplier;
    let targetCals = tdee;

    if (goal.toLowerCase().includes('lose')) targetCals -= 500;
    if (goal.toLowerCase().includes('gain')) targetCals += 400;

    const floor = biometrics.gender === 'Male' ? 1500 : 1200;
    targetCals = Math.max(targetCals, floor);

    let pRatio = 0.3;
    let cRatio = 0.45;
    let fRatio = 0.25;

    if (goal.toLowerCase().includes('gain')) {
      pRatio = 0.35;
      cRatio = 0.45;
      fRatio = 0.2;
    }

    setDynamicTargets({
      cals: Math.round(targetCals),
      carbs: Math.round((targetCals * cRatio) / 4),
      protein: Math.round((targetCals * pRatio) / 4),
      fat: Math.round((targetCals * fRatio) / 9)
    });
  }, [biometrics, goal]);

  return (
    <UserContext.Provider
      value={{
        profile,
        biometrics,
        macros,
        goal,
        meals,
        exercises,
        weightLogs,
        waterLogs,
        dynamicTargets,
        updateProfile,
        updateBiometrics,
        updateMacros,
        updateGoal,
        addMeal,
        deleteMeal,
        addExercise,
        addWeightLog,
        updateWater
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
