import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEvents from "@/components/FeatureEvents";
import { Suspense } from "react";

const page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub For Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hachathons Meetups , and Conferneces, All in One Place
      </p>
      <ExploreBtn />
      <Suspense
        fallback={<p className="text-center">Loading amazing events...</p>}
      >
        {" "}
        <FeaturedEvents />
      </Suspense>
    </section>
  );
};

export default page;
