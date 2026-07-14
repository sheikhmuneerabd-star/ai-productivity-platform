"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SocialAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={loadingProvider === "google"}
        onClick={() => handleSocialLogin("google")}
        className="flex h-10 items-center justify-center gap-2 rounded-md border border-graphite-700 bg-graphite-800 text-sm text-graphite-100 transition-colors hover:bg-graphite-700 disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.01h3.89c2.27-2.09 3.58-5.17 3.58-8.83z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.89-3.01c-1.08.72-2.45 1.15-4.04 1.15-3.1 0-5.73-2.1-6.67-4.92H1.32v3.1C3.29 21.3 7.32 24 12 24z"/>
          <path fill="#FBBC05" d="M5.33 14.32c-.24-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.58H1.32C.48 8.24 0 10.06 0 12s.48 3.76 1.32 5.42l4.01-3.1z"/>
          <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.32 0 3.29 2.7 1.32 6.58l4.01 3.1c.94-2.82 3.57-4.93 6.67-4.93z"/>
        </svg>
        Google
      </button>
      <button
        type="button"
        disabled={loadingProvider === "github"}
        onClick={() => handleSocialLogin("github")}
        className="flex h-10 items-center justify-center gap-2 rounded-md border border-graphite-700 bg-graphite-800 text-sm text-graphite-100 transition-colors hover:bg-graphite-700 disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.432.372.815 1.103.815 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </button>
    </div>
  );
}