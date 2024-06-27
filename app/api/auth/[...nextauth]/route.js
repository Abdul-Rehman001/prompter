import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import User from "../../../../models/user.js";
import { connectToDB } from "../../../../utils/database.js";

console.log({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();

        // Find user by email and add their MongoDB _id to the session
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
      } catch (error) {
        console.error("Error retrieving user from database:", error);
        throw error;
      }
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // Check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If user doesn't exist, create a new document in MongoDB
        if (!userExists) {
          // Generate a username that meets the criteria
          let username = profile.name.replace(/\s+/g, "").toLowerCase();
          username = username.replace(/[^a-z0-9]/gi, ""); // Remove non-alphanumeric characters
          if (username.length < 8) {
            username = username.padEnd(8, "0"); // Pad with zeros if too short
          } else if (username.length > 20) {
            username = username.slice(0, 20); // Truncate if too long
          }

          // Ensure the username is unique
          let count = 0;
          let uniqueUsername = username;
          while (await User.findOne({ username: uniqueUsername })) {
            count++;
            uniqueUsername = `${username}${count}`;
            if (uniqueUsername.length > 20) {
              uniqueUsername = uniqueUsername.slice(0, 20);
            }
          }

          await User.create({
            email: profile.email,
            username: uniqueUsername,
            image: profile.picture,
          });
        }

        return true; // Return true to indicate successful sign-in
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Return false to indicate sign-in failed
      }
    },
  },
});

export const GET = handler;
export const POST = handler;
