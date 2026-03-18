import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";
import AddIndividualForm from "./components/AddIndividualForm";
import Footer from "./components/Footer";
import GlobalStats from "./components/GlobalStats";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Leaderboard from "./components/Leaderboard";
import StarfieldCanvas from "./components/StarfieldCanvas";
import {
  useApplyDynamicDrift,
  useGetAllIndividualsRanked,
  useSeedInitialIndividuals,
} from "./hooks/useQueries";

function AutoDrift() {
  const driftMutation = useApplyDynamicDrift();
  const mutateRef = useRef(driftMutation.mutate);
  mutateRef.current = driftMutation.mutate;

  useEffect(() => {
    const interval = setInterval(() => {
      mutateRef.current();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
}

function SeedOnEmpty() {
  const { data: individuals = [], isLoading } = useGetAllIndividualsRanked();
  const seedMutation = useSeedInitialIndividuals();
  const mutateRef = useRef(seedMutation.mutate);
  mutateRef.current = seedMutation.mutate;
  const seededRef = useRef(false);

  useEffect(() => {
    if (!isLoading && individuals.length === 0 && !seededRef.current) {
      seededRef.current = true;
      mutateRef.current(12n);
    }
  }, [isLoading, individuals.length]);

  return null;
}

export default function App() {
  return (
    <div className="aurora-bg min-h-screen relative">
      <StarfieldCanvas />
      <AutoDrift />
      <SeedOnEmpty />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-8">
          <HeroSection />

          {/* Main content row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-6">
            <Leaderboard />
            <GlobalStats />
          </div>

          {/* Secondary row */}
          <div id="my-score">
            <AddIndividualForm />
          </div>
        </main>

        <Footer />
      </div>

      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "glass-card border-aurora-teal/20 text-foreground",
          },
        }}
      />
    </div>
  );
}
