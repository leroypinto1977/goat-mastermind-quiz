import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isAdminPage) {
        if (isLoginPage) return true;
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.email = user.email;
        }
        return token;
    },
    async session({ session, token }) {
        if (token && session.user) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
        }
        return session;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
