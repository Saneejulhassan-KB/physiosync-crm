import { Link } from "@tanstack/react-router";
import { Activity, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            PhysioSync
          </span>
        </div>
        <h1 className="text-8xl font-bold font-display text-primary/20">404</h1>
        <h2 className="text-2xl font-bold font-display text-foreground mt-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-elevation-subtle"
          data-ocid="notfound.back_home_link"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
