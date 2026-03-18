import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Individual, IndividualInput } from "../backend";
import { useActor } from "./useActor";

export function useGetAllIndividualsRanked() {
  const { actor, isFetching } = useActor();
  return useQuery<Individual[]>({
    queryKey: ["individuals-ranked"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIndividualsRanked();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetIndividualStats() {
  const { actor, isFetching } = useActor();
  return useQuery<[bigint, number]>({
    queryKey: ["individual-stats"],
    queryFn: async () => {
      if (!actor) return [0n, 0];
      return actor.getIndividualStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useAddIndividual() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: IndividualInput) => {
      if (!actor) throw new Error("No actor");
      return actor.addIndividual(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals-ranked"] });
      queryClient.invalidateQueries({ queryKey: ["individual-stats"] });
    },
  });
}

export function useApplyDynamicDrift() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.applyDynamicDrift();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals-ranked"] });
      queryClient.invalidateQueries({ queryKey: ["individual-stats"] });
    },
  });
}

export function useDeleteIndividual() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteIndividual(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals-ranked"] });
      queryClient.invalidateQueries({ queryKey: ["individual-stats"] });
    },
  });
}

export function useSeedInitialIndividuals() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (count: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.seedInitialIndividuals(count);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["individuals-ranked"] });
      queryClient.invalidateQueries({ queryKey: ["individual-stats"] });
    },
  });
}
