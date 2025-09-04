import { storage } from './storage';
import { User } from '@/types';

const USERS_STORAGE_KEY = '@registered_users';
const SESSION_STORAGE_KEY = '@user_session';

// Get all registered users
export const getRegisteredUsers = (): Promise<User[] | null> => {
  return storage.get<User[]>(USERS_STORAGE_KEY);
};

// Save all registered users
export const saveRegisteredUsers = (users: User[]): Promise<void> => {
  return storage.save(USERS_STORAGE_KEY, users);
};

// Get current user session
export const getSession = (): Promise<User | null> => {
  return storage.get<User>(SESSION_STORAGE_KEY);
};

// Save current user session
export const saveSession = (user: User): Promise<void> => {
  return storage.save(SESSION_STORAGE_KEY, user);
};

// Clear current user session
export const clearSession = (): Promise<void> => {
  return storage.remove(SESSION_STORAGE_KEY);
};
