import "./globals.css";
import { Providers } from "../src/components/Providers";

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
