"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Temporarily disable Firebase auth for development
    // We'll set a default user state
    dispatch(setAuthState(true));
    dispatch(
      setUserDetailsState({
        uid: "temp_user_id",
        name: "Test User",
        email: "test@example.com",
        profilePic: "",
      })
    );
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;