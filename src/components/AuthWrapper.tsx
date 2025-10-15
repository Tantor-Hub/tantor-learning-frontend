"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getValidAuthTokens } from "@/lib/cookies";
import { useGetAuthDataQuery } from "@/store/authApi";
import { selectIsAuthenticated } from "@/features/auth/auth-slice";
import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  const { token } = getValidAuthTokens();

  // this query will only execute if the token is valid and the user is not already in the redux store
  const { error, isLoading } = useGetAuthDataQuery(
    { token: token || "" },
    {
      // The useGetAuthDataQuery hook will not execute the query at all if these values are falsy
      skip: !!user || !token,
    }
  );

  // if the user doesnt have a valid token, redirect to login page
  useEffect(() => {
    if (!token) {
      router.push("/signin");
      // will explain this in a moment
      dispatch({ type: "auth/clearCredentials" });
    }
  }, [token, router, dispatch]);

  // optional: show a loading indicator while the query is loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
