import React from "react";
import GlobalStarfield from "./(marketing)/_components/global-starfield";
import { SectionNav } from "./(marketing)/_components/section-nav";
import { ScrollProgress } from "./(marketing)/_components/scroll-progress";
import { SectionDivider } from "./(marketing)/_components/section-divider";
import { CustomCursor } from "./(marketing)/_components/custom-cursor";
import { FirstLoadLoader } from "./(marketing)/_components/first-load-loader";
import {
  SectionVoid,
  SectionPortal,
  SectionWhatIs,
  SectionUnbound,
  SectionDesignUniverse,
  SectionFourPillars,
  SectionPhilosophyToGarment,
  SectionFirstProduct,
  SectionKarmaArchive,
  SectionFinalQuestion,
} from "./(marketing)/_sections";

export default function Home() {
  return (
    <main
      id="main"
      className="relative w-full flex flex-col bg-ink text-ivory overflow-x-clip"
    >
      <FirstLoadLoader />
      <GlobalStarfield />
      <ScrollProgress />
      <SectionNav />
      <CustomCursor />

      <SectionVoid />
      <SectionDivider />
      {/* <SectionPortal /> */}
      {/* <SectionDivider /> */}
      <SectionWhatIs />
      <SectionDivider />
      <SectionUnbound />
      <SectionDivider />
      <SectionDesignUniverse />
      <SectionDivider />
      <SectionFourPillars />
      <SectionDivider />
      <SectionPhilosophyToGarment />
      <SectionDivider />
      <SectionFirstProduct />
      <SectionDivider />
      <SectionKarmaArchive />
      <SectionDivider />
      <SectionFinalQuestion />
    </main>
  );
}
