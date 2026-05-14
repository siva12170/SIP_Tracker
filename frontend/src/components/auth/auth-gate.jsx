"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, setHydrated } from "@/store/slices/auth-slice";

export default function AuthGate({
  children,
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated) {
      return;
    }

    const storedToken = localStorage.getItem("sip_token");
    const storedUser = localStorage.getItem("sip_user");
    if (!storedToken) {
      dispatch(setHydrated());
      return;
    }

    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        parsedUser = null;
      }
    }

    dispatch(setCredentials({ token: storedToken, user: parsedUser }));
  }, [dispatch, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-[var(--radius)] border border-[var(--border)] px-6 py-4 text-sm text-[var(--muted)]">
          Verifying session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
