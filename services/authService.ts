// --- MOCK AUTH SERVICE ---
// In a real application, this would be a service that communicates
// with your backend API (e.g., using fetch or axios).
// For this self-contained demo, we use localStorage to simulate a database.

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, NEVER store plain text passwords
  verified: boolean;
  verificationToken?: string;
}

const USERS_KEY = 'echo_chamber_users';
const SESSION_KEY = 'echo_chamber_session';

// Helper to get users from localStorage
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  /**
   * Signs up a new user.
   */
  signUp: async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    return new Promise(resolve => {
      setTimeout(() => { // Simulate network delay
        const users = getUsers();
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
          resolve({ success: false, message: "An account with this email already exists." });
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          email: email.toLowerCase(),
          passwordHash: password, // In a real app, hash the password on the server
          verified: false,
          verificationToken: `verify_${Date.now()}_${Math.random()}`
        };

        users.push(newUser);
        saveUsers(users);

        console.log(`
          --- SIMULATED EMAIL VERIFICATION ---
          To: ${newUser.email}
          Subject: Verify your Echo Chamber AI Account
          
          Click this token to verify: ${newUser.verificationToken}
          
          (In this demo, you'll click a button on the next screen to simulate this)
        `);

        resolve({ success: true, message: "Signup successful. Please check your email to verify your account." });
      }, 500);
    });
  },

  /**
   * Logs in a user.
   */
  logIn: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
     return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user || user.passwordHash !== password) {
                resolve({ success: false, message: "Invalid email or password." });
                return;
            }

            if (!user.verified) {
                resolve({ success: false, message: "Account not verified. Please check your email for the verification link." });
                return;
            }

            // Create a session
            localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
            
            const { passwordHash, verificationToken, ...userToReturn } = user;
            resolve({ success: true, message: "Login successful!", user: userToReturn as User });
        }, 500);
    });
  },

  /**
   * Logs out the current user.
   */
  logOut: (): void => {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Gets the currently logged-in user.
   */
  getCurrentUser: (): User | null => {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    if (!sessionJson) return null;

    const session = JSON.parse(sessionJson);
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);

    if (user) {
        const { passwordHash, verificationToken, ...userToReturn } = user;
        return userToReturn as User;
    }
    return null;
  },
  
  /**
   * Simulates verifying a user's email via a token.
   */
  verifyEmail: async (email: string): Promise<{ success: boolean; user?: User }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

            if (userIndex === -1) {
                resolve({ success: false });
                return;
            }

            users[userIndex].verified = true;
            const verificationToken = users[userIndex].verificationToken;
            users[userIndex].verificationToken = undefined; // Token is used up
            saveUsers(users);

            // Automatically log the user in after verification
            localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: users[userIndex].id }));
            
            const { passwordHash, ...userToReturn } = users[userIndex];
            resolve({ success: true, user: userToReturn as User });
        }, 300);
    });
  },
};
