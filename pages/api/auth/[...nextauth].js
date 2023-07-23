import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import clientPromise from "@/lib/mongodb";

const credentialsOptions = {
  id: "credentials",
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    await mongooseConnect().catch((err) => {
      throw new Error(err);
    });

    const user = await User.findOne({
      email: credentials?.email,
    }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    return user;
  },
};

const authOptions = {
  providers: [
    CredentialsProvider(credentialsOptions),
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      const user = token.user;
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
