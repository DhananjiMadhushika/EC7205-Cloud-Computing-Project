import Account from "@/section/Client/Cart/Account";
import Navbar from "@/section/Navbar/ClientNav";
import Footer from "@/section/Footer";

export default function AccountPage() {
  return (
    <div>
      <Navbar />
      <Account />
      <div className="-mt-5 lg:-mt-10">
        <Footer />
      </div>
    </div>
  );
}
