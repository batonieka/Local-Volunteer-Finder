import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <main className="mt-16 mb-12">{children}</main>
    <Footer />
  </>
);
