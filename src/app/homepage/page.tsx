"use client";

import { useHomepage } from "./homepage.hook";
import HomepageLayout from "./homepage.layout";

export default function HomePage() {
  const props = useHomepage();
  return <HomepageLayout {...props} />;
}
