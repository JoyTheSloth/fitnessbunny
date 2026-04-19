"use client";

import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import WelcomeScreen from '@/src/screens/WelcomeScreen';

export default function Home() {
  const { updateProfile } = useUser();
  const router = useRouter();

  const handleOnboard = (name: string, email: string) => {
    updateProfile({ name, email });
    router.push('/diary');
  };

  return <WelcomeScreen onStart={handleOnboard} />;
}
