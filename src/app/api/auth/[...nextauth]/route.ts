import NextAuth from "next-auth";
// @/lib/auth ke bajaye relative path use karein
import { authOptions } from "../../../../lib/auth"; 

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };