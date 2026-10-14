import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

import Users from "../../../libs/models/Users";
import connectDB from "../../../libs/utils/connectDB";

export const authOptions = {
    providers:[
        CredentialsProvider({
            name: 'credentials',
            credentials:{
                name: {label: "Name", type: "text", placeholder: "Please Enter Name"},
                email: {label: "Email", type: 'email', placeholder: 'abc@example.com'},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                const email = credentials?.email
                const password = credentials?.password
                if (!email || !password) {
                    throw new Error("Please enter email and password")
                }

                const user = await Users.findOne({email: email})
                if(!user){
                    throw new Error("You haven't registered yet")
                }
                return signinUser({password, user})
            }
        })
    ],
    // Required in production; generate one with: openssl rand -base64 32
    secret: process.env.NEXTAUTH_SECRET,
}

const signinUser = async ({ password, user }) => {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
    throw new Error("Password Incorrect.");
    }
    // Return only what the session needs, never the password hash.
    return { id: String(user._id), name: user.name, email: user.email };
}

export default connectDB(NextAuth(authOptions));