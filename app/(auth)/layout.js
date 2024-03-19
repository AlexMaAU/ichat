import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@/components/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "iChat App",
  description: "Chat Feature Little Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1`}>
        {/* Layout中导入ToasterContext就可以实现react-hot-toast */}
        <ToasterContext />
        {children}
      </body>
    </html>
  );
}

