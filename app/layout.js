import "./globals.css";

export const metadata = {
  title: "Calendar App",
  description: "Created a Custom Calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
