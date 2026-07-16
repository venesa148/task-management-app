import "./globals.css";

export const metadata = {
  title: "TaskFlow",
  description: "Task management app for the technical test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
