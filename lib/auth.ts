import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db('salonbookdb');

export const auth = betterAuth({

  emailAndPassword: {
    enabled: true,
  },
 user: {
  additionalFields: {
    role: {
      type: "string",
      input: false,          // ← মূল পরিবর্তন: ক্লায়েন্টকে এটি সেট করতে দেবেন না
      defaultValue: "customer", // ← ডিফল্ট মান দিন
      required: false,
    }
  }
},
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});