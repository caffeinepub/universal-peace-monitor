import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface IndividualInput {
    name: string;
    homeworld: string;
    peaceScore: bigint;
    species: Species;
}
export interface Individual {
    name: string;
    homeworld: string;
    peaceScore: bigint;
    species: Species;
}
export enum Species {
    extraterrestrialBeing = "extraterrestrialBeing",
    galacticHuman = "galacticHuman",
    roboticEntity = "roboticEntity",
    unknown_ = "unknown"
}
export interface backendInterface {
    addIndividual(input: IndividualInput): Promise<void>;
    applyDynamicDrift(): Promise<void>;
    deleteIndividual(name: string): Promise<void>;
    getAllIndividualsRanked(): Promise<Array<Individual>>;
    getIndividualStats(): Promise<[bigint, number]>;
    seedInitialIndividuals(number: bigint): Promise<bigint | null>;
    updateScore(name: string, newScore: bigint): Promise<void>;
}
