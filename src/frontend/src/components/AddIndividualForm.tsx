import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Species } from "../backend";
import {
  useAddIndividual,
  useSeedInitialIndividuals,
} from "../hooks/useQueries";

const SPECIES_OPTIONS = [
  { value: Species.galacticHuman, label: "Galactic Human", emoji: "👤" },
  {
    value: Species.extraterrestrialBeing,
    label: "Extraterrestrial Being",
    emoji: "👽",
  },
  { value: Species.roboticEntity, label: "Robotic Entity", emoji: "🤖" },
  { value: Species.unknown_, label: "Unknown Entity", emoji: "❓" },
];

export default function AddIndividualForm() {
  const addMutation = useAddIndividual();
  const seedMutation = useSeedInitialIndividuals();

  const [name, setName] = useState("");
  const [homeworld, setHomeworld] = useState("");
  const [species, setSpecies] = useState<Species>(Species.galacticHuman);
  const [peaceScore, setPeaceScore] = useState("500");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!homeworld.trim()) e.homeworld = "Homeworld is required";
    const score = Number(peaceScore);
    if (Number.isNaN(score) || score < 0 || score > 1000)
      e.peaceScore = "Score must be 0–1000";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await addMutation.mutateAsync({
        name: name.trim(),
        homeworld: homeworld.trim(),
        species,
        peaceScore: BigInt(Math.round(Number(peaceScore))),
      });
      toast.success(`${name.trim()} added to the universe`);
      setName("");
      setHomeworld("");
      setPeaceScore("500");
      setSpecies(Species.galacticHuman);
    } catch {
      toast.error("Failed to add individual");
    }
  };

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync(10n);
      toast.success("10 beings seeded across the universe");
    } catch {
      toast.error("Failed to seed individuals");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card rounded-xl shadow-card p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <UserPlus className="w-4 h-4 text-aurora-teal" />
        <h2 className="font-display font-700 text-[11px] tracking-[0.25em] text-foreground uppercase">
          Register Individual
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSeed}
          disabled={seedMutation.isPending}
          data-ocid="add_individual.seed.button"
          className="ml-auto h-7 px-3 text-[9px] tracking-widest border border-aurora-purple/30 text-aurora-purple hover:bg-aurora-purple/10 uppercase rounded-full"
        >
          {seedMutation.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
          ) : (
            <Sparkles className="w-3 h-3 mr-1" />
          )}
          Seed Universe
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="ind-name"
              className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
            >
              Name
            </Label>
            <Input
              id="ind-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zara of Andromeda"
              data-ocid="add_individual.name.input"
              className="h-9 text-sm bg-white/5 border-white/10 placeholder:text-muted-foreground/50 focus:border-aurora-teal/50"
            />
            {errors.name && (
              <p
                data-ocid="add_individual.name.error_state"
                className="text-[10px] text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="ind-homeworld"
              className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
            >
              Homeworld
            </Label>
            <Input
              id="ind-homeworld"
              value={homeworld}
              onChange={(e) => setHomeworld(e.target.value)}
              placeholder="e.g. Kepler-442b"
              data-ocid="add_individual.homeworld.input"
              className="h-9 text-sm bg-white/5 border-white/10 placeholder:text-muted-foreground/50 focus:border-aurora-teal/50"
            />
            {errors.homeworld && (
              <p
                data-ocid="add_individual.homeworld.error_state"
                className="text-[10px] text-destructive"
              >
                {errors.homeworld}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Species
            </Label>
            <Select
              value={species}
              onValueChange={(v) => setSpecies(v as Species)}
            >
              <SelectTrigger
                data-ocid="add_individual.species.select"
                className="h-9 text-sm bg-white/5 border-white/10 focus:border-aurora-teal/50"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {SPECIES_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-sm"
                  >
                    {opt.emoji} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="ind-score"
              className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
            >
              Initial Peace Score (0–1000)
            </Label>
            <Input
              id="ind-score"
              type="number"
              min={0}
              max={1000}
              value={peaceScore}
              onChange={(e) => setPeaceScore(e.target.value)}
              data-ocid="add_individual.peace_score.input"
              className="h-9 text-sm bg-white/5 border-white/10 focus:border-aurora-teal/50"
            />
            {errors.peaceScore && (
              <p
                data-ocid="add_individual.peace_score.error_state"
                className="text-[10px] text-destructive"
              >
                {errors.peaceScore}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={addMutation.isPending}
          data-ocid="add_individual.submit_button"
          className="mt-5 w-full h-10 text-[11px] tracking-[0.25em] uppercase font-display font-600 bg-aurora-teal/15 hover:bg-aurora-teal/25 border border-aurora-teal/40 text-aurora-teal shadow-glow-sm"
        >
          {addMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Registering…
            </>
          ) : (
            "Register Being"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
