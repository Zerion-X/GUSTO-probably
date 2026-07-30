import usersData from "../data/users.json";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const STORAGE_KEY = "gusto-users";

/**
 * Creates the fake database the first time
 * the application is opened.
 */
export function initializeUsers() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usersData));
  }
}

/**
 * Returns every registered user.
 */
export function getUsers(): User[] {
  const users = localStorage.getItem(STORAGE_KEY);

  return users ? JSON.parse(users) : [];
}

/**
 * Saves the current user list.
 */
function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Checks whether an email already exists.
 */
export function emailExists(email: string): boolean {
  return getUsers().some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

/**
 * Checks whether a username already exists.
 */
export function usernameExists(username: string): boolean {
  return getUsers().some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
}

/**
 * Adds a new user.
 */
export function addUser(username: string, email: string, password: string) {
  const users = getUsers();

  const newUser: User = {
    id: Date.now(),
    username,
    email,
    password,
  };

  users.push(newUser);

  saveUsers(users);
}

/**
 * Checks login credentials.
 */
export function loginUser(
  emailOrUsername: string,
  password: string,
): User | null {
  const users = getUsers();

  return (
    users.find(
      (user) =>
        (user.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          user.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        user.password === password,
    ) || null
  );
}

const CURRENT_USER_KEY = "gusto-current-user";

export function setCurrentUser(user: User) {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const user = sessionStorage.getItem(CURRENT_USER_KEY);

  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  sessionStorage.removeItem(CURRENT_USER_KEY);
}
