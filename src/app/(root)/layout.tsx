import { Navbar } from "app/_components/navbar";
import Footer from "app/_components/footer";
import { AuthProvider } from "./AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <AuthProvider>
        <Navbar />
        {children}
        <Footer />
      </AuthProvider>
    </main>
  );
}
