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
    id: "enterococcus-faecalis",
    name: "Enterococcus faecalis",
    description: "Common gut bacteria that can cause foodborne illness",
    image: require("../assets/images/bacteria/enterococcus-faecalis.png"),
  },
  {
    id: "klebsiella-pneumoniae",
    name: "Klebsiella pneumoniae",
    description: "Common bacteria that can cause pneumonia",
    image: require("../assets/images/bacteria/klebsiella-pneumoniae.png"),
  },
  {
    id: "staphylococcus-saprophyticus",
    name: "Staphylococcus saprophyticus",
    description: "Common bacteria that can cause skin infections",
    image: require("../assets/images/bacteria/staphylococcus-saprophyticus.png"),
  },
  {
    id: "staphylococcus-aureus",
    name: "Staphylococcus aureus",
    description: "Common bacteria that can cause skin infections",
    image: require("../assets/images/bacteria/staphylococcus-aureus.png"),
  },
  {
    id: "enterobacter-hormaechei",
    name: "Enterobacter hormaechei",
    description: "Common bacteria that can cause foodborne illness",
    image: require("../assets/images/bacteria/enterobacter-hormaechei.png"),
  },
  {
    id: "pseudomonas-aeruginosa",
    name: "Pseudomonas aeruginosa",
    description: "Common bacteria that can cause pneumonia",
    image: require("../assets/images/bacteria/pseudomonas-aeruginosa.png"),
  },
  {
    id: "proteus-mirabilis",
    name: "Proteus mirabilis",
    description: "Common bacteria that can cause foodborne illness",
    image: require("../assets/images/bacteria/proteus-mirabilis.png"),
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
        Learn about the bacteria that Bugsense test kits can detect
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
