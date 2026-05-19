import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUIStore } from "@/stores/uiStore";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Bell, ChevronDown, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const { currentUser, logout } = useAuthStore();
  const { toggleMobile, breadcrumbs } = useUIStore();
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotificationStore();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const priorityColors: Record<string, string> = {
    urgent: "bg-destructive/10 border-l-2 border-destructive",
    high: "bg-orange-500/10 border-l-2 border-orange-500",
    medium: "bg-primary/5",
    low: "",
  };

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-4 px-4 md:px-6 bg-card border-b border-border shadow-elevation-subtle">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleMobile}
        data-ocid="navbar.mobile_menu_button"
        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">/</span>}
                <span
                  className={cn(
                    i === breadcrumbs.length - 1
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
                  )}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : (
          <span className="text-sm font-semibold text-foreground">
            PhysioSync CRM
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-ocid="navbar.theme_toggle"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            data-ocid="navbar.notifications_button"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                data-ocid="navbar.notifications_dropdown"
                className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-xl shadow-elevation-high overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 6).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      data-ocid={`notifications.item.${n.id}`}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
                        !n.isRead && "bg-primary/5",
                        priorityColors[n.priority],
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setUserOpen((v) => !v)}
            data-ocid="navbar.user_menu_button"
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {currentUser?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground max-w-32 truncate">
              {currentUser?.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                data-ocid="navbar.user_dropdown"
                className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl shadow-elevation-high overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-foreground"
                    data-ocid="navbar.profile_link"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    data-ocid="navbar.logout_button"
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
