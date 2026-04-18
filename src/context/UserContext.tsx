"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
}

interface Biometrics {
  height: string;
  weight: string;
  age: string;
  gender: string;
}

interface Macros {
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

interface UserContextType {
  profile: UserProfile;
  biometrics: Biometrics;
  macros: Macros;
  goal: string;
  meals: MealEntry[];
  exercises: ExerciseEntry[];
  weightLogs: WeightLog[];
  dynamicTargets: { cals: number; carbs: number; protein: number; fat: number };
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateBiometrics: (biometrics: Partial<Biometrics>) => void;
  updateMacros: (macros: Partial<Macros>) => void;
  updateGoal: (goal: string) => void;
  addMeal: (meal: Omit<MealEntry, 'id' | 'time' | 'fullDate'>, date?: string) => void;
  deleteMeal: (id: string) => void;
  addExercise: (exercise: Omit<ExerciseEntry, 'id' | 'time' | 'fullDate'>, date?: string) => void;
  addWeightLog: (weight: number, date?: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initial States - Neutralized for Practicality
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' });
  const [biometrics, setBiometrics] = useState<Biometrics>({ height: '', weight: '', age: '', gender: '' });
  const [macros, setMacros] = useState<Macros>({ carbs: '', protein: '', fat: '' });
  const [goal, setGoal] = useState('');
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [dynamicTargets, setDynamicTargets] = useState({ cals: 2000, carbs: 250, protein: 125, fat: 67 });

  // Persistence Engine: Rehydration (Load from LocalStorage)
  useEffect(() => {
    const savedProfile = localStorage.getItem('fb_profile');
    const savedBio = localStorage.getItem('fb_biometrics');
    const savedMeals = localStorage.getItem('fb_meals');
    const savedExercises = localStorage.getItem('fb_exercises');
    const savedWeight = localStorage.getItem('fb_weightLogs');
    const savedGoal = localStorage.getItem('fb_goal');

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedBio) setBiometrics(JSON.parse(savedBio));
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedExercises) setExercises(JSON.parse(savedExercises));
    if (savedWeight) setWeightLogs(JSON.parse(savedWeight));
    if (savedGoal) setGoal(savedGoal);
  }, []);

  // Persistence Engine: Dehydration (Save to LocalStorage)
  useEffect(() => {
    if (profile.name) localStorage.setItem('fb_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (biometrics.weight) localStorage.setItem('fb_biometrics', JSON.stringify(biometrics));
  }, [biometrics]);

  useEffect(() => {
    localStorage.setItem('fb_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fb_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('fb_weightLogs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    if (goal) localStorage.setItem('fb_goal', goal);
  }, [goal]);

  useEffect(() => {
    // Mifflin-St Jeor Formula
    const w = parseFloat(biometrics.weight);
    const h = parseFloat(biometrics.height);
    const a = parseInt(biometrics.age);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = biometrics.gender === 'Male' ? bmr + 5 : bmr - 161;

    // TDEE (Assume moderate activity multiplier)
    const multiplier = 1.375;
    let tdee = bmr * multiplier;

    // Adjust based on goal
    let targetCals = tdee;
    if (goal.toLowerCase().includes('lose')) targetCals -= 500;
    if (goal.toLowerCase().includes('gain')) targetCals += 400;

    // Safety Floor
    const floor = biometrics.gender === 'Male' ? 1500 : 1200;
    targetCals = Math.max(targetCals, floor);

    // Macro Split
    let pRatio = 0.3; 
    let cRatio = 0.45;
    let fRatio = 0.25;

    if (goal.toLowerCase().includes('gain')) {
      pRatio = 0.35; cRatio = 0.45; fRatio = 0.2;
    }

    setDynamicTargets({
      cals: Math.round(targetCals),
      carbs: Math.round((targetCals * cRatio) / 4),
      protein: Math.round((targetCals * pRatio) / 4),
      fat: Math.round((targetCals * fRatio) / 9)
    });
  }, [biometrics, goal]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateBiometrics = (updates: Partial<Biometrics>) => {
    setBiometrics(prev => ({ ...prev, ...updates }));
    if (updates.weight) {
      addWeightLog(parseFloat(updates.weight));
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
    const newEx: ExerciseEntry = {
      ...ex,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullDate: date || new Date().toISOString().split('T')[0]
    };
    setExercises(prev => [newEx, ...prev]);
  };

  const addWeightLog = (weight: number, date?: string) => {
    setWeightLogs(prev => [{ 
      date: date || new Date().toISOString(), 
      weight 
    }, ...prev]);
  };

  return (
    <UserContext.Provider value={{ 
      profile, biometrics, macros, goal, meals, exercises, weightLogs, dynamicTargets,
      updateProfile, updateBiometrics, updateMacros, updateGoal,
      addMeal, deleteMeal, addExercise, addWeightLog
    }}>
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
