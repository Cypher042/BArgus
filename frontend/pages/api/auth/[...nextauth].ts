import NextAuth, { NextAuthOptions, User as NextAuthUser, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Debug: Check environment variables
console.log("NextAuth Environment Variables:", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set"
});

if (!process.env.NEXTAUTH_URL) {
  console.error("Warning: NEXTAUTH_URL is not set");
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error("Warning: NEXTAUTH_SECRET is not set");
}

interface User extends NextAuthUser {
  username?: string;
}

interface CustomSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    username?: string;
  };
}

export const authOptions: NextAuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Make the login request
          const loginResponse = await fetch('http://localhost:8000/login_user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            }),
            credentials: 'include'
          });

          const loginData = await loginResponse.json();
          console.log("Login response:", loginData);

          // If login was successful, create a session
          if (loginResponse.ok && loginData === "login successful") {
            console.log("here");
            return {
              username: credentials.username
            } as User;
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as User).username;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      const user = session.user as CustomSession['user'];
      if (token && user) {
        user.username = token.username as string;
      }
      return session as CustomSession;
    }
  },
  pages: {
    signIn: '/login'
  }
}

export default NextAuth(authOptions);