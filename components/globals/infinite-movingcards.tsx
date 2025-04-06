"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { clients } from "@/lib/constant";
import Image from "next/image";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[20rem] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={clients}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
