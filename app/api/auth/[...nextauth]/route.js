import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { connectToDB } from '@utils/database'; // Zakładam, że plik jest w katalogu utils
import { User } from '@models/user'; // Zakładam, że model User jest w katalogu models

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session }) {
			try {
				// Połączenie z bazą danych tylko wtedy, gdy jest to konieczne
				await connectToDB();

				const sessionUser = await User.findOne({
					email: session.user.email,
				});

				if (sessionUser) {
					session.user.id = sessionUser._id.toString();
				}

				return session;
			} catch (error) {
				console.error('Error in session callback:', error);
				return session; // Zwróć sesję, nawet jeśli wystąpił błąd
			}
		},

		async signIn({ profile }) {
			try {
				// Połączenie z bazą danych
				await connectToDB();

				const userExists = await User.findOne({ email: profile.email });

				// Jeśli użytkownik nie istnieje, stwórz nowego użytkownika
				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name.replace(' ', '').toLowerCase(),
						image: profile.picture,
					});
				}

				return true; // Zalogowanie powiodło się
			} catch (error) {
				console.error('Error during sign in:', error);
				return false; // Zwróć false w przypadku błędu, aby przerwać logowanie
			}
		},
	},
});

export { handler as GET, handler as POST };
