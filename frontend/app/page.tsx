"use client";

import Header from "@/app/Header";
import Hero from "@/app/Hero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import './globals.css';
import AddUrl from "./AddUrl";
import { useRef } from "react";

import Typewriter from "typewriter-effect";




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
        <h2 className="text-5xl mt-20  font-bold md:text-6xl lg:text-7xl xl:text-8xl">
        <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString('Welcome to BArgus.')
                .start();
            }}
            options={{
              autoStart: false,
              loop: false,
              delay: 100,
            }}
          />
        </h2>
        <p className="text-muted-foreground md:text-xl mx-auto max-w-[600]">
         Add it. Track it. Strike when the price drops.
        </p>
        <div  className="flex justify-center space-x-4">
        <Button size="lg" className="p-6 text-2xl" variant="outline"  onClick={scrollToAddUrl} >
                  Get Started
                </Button>
        </div>
        <div className="flex flex-row items-center justify-between max-w-6xl w-full mt-12 mx-auto px-4">
  <div className="flex-1 text-muted-foreground text-left mr-12 max-w-[500px]">
    <p>
Ever wish someone would just stalk that overpriced laptop until the price dropped?

That’s exactly what BArgus does. We monitor your favorite products around the clock—quietly, persistently, and yes, a little obsessively.

Whether it’s a phone, a laptop, or a dream pair of sneakers, BArgus keeps watch so you don’t have to.

Just paste the product link. We’ll handle the stalking.
    </p>
  </div>
  <div className="flex-1 flex justify-end">
    <Image
      src="/Bargus.png"
      alt="Ninja.png"
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