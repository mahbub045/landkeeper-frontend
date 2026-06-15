"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Eye, EyeOff, LoaderPinwheel, MapPin } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password. Please try again.");
    } else {
      toast.success("You have successfully logged in.");
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel */}
      <div className="bg-primary dark:bg-primary/60 relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
            <MapPin className="text-secondary h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white dark:text-green-50">
            Landkeeper
          </span>
        </div>

        {/* Center content */}
        <div className="relative">
          <h1 className="mb-4 text-4xl leading-tight font-bold text-white">
            Manage your land,
            <br />
            <span className="text-secondary">effortlessly.</span>
          </h1>
          <p className="text-secondary max-w-sm text-lg leading-relaxed">
            Track parcels, monitor applications, and stay on top of every land
            management task — all in one place.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { value: "12,400+", label: "Land parcels tracked" },
              { value: "98%", label: "Uptime guarantee" },
              { value: "340+", label: "Organisations" },
              { value: "24/7", label: "Support available" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-secondary mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="border-secondary relative border-l-2 pl-4">
          <p className="text-secondary text-sm italic">
            Landkeeper transformed how we handle our portfolio of 2,000+
            parcels.
          </p>
          <p className="mt-2 text-xs text-white">
            — Director, National Land Authority
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-lg dark:bg-green-700">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-primary text-3xl font-semibold dark:text-green-400">
              Landkeeper
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@organisation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <a
                  href="/auth/forgot-password"
                  className="text-primary/80 hover:text-primary text-xs font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white"
            >
              {isLoading ? (
                <>
                  <LoaderPinwheel className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/register"
              className="text-primary/80 hover:text-primary font-medium"
            >
              Contact your administrator
            </a>
          </p>

          <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Landkeeper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
