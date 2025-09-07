// // import { authWithGoogle, onSignIn } from "@/services/Caller";
// // import { Affectation, UserRoleType } from "@/types/models";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         pswd: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.pswd) {
//           throw new Error("Veuillez entrer votre email et votre mot de passe.");
//         }

//         try {
//           const res = await onSignIn(credentials.email, credentials.pswd);
//           console.log(res);
//           if (res?.status === 201 || res?.status === 200) {
//             const { data, token, refresh_token } = res.data as any;
//             const user = data;

//             return {
//               id: user.id,
//               email: user.email,
//               full_name: user.full_name,
//               profil: user.profil && user.profil !== "custom" ? user.profil : "",
//               phone: user?.phone,
//               gender: user?.gender,
//               dateBorn: user?.dateBorn,
//               provider: user?.provider,
//               fingerprint: user?.fingerprint,
//               status: user?.status,
//               token,
//               refresh_token,
//             };
//           }

//           switch (res?.status) {
//             case 400:
//               throw new Error(res?.data?.message || "Requête invalide.");
//             case 401:
//               throw new Error("Mot de passe ou nom d'utilisateur incorrect.");
//             case 403:
//               throw new Error("Accès refusé.");
//             case 408:
//               throw new Error("Timeout, veuillez réessayer.");
//             case 500:
//               throw new Error("Erreur serveur, veuillez réessayer plus tard.");
//             default:
//               throw new Error(res?.data?.message || "Erreur inconnue.");
//           }
//         } catch (err: any) {
//           throw new Error(err?.message || "Erreur serveur, veuillez réessayer plus tard.");
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//     // error: '/auth/error',
//   },
//   callbacks: {
//     async signIn({ account, profile, user }) {
//       if (account?.provider === "google" && profile) {
//         try {
//           const res = await authWithGoogle(
//             profile.email as string,
//             profile.name as string,
//             (profile as any).hasOwnProperty("picture")
//               ? ((profile as any).picture as string)
//               : (user as any).image
//           );
//           if (res?.status === 201 || res?.status === 200) {
//             const { data: backendData, token, refresh_token } = res.data;
//             (profile as any)._userFromBackend = {
//               id: backendData.id,
//               email: backendData.email,
//               full_name: backendData.full_name,
//               profil: (profile as any).hasOwnProperty("picture")
//                 ? ((profile as any).picture as string)
//                 : ((user as any).image ?? backendData.profil),
//               phone: backendData?.phone,
//               gender: backendData?.gender,
//               dateBorn: backendData?.dateBorn,
//               provider: backendData?.provider,
//               fingerprint: backendData?.fingerprint,
//               status: backendData?.status,
//               affectation: backendData?.affectation,
//               type_user: backendData?.type_user,
//               token,
//               refresh_token,
//             };
//             return true;
//           } else {
//             throw new Error("Impossible d'authentifier avec Google.");
//             return false;
//           }
//         } catch (err) {
//           return false;
//         }
//       }
//       return true;
//     },
//     async jwt({ token, user, profile }) {
//       if (user) {
//         token.id = user.id;
//         token.full_name = user.full_name;
//         token.email = user.email;
//         token.profil = user.profil;
//         token.status = user.status;
//         token.phone = user.phone;
//         token.gender = user.gender;
//         token.dateBorn = user.dateBorn;
//         token.fingerprint = user.fingerprint;
//         token.provider = user.provider;
//         token.affectation = user.affectation;
//         token.type_user = user.type_user;
//         token.token = user.token;
//         token.refresh_token = user.refresh_token;
//       }

//       if (profile && (profile as any)._userFromBackend) {
//         const backendUser = (profile as any)._userFromBackend;

//         token.id = backendUser.id;
//         token.full_name = backendUser.full_name;
//         token.email = backendUser.email;
//         token.profil = backendUser.profil;
//         token.status = backendUser.status;
//         token.phone = backendUser.phone;
//         token.gender = backendUser.gender;
//         token.dateBorn = backendUser.dateBorn;
//         token.fingerprint = backendUser.fingerprint;
//         token.provider = backendUser.provider;
//         token.affectation = backendUser.affectation;
//         token.type_user = backendUser.type_user;
//         token.token = backendUser.token;
//         token.refresh_token = backendUser.refresh_token;
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id as string,
//         full_name: token.full_name as string,
//         email: token.email as string,
//         profil: token.profil as string,
//         status: token.status as number,
//         phone: token.phone as string,
//         gender: token.gender as string,
//         dateBorn: token.dateBorn as string,
//         fingerprint: token.fingerprint as string,
//         provider: token.provider as number,
//         affectation: token.affectation as Affectation[] | undefined,
//         type_user: token.type_user as UserRoleType[] | undefined,
//         token: token.token as string,
//         refresh_token: token.refresh_token as string | undefined,
//       };

//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
