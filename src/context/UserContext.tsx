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
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  time: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
}

export interface ExerciseEntry {
  id: string;
  name: string;
  calories: number;
  duration: string;
  time: string;
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
  addMeal: (meal: Omit<MealEntry, 'id' | 'time'>) => void;
  deleteMeal: (id: string) => void;
  addExercise: (exercise: Omit<ExerciseEntry, 'id' | 'time'>) => void;
  addWeightLog: (weight: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>({ 
    name: 'Shivani Sah', 
    email: 'shivani@bunny.ai' 
  });
  
  const [biometrics, setBiometrics] = useState<Biometrics>({ 
    height: '170', 
    weight: '72.0', 
    age: '22', 
    gender: 'Female' 
  });

  const [macros, setMacros] = useState<Macros>({
    carbs: '181',
    protein: '66',
    fat: '36'
  });

  const [goal, setGoal] = useState('Lose 1 kilograms per week');
  
  const [meals, setMeals] = useState<MealEntry[]>([
    { id: '1', name: 'Avocado Toast', calories: 342, carbs: 32, protein: 8, fat: 22, time: '08:30 AM', type: 'Breakfast' },
    { id: '2', name: 'Greek Yogurt with Berries', calories: 210, carbs: 18, protein: 24, fat: 4, time: '10:15 AM', type: 'Breakfast' }
  ]);

  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { id: '1', name: 'Morning Run', calories: 320, duration: '30 min', time: '06:30 AM' }
  ]);

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([
    { date: new Date().toISOString(), weight: 72.0 }
  ]);

  const [dynamicTargets, setDynamicTargets] = useState({ cals: 1800, carbs: 200, protein: 120, fat: 60 });

  useEffect(() => {
    // Mifflin-St Jeor Formula
    const w = parseFloat(biometrics.weight);
    const h = parseFloat(biometrics.height);
    const a = parseInt(biometrics.age);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = biometrics.gender === 'Male' ? bmr + 5 : bmr - 161;

    // TDEE (Assume moderate activity multiplier of 1.375 for active users or 1.2 for sedentary)
    const multiplier = 1.375;
    let tdee = bmr * multiplier;

    // Adjust based on goal
    let targetCals = tdee;
    if (goal.toLowerCase().includes('lose')) targetCals -= 500;
    if (goal.toLowerCase().includes('gain')) targetCals += 400;

    // Safety Floor
    const floor = biometrics.gender === 'Male' ? 1500 : 1200;
    targetCals = Math.max(targetCals, floor);

    // Macro Split (High Protein for health/gain, balanced for maintenance)
    let pRatio = 0.3; // 30% Protein
    let cRatio = 0.45; // 45% Carbs
    let fRatio = 0.25; // 25% Fat

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

  const addMeal = (meal: Omit<MealEntry, 'id' | 'time'>) => {
    const newMeal: MealEntry = {
      ...meal,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const addExercise = (ex: Omit<ExerciseEntry, 'id' | 'time'>) => {
    const newEx: ExerciseEntry = {
      ...ex,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setExercises(prev => [newEx, ...prev]);
  };

  const addWeightLog = (weight: number) => {
    setWeightLogs(prev => [{ date: new Date().toISOString(), weight }, ...prev]);
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
