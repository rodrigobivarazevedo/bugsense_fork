import { NavigateFunction } from "react-router-dom";

export const getSpeciesDisplayName = (species: string): string => {
  const speciesMap: { [key: string]: string } = {
    "E.C": "Escherichia coli",
    "E.F": "Enterococcus faecalis",
    "E.H": "Enterobacter hormaechei",
    "K.P": "Klebsiella pneumoniae",
    "P.A": "Pseudomonas aeruginosa",
    "P.M": "Proteus mirabilis",
    "S.A": "Staphylococcus aureus",
    "S.S": "Staphylococcus saprophyticus",
    Sterile: "Sterile",
  };

  return speciesMap[species] || species;
};

export const navigateToBacteriaDiscoverPage = (
  navigate: NavigateFunction,
  species: string
) => {
  const speciesMap: { [key: string]: string } = {
    "E.C": "EscherichiaColi",
    "E.F": "EnterococcusFaecalis",
    "E.H": "EnterobacterHormaechei",
    "K.P": "KlebsiellaPneumoniae",
    "P.A": "PseudomonasAeruginosa",
    "P.M": "ProteusMirabilis",
    "S.A": "StaphylococcusAureus",
    "S.S": "StaphylococcusSaprophyticus",
  };

  const route = speciesMap[species];
  if (route) {
    navigate(`/bacteria/${route.toLowerCase()}`);
  }
};
