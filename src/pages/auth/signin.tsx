import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { useEffect } from "react";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";

export default function SignIn({ providers }: any) {
  useEffect(() => {
    if (!providers) {
      console.error("No providers found.");
      return;
    }

    console.log("✅ Manually triggering signIn for Auth0");
    signIn("auth0").catch((err) => console.error("❌ Error signing in:", err));
  }, [providers]);

  return <p>Redirecting to Auth0...</p>;
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  // If the user is logged in
  if (session) {
    if (!session.user.loginBefore) {
      const userid = parseInt(session.user.id, 10);
      // Mark as logged in after redirect to membership
      await prisma.users.update({
        where: { id: userid },
        data: { loginbefore: true },
      });

      // Redirect to /membership if first time logging in
      return {
        redirect: {
          destination: "/pricing",
          permanent: false,
        },
      };
    } else {
      // Redirect to home page if already logged in
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}