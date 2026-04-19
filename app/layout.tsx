import "./globals.css";
import { Providers } from "@/src/components/Providers";

export const metadata = {
  title: "Fitness Bunny",
  description: "Your premium fitness diary",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#8de15c",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
