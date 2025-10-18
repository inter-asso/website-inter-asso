import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "../common/PageTransition";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
