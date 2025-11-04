"use client";
import Link from "next/link";
import Image from "next/image";
const ExploreBtn = () => {
  return (
    <button className="mt-7 mx-auto" id="explore-btn" type="button">
      <Link href="#events">
        Explore Events
        <Image src="icons/arrow-down.svg" alt="arrow" width={24} height={24} />
      </Link>
    </button>
  );
};

export default ExploreBtn;
