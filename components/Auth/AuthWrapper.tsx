'use client';

import { db } from '@/lib/db';
import LoginForm from './LoginForm';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <>
      <db.SignedIn>{children}</db.SignedIn>
      <db.SignedOut>
        <LoginForm />
      </db.SignedOut>
    </>
  );
}
