import "./globals.css";
import { UserProvider } from "../src/context/UserContext";

export const metadata = {
  title: "Fitness Bunny",
  description: "Your premium fitness diary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
