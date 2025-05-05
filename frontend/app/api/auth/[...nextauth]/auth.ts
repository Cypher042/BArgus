import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        // logic to salt and hash password
        const pwHash = credentials.password ;

        // logic to verify if the user exists
        const response = await fetch("http://localhost:8000/login_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials.");
        }

        const userData = await response.json();

        // Ensure the returned data matches the expected User type
         user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        };

        return user;
      },
    }),
  ],
})