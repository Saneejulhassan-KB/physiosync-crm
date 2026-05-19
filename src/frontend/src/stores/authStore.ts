import { MOCK_USERS } from "@/lib/mockData";
import type { User, UserRole } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      login: (role: UserRole) => {
        const user = MOCK_USERS[role];
        set({ currentUser: user, isAuthenticated: true });
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),
    }),
    { name: "physiosync-auth" },
  ),
);
