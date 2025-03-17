import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectToDatabase from "../../../lib/db"; // Ensure this file correctly exports `clientPromise`



export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: { prompt: "select_account" }, // Forces re-authentication
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user, account }) {
            console.log("🟢 JWT Callback - Before:", token);

            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }

            console.log("🟢 JWT Callback - After:", token);
            return token;
        },
        async session({ session, token }) {
            console.log("🔵 Session Callback - Token:", token);

            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    email: token.email,
                };
            }

            console.log("🔵 Final Session Data:", session);
            return session;
        },
    },

    debug: true,
};


export default NextAuth(authOptions);
