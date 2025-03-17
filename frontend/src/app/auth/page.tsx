"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Auth() {
    const { data: session, status, update } = useSession();

    console.log("🔵 UI Session Data:", session);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="p-4 border rounded-lg shadow-md text-center w-80 mx-auto mt-10">
            {session ? (
                <>
                    <h2 className="text-lg font-semibold">Welcome, {session.user?.name}!</h2>
                    <p>Email: {session.user?.email}</p>
                    <p>User ID: {session.user?.id}</p>

                    <button
                        onClick={() => signOut()}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={() => signIn("google").then(() => update())}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Sign In with Google
                    </button>
                </>
            )}
        </div>
    );
}
