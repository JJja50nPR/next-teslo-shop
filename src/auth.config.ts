import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';


const authRoutes = [
    '/auth/login',
    '/auth/register'
];

const protectedRoutes = [
    '/checkout',
    '/checkout/adress'
];

const adminRoutes = [
    '/admin',
    '/admin/orders',
    '/admin/users',
    '/admin/products',
];

export const authConfig : NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },
    callbacks: {

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = auth?.user.role;
            const isAuthRoute = authRoutes.includes(nextUrl.pathname);
            const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
            const isAdminRoute = adminRoutes.includes(nextUrl.pathname)

            if ( isAuthRoute && isLoggedIn ) {
                return Response.redirect( new URL('/', nextUrl ))
            }

            if( isProtectedRoute ) {
                if( isLoggedIn ) {
                    return true;
                }

                return Response.redirect(
                    new URL(`/auth/login?origin=${nextUrl.pathname}`, nextUrl)
                );
            }

            if( isAdminRoute ) {
                if( role === 'admin' ){
                    return true;
                }

                return Response.redirect(
                    new URL(`/`, nextUrl)
                );

            }

            return true;
          },

        jwt({ token, user }) {

            if( user ) {
                token.data = user;
            }

            return token;

        },

        async session({ session, token, user }) {

            session.user = token.data as any;



            return session;

        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
              const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

                if( !parsedCredentials.success ) return null;

                const { email, password } = parsedCredentials.data;

                // Buscar el correo
                const user = await prisma.user.findUnique({ where : { email: email.toLocaleLowerCase() } });
                if( !user ) return null;

                // Comparar contrasenas

                if( !bcryptjs.compareSync( password, user.pass ) ) return null;

                // Regresar el usuario sin el pass

                const { pass: _, ...rest } = user;

                return rest;
            },
          }),

    ]
}


export const { signIn, signOut, auth, handlers } = NextAuth( authConfig );