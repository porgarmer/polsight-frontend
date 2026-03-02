"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export default function SimpleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("")

  // FIX: Ensure 'e' is received and check if target exists
  const handleChange = (e) => {
    if (!e || !e.target) return; // Safety check

    const { id, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

async function onSubmit(event) {
  event.preventDefault();
  setIsLoading(true);

  try {
    await login(      
      formData.username,
      formData.password,
    )

    // If login succeeds, cookies are set automatically
    router.push("/voter-trends"); // redirect to protected page

  } catch (error) {
    console.error("Login failed:", error);

    if (error.response?.status === 401) {
      setError("Invalid username or password.");
    } else {
      setError("Something went wrong. Please try again.");
    }

  } finally {
    setIsLoading(false);
  }
}
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username" // CRITICAL: Must match the key in formData
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange} // CRITICAL: No parentheses () here!
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" // CRITICAL: Must match the key in formData
                type="password"
                value={formData.password}
                onChange={handleChange} // CRITICAL: No parentheses () here!
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-red-600">
              {error}
            </p>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}