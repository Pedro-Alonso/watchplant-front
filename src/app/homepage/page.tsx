"use client";

import { useHomepage } from "./homepage.hook";
import HomepageLayout from "./homepage.layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function HomePage() {
  const props = useHomepage();
  return (
    <ProtectedRoute>
      <HomepageLayout {...props} />
    </ProtectedRoute>
  );
}
