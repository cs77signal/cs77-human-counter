
import "./globals.css";

export const metadata = {
  title: "CS77 | Human Counter",
  description:
    "Real-time human verification statistics powered by CS77 and World ID.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
