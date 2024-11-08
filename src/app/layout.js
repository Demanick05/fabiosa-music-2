import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Head from "next/head";
import favicon from './favicon.ico'
import Banner from "./components/cookieBanner/banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Music Base | Fabiosa",
  description: "A library of music assets provided by Fabiosa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href={favicon} />
      </Head>

      <body className={inter.className}>
        <Navbar />
        {children}
        <Banner />
      </body>
    </html>
  );
}
