import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Discover.module.css";

const bacteriaList = [
  {
    id: "escherichia-coli",
    name: "Escherichia coli",
    description: "Common gut bacteria that can cause foodborne illness",
    image: require("../assets/images/bacteria/escherichia-coli.png"),
  },
  {
    id: "salmonella",
    name: "Salmonella",
    description: "Bacteria that can cause food poisoning and typhoid fever",
    image: require("../assets/images/bacteria/salmonella.png"),
  },
  {
    id: "listeria-monocytogenes",
    name: "Listeria monocytogenes",
    description: "Can cause serious infections, especially in pregnant women",
    image: require("../assets/images/bacteria/listeria-monocytogenes.png"),
  },
  {
    id: "staphylococcus-aureus",
    name: "Staphylococcus aureus",
    description: "Common bacteria that can cause skin infections",
    image: require("../assets/images/bacteria/staphylococcus-aureus.png"),
  },
  {
    id: "campylobacter",
    name: "Campylobacter",
    description: "Leading cause of bacterial foodborne illness",
    image: require("../assets/images/bacteria/campylobacter.png"),
  },
  {
    id: "clostridium-perfringens",
    name: "Clostridium perfringens",
    description: "Bacteria that can cause food poisoning and gas gangrene",
    image: require("../assets/images/bacteria/clostridium-perfringens.png"),
  },
  {
    id: "streptococcus-pyogenes",
    name: "Streptococcus pyogenes",
    description: "Bacteria that can cause strep throat and scarlet fever",
    image: require("../assets/images/bacteria/streptococcus-pyogenes.png"),
  },
  {
    id: "streptococcus-pneumoniae",
    name: "Streptococcus pneumoniae",
    description: "Bacteria that can cause pneumonia and meningitis",
    image: require("../assets/images/bacteria/streptococcus-pneumoniae.png"),
  },
];

const Discover: React.FC = () => {
  const navigate = useNavigate();

  const handleBacteriaClick = (id: string) => {
    navigate(`/bacteria/${id}`);
  };

  return (
    <div className={styles.root}>
      <div className={styles.title}>Discover Bacteria</div>
      <div className={styles.subtitle}>
        Learn about common bacteria and their effects
      </div>
      <div className={styles.bacteriaGrid}>
        {bacteriaList.map((bacteria) => (
          <div
            className={styles.bacteriaCard}
            key={bacteria.id}
            onClick={() => handleBacteriaClick(bacteria.id)}
          >
            <img
              src={bacteria.image}
              alt={bacteria.name}
              className={styles.bacteriaImage}
            />
            <div className={styles.bacteriaName}>{bacteria.name}</div>
            <div className={styles.bacteriaDescription}>
              {bacteria.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
