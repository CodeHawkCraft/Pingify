import { Footer } from "./components/Footer";
import { MainSection } from "./components/MainSection";
import { Navbar } from "./components/Navbar";

const Home = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <MainSection />
    <Footer />
  </div>
);

export default Home;
