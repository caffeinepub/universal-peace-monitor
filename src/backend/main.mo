import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Float "mo:core/Float";

actor {
  let storage = Map.empty<Text, Individual>();

  type Species = {
    #galacticHuman;
    #roboticEntity;
    #extraterrestrialBeing;
    #unknown;
  };

  module Species {
    public func toText(species : Species) : Text {
      switch (species) {
        case (#galacticHuman) { "Galactic Human" };
        case (#roboticEntity) { "Robotic Entity" };
        case (#extraterrestrialBeing) { "Extraterrestrial Being" };
        case (#unknown) { "Unknown" };
      };
    };

    public func fromText(text : Text) : ?Species {
      switch (text) {
        case ("Galactic Human") { ?#galacticHuman };
        case ("Robotic Entity") { ?#roboticEntity };
        case ("Extraterrestrial Being") { ?#extraterrestrialBeing };
        case ("Unknown") { ?#unknown };
        case (_) { null };
      };
    };

    public func compare(a : Species, b : Species) : Order.Order {
      Text.compare(toText(a), toText(b));
    };
  };

  type Individual = {
    name : Text;
    species : Species;
    homeworld : Text;
    peaceScore : Nat;
  };

  module Individual {
    public func compareByPeaceScoreDescending(a : Individual, b : Individual) : Order.Order {
      Nat.compare(b.peaceScore, a.peaceScore);
    };

    public func compareByPeaceScoreAscending(a : Individual, b : Individual) : Order.Order {
      Nat.compare(a.peaceScore, b.peaceScore);
    };

    public func compareByName(a : Individual, b : Individual) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  type IndividualInput = {
    name : Text;
    species : Species;
    homeworld : Text;
    peaceScore : Nat;
  };

  public shared ({ caller }) func addIndividual(input : IndividualInput) : async () {
    if (storage.containsKey(input.name)) {
      Runtime.trap("Individual already exists with this name");
    };
    let newIndividual : Individual = input;
    storage.add(input.name, newIndividual);
  };

  public query ({ caller }) func getAllIndividualsRanked() : async [Individual] {
    storage.values().toArray().sort(Individual.compareByPeaceScoreDescending);
  };

  public shared ({ caller }) func updateScore(name : Text, newScore : Nat) : async () {
    switch (storage.get(name)) {
      case (null) { Runtime.trap("This individual does not exist.") };
      case (?individual) {
        let updated : Individual = {
          name = individual.name;
          species = individual.species;
          homeworld = individual.homeworld;
          peaceScore = newScore;
        };
        storage.add(name, updated);
      };
    };
  };

  public shared ({ caller }) func deleteIndividual(name : Text) : async () {
    if (storage.containsKey(name)) {
      storage.remove(name);
    } else {
      Runtime.trap("This individual does not exist.");
    };
  };

  public shared ({ caller }) func applyDynamicDrift() : async () {
    let driftArray : [Nat] = [200, 100, 0, 180, 50, 201, 20, 0, 100, 12, 89, 130, 33, 72, 198];
    let length = driftArray.size();
    let driftedIndividualsList = List.empty<(Text, Individual)>();

    for (entry in storage.entries()) {
      switch (entry) {
        case (name, individual) {
          let driftIndex = driftedIndividualsList.size() % 15;
          let drift = driftArray[driftIndex];
          let newScore = individual.peaceScore + drift;
          let boundedScore = if (newScore > 10000) { 10000 } else if (Int.abs(newScore.toInt()) < 0) {
            0;
          } else { newScore };
          let updated : Individual = { individual with peaceScore = boundedScore };
          driftedIndividualsList.add((name, updated));
        };
      };
    };

    for ((name, updated) in driftedIndividualsList.values()) {
      storage.add(name, updated);
    };
  };

  public query ({ caller }) func getIndividualStats() : async (Nat, Float) {
    let total = storage.size();
    let sum = storage.values().toArray().foldLeft(
      0,
      func(acc, person) { acc + person.peaceScore },
    );
    let average = if (total > 0) {
      sum.toFloat() / total.toFloat();
    } else {
      0.0;
    };
    (total, average);
  };

  public shared ({ caller }) func seedInitialIndividuals(number : Nat) : async ?Nat {
    if ((await getAllIndividualsRanked()).size() > 0) { return null };
    let toSeed = if (number > 15) { 15 } else { number };

    let initialIndividuals : [IndividualInput] = [
      { name = "Leia Organa"; species = #galacticHuman; homeworld = "Alderaan"; peaceScore = 8421 },
      { name = "R2-D2"; species = #roboticEntity; homeworld = "Naboo"; peaceScore = 7568 },
      { name = "E.T."; species = #extraterrestrialBeing; homeworld = "Brodo Asogi"; peaceScore = 9999 },
      { name = "Spock"; species = #galacticHuman; homeworld = "Vulcan"; peaceScore = 8732 },
      { name = "Groot"; species = #extraterrestrialBeing; homeworld = "Planet X"; peaceScore = 7824 },
      { name = "C-3PO"; species = #roboticEntity; homeworld = "Tatooine"; peaceScore = 8107 },
      { name = "Yoda"; species = #extraterrestrialBeing; homeworld = "Dagobah"; peaceScore = 9420 },
      { name = "Optimus Prime"; species = #roboticEntity; homeworld = "Cybertron"; peaceScore = 8845 },
      { name = "Data"; species = #roboticEntity; homeworld = "Omicron Theta"; peaceScore = 8543 },
      { name = "Gamora"; species = #extraterrestrialBeing; homeworld = "Zen-Whoberi"; peaceScore = 8231 },
      { name = "Luke Skywalker"; species = #galacticHuman; homeworld = "Tatooine"; peaceScore = 8221 },
      { name = "WALL-E"; species = #roboticEntity; homeworld = "Earth"; peaceScore = 7871 },
      { name = "Mork"; species = #extraterrestrialBeing; homeworld = "Ork"; peaceScore = 8132 },
      { name = "Sarek"; species = #galacticHuman; homeworld = "Vulcan"; peaceScore = 8314 },
      { name = "Megatron"; species = #roboticEntity; homeworld = "Cybertron"; peaceScore = 1264 },
    ];

    var i = 0;
    while (i < toSeed) {
      await addIndividual(initialIndividuals[i]);
      i += 1;
    };
    ?toSeed;
  };
};
