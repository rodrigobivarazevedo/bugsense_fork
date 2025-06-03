import React from "react";
import styles from "./BacteriaPage.module.css";

interface BacteriaInfo {
  id: string;
  name: string;
  scientificName: string;
  image: any;
  description: string;
  type: string;
  shape: string;
  transmission: string[];
  symptoms: string[];
  prevention: { icon: string; text: string }[];
  treatment: string;
}

interface BacteriaPageProps {
  bacteria: BacteriaInfo;
}

const BacteriaPage: React.FC<BacteriaPageProps> = ({ bacteria }) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img
          src={bacteria.image}
          alt={bacteria.name}
          className={styles.bacteriaImage}
        />
        <div className={styles.title}>{bacteria.name}</div>
        <div className={styles.scientificName}>{bacteria.scientificName}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Overview</div>
          <div className={styles.description}>{bacteria.description}</div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Type</div>
              <div className={styles.infoValue}>{bacteria.type}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Shape</div>
              <div className={styles.infoValue}>{bacteria.shape}</div>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Transmission</div>
          <div className={styles.symptomsList}>
            {bacteria.transmission.map((item, idx) => (
              <div className={styles.symptomItem} key={idx}>
                <div className={styles.bulletPoint} />
                <div className={styles.symptomText}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Symptoms</div>
          <div className={styles.symptomsList}>
            {bacteria.symptoms.map((item, idx) => (
              <div className={styles.symptomItem} key={idx}>
                <div className={styles.bulletPoint} />
                <div className={styles.symptomText}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Prevention</div>
          <div className={styles.preventionList}>
            {bacteria.prevention.map((item, idx) => (
              <div className={styles.preventionItem} key={idx}>
                <div className={styles.preventionIcon}>
                  {/* Add icon if needed */}
                </div>
                <div className={styles.preventionText}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Treatment</div>
          <div className={styles.description}>{bacteria.treatment}</div>
        </div>
      </div>
    </div>
  );
};

export default BacteriaPage;
