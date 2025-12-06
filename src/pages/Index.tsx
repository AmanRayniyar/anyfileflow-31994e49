import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PopularTools from "@/components/PopularTools";
import CategorySection from "@/components/CategorySection";
import { categories } from "@/data/tools";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <PopularTools />
        <div className="container mx-auto px-4 py-8">
          {categories.map((category) => (
            <CategorySection key={category.id} category={category} limit={6} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;