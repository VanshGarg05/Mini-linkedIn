"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className, hover = true }: CardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const GradientCard = ({ children, className }: CardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
        "before:absolute before:inset-0 before:bg-white/10 before:backdrop-blur-sm",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
