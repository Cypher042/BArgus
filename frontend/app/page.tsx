"use client";

import Header from "@/app/Header";
import Hero from "@/app/Hero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import './globals.css';
import AddUrl from "./AddUrl";
import { useRef } from "react";




export default function Home() {
   const addUrlRef = useRef<HTMLDivElement>(null);

  const scrollToAddUrl = () => {
    if (addUrlRef.current) {
      addUrlRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
   <>
    <Header />
    <div className="grid-background"></div>
    <div className="relative container py-8 md:py-12 lg:py-16">
      <div className="flex flex-col space-y-4 m-12 text-center space-y-8 mx-auto">
        <h1 className="text-5xl mt-20  font-bold md:text-6xl lg:text-7xl xl:text-8xl">
         Welcome to BARGUS. 🥷🏻
        </h1>
        <p className="text-muted-foreground md:text-xl mx-auto max-w-[600]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea amet hic minus aspernatur laudantium aliquid.
        </p>
        <div  className="flex justify-center space-x-4">
        <Button size="lg" className="p-6 text-2xl" variant="outline"  onClick={scrollToAddUrl} >
                  Get Started
                </Button>
        </div>
        <div className="flex flex-row items-center justify-between max-w-6xl w-full mt-12 mx-auto px-4">
  <div className="flex-1 text-muted-foreground text-left mr-12 max-w-[500px]">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi doloremque debitis illum pariatur? Possimus quod unde temporibus nisi est velit officiis ad laudantium, modi architecto itaque neque ut fugiat laborum voluptate, ea deleniti explicabo saepe error amet! Dolores corrupti, aspernatur rerum cupiditate ad repudiandae quod!
    </p>
  </div>
  <div className="flex-1 flex justify-end">
    <Image
      src="/38iqvl.webp"
      alt="Thief.png"
      width={350}
      height={350}
      className="rounded-lg shadow-2xl border"
    />
  </div>
</div>


      </div>
      <Hero/>

    <div ref={addUrlRef}>
          <AddUrl />
        </div>

    </div>

    </>
  );
}