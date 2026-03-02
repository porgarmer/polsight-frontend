"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth-service";

export default function useRequireAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await getMe(); // if 401, interceptor may refresh; if still 401 -> throws
        if (mounted) setLoading(false);
      } catch (e) {
        router.replace("/login");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return loading; // so pages can avoid flashing content
}