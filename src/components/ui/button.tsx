"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = ({ 
  variant = "primary", 
  size = "md", 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 focus:ring-pink-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    ghost: "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        props.disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
