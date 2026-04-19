"use client";

import { redirect } from 'next/navigation';
import { useUser } from '../src/context/UserContext';
import WelcomeScreen from '../src/screens/WelcomeScreen';

export default function Home() {
  const { profile, updateProfile } = useUser();

  const handleOnboard = (name: string, email: string) => {
    updateProfile({ name, email });
  };

  if (profile.name) {
    redirect('/diary');
  }

  return <WelcomeScreen onStart={handleOnboard} />;
}
