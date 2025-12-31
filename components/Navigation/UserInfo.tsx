'use client';

import { db } from '@/lib/db';

export default function UserInfo() {
  return (
    <>
      <db.SignedIn>
        <UserInfoContent />
      </db.SignedIn>
    </>
  );
}

function UserInfoContent() {
  const user = db.useUser();

  const handleSignOut = async () => {
    try {
      await db.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="nav-user">
      <span className="nav-user-email">{user.email}</span>
      <button
        onClick={handleSignOut}
        className="btn-signout"
        type="button"
      >
        登出
      </button>
    </div>
  );
}
