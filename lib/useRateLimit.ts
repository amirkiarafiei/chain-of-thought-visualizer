"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cot-visualizer-usage";
const MAX_USES = 5;
const RESET_HOURS = 24;

interface UsageData {
  count: number;
  resetAt: number; // timestamp
}

export function useRateLimit() {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load usage data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (stored) {
      const data: UsageData = JSON.parse(stored);
      
      // Check if reset time has passed
      if (now >= data.resetAt) {
        // Reset the counter
        const newData: UsageData = {
          count: 0,
          resetAt: now + RESET_HOURS * 60 * 60 * 1000,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setUsageData(newData);
      } else {
        setUsageData(data);
      }
    } else {
      // First time user
      const newData: UsageData = {
        count: 0,
        resetAt: now + RESET_HOURS * 60 * 60 * 1000,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setUsageData(newData);
    }
    
    setIsLoading(false);
  }, []);

  // Increment usage count
  const incrementUsage = useCallback(() => {
    if (!usageData) return false;

    const now = Date.now();
    
    // Check if reset time has passed
    if (now >= usageData.resetAt) {
      const newData: UsageData = {
        count: 1,
        resetAt: now + RESET_HOURS * 60 * 60 * 1000,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setUsageData(newData);
      return true;
    }

    // Check if limit reached
    if (usageData.count >= MAX_USES) {
      return false;
    }

    // Increment count
    const newData: UsageData = {
      count: usageData.count + 1,
      resetAt: usageData.resetAt,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setUsageData(newData);
    return true;
  }, [usageData]);

  // Calculate remaining time until reset
  const getTimeUntilReset = useCallback(() => {
    if (!usageData) return "";
    
    const now = Date.now();
    const remaining = usageData.resetAt - now;
    
    if (remaining <= 0) return "now";
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [usageData]);

  const usesRemaining = usageData ? MAX_USES - usageData.count : MAX_USES;
  const usesUsed = usageData?.count ?? 0;
  const canUse = usesRemaining > 0;
  const isLimitReached = usesRemaining <= 0;

  return {
    usesRemaining,
    usesUsed,
    maxUses: MAX_USES,
    canUse,
    isLimitReached,
    isLoading,
    incrementUsage,
    getTimeUntilReset,
  };
}

