"use client";
import type React from "react";
import { Label } from "@/components/ui/beetkar-label";
import { Input } from "@/components/ui/beetkar-input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

export default function DemoLogin({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "demo@beetkar.com",
    password: "BeetkarDemo2024!"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to dashboard
    navigate('/dashboard');
    onClose?.();
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-3 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-lg md:text-xl font-bold text-neutral-800 dark:text-neutral-200">
        დემო დაშბორდის წვდომა
      </h2>
      <p className="mt-1 md:mt-2 max-w-sm text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
        სცადეთ სრული Beetkar გამოცდილება დემო მონაცემებით
      </p>

      <form className="my-4 md:my-8" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">ელ-ფოსტა</Label>
            <Input
              id="email"
              name="email"
              placeholder="demo@beetkar.com"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">პაროლი</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <motion.button
            type="submit"
            disabled={isLoggingIn}
            className={cn(
              "group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-orange-500 to-yellow-500 px-4 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed",
              isLoggingIn && "animate-pulse"
            )}
            whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
            whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative z-10 flex items-center space-x-2">
              {isLoggingIn ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span className="text-sm">დაშბორდზე შესვლა...</span>
                </>
              ) : (
                <span className="text-sm">დემო დაშბორდში შესვლა</span>
              )}
            </div>
            <BottomGradient />
          </motion.button>

          <div className="text-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              დემო მონაცემები წინასწარ შევსებულია - შეგიძლიათ შეცვალოთ
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 absolute inset-0 rounded-md bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 transition duration-1000 group-hover/btn:duration-200" />
      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 blur-xl transition duration-1000 group-hover/btn:duration-200" />
    </>
  );
};
