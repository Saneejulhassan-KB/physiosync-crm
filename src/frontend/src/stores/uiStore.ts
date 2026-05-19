import { create } from "zustand";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface UIState {
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  breadcrumbs: Breadcrumb[];
  toggleSidebar: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  setBreadcrumb: (crumbs: Breadcrumb[]) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  mobileOpen: false,
  breadcrumbs: [],
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
  setBreadcrumb: (crumbs) => set({ breadcrumbs: crumbs }),
}));
