import ClientOnly from "@/components/ClientOnly";
import Footer from "@/components/Footer";
import ToastContainerBar from "@/components/ToastContainerBar";
import LoginModal from "@/components/models/LoginModal";
import RegisterModal from "@/components/models/RegisterModal";
import RentModal from "@/components/models/RentModal";
import SearchModal from "@/components/models/SearchModal";
import Navbar from "@/components/navbar/Navbar";
import { isRobotxAdminEmail } from "@/lib/robotxAdmin";
import { Nunito } from "next/font/google";
import "../styles/globals.css";
import getCurrentUser from "./actions/getCurrentUser";

export const metadata = {
  title: "RobotX Share",
  description: "Robot service rental marketplace by RobotX",
  icons: "/assets/robotx_logo.webp",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const isAdmin = isRobotxAdminEmail(currentUser?.email);

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToastContainerBar />
          <SearchModal />
          <RegisterModal />
          <LoginModal />
          {isAdmin && <RentModal />}
          <Navbar currentUser={currentUser} isAdmin={isAdmin} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
