
import { GameState } from "@/types/game";

// Cookie expiration (30 days)
const COOKIE_EXPIRY_DAYS = 30;

// Save game progress to cookie
export const saveGameProgress = (level: number, score: number) => {
  try {
    // Create a date for cookie expiration
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    // Format the cookie string
    const cookieValue = `level=${level};score=${score}`;
    document.cookie = `timeJumperProgress=${cookieValue};expires=${expiryDate.toUTCString()};path=/;SameSite=Strict`;
    
    // Also save to local storage as a backup
    localStorage.setItem('timeJumperProgress', JSON.stringify({ level, score }));
    
    return true;
  } catch (error) {
    console.error("Failed to save game progress:", error);
    return false;
  }
};

// Load game progress from cookie
export const loadGameProgress = (): { level: number; score: number } | null => {
  try {
    // Check local storage first (more reliable)
    const storedProgress = localStorage.getItem('timeJumperProgress');
    if (storedProgress) {
      return JSON.parse(storedProgress);
    }
    
    // Fall back to cookies
    const cookies = document.cookie.split(';');
    const progressCookie = cookies.find(cookie => cookie.trim().startsWith('timeJumperProgress='));
    
    if (!progressCookie) {
      return null;
    }
    
    // Parse the cookie value
    const cookieValue = progressCookie.split('=')[1];
    const levelMatch = cookieValue.match(/level=(\d+)/);
    const scoreMatch = cookieValue.match(/score=(\d+)/);
    
    if (!levelMatch || !scoreMatch) {
      return null;
    }
    
    return {
      level: parseInt(levelMatch[1], 10),
      score: parseInt(scoreMatch[1], 10)
    };
  } catch (error) {
    console.error("Failed to load game progress:", error);
    return null;
  }
};

// Clear saved game progress
export const clearGameProgress = (): boolean => {
  try {
    document.cookie = "timeJumperProgress=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    localStorage.removeItem('timeJumperProgress');
    return true;
  } catch (error) {
    console.error("Failed to clear game progress:", error);
    return false;
  }
};

// Save highest level reached
export const saveHighestLevel = (level: number): boolean => {
  try {
    const currentHighest = getHighestLevel();
    if (level > currentHighest) {
      localStorage.setItem('timeJumperHighestLevel', level.toString());
    }
    return true;
  } catch (error) {
    console.error("Failed to save highest level:", error);
    return false;
  }
};

// Get highest level reached
export const getHighestLevel = (): number => {
  try {
    const highestLevel = localStorage.getItem('timeJumperHighestLevel');
    return highestLevel ? parseInt(highestLevel, 10) : 1;
  } catch (error) {
    console.error("Failed to get highest level:", error);
    return 1;
  }
};
