import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ServicesSection from "@/components/landing/ServicesSection";
import TeamSection from "@/components/landing/TeamSection";
import HowItWorks from "@/components/landing/HowItWorks";
import GallerySection from "@/components/landing/GallerySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ServiceAreas from "@/components/landing/ServiceAreas";
import InstagramFeed from "@/components/landing/InstagramFeed";
import QuoteSection from "@/components/landing/QuoteSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAF9]">
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <ServicesSection />
      <TeamSection />
      <HowItWorks />
      <GallerySection />
      {/* <TestimonialsSection />*/}
      <ServiceAreas />
      <InstagramFeed />
      <QuoteSection />
      <Footer />
    </div>
  );
}
