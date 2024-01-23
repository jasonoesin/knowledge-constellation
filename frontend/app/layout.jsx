import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Knowledge Constellation",
  description: "Developed by Jason",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-[100vw] h-[100vh]">{children}</div>
        <ToastContainer position="top-left" theme="dark" autoClose={2000} />
      </body>
    </html>
  );
}
