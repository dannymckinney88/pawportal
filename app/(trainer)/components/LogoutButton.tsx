"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Logout button
 */
export const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-muted-foreground hover:text-foreground hover:bg-background min-h-11 rounded-lg px-3 py-2 text-sm font-medium"
    >
      Logout
    </button>
  );
};
