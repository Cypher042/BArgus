import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";

export default function Home() {
  return (
   <>
    <Header />
    <div className="container py-8 md:py-12 lg:py-16">
      <div className="flex flex-col space-y-4 mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Extract Data from Any Website
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
          Powerful, fast, and easy-to-use web scraping tool for developers, researchers, and businesses.
        </p>
      </div>
      <Hero/>


    </div>
    </>
  );
}