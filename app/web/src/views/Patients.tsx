import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Api from "../api/client";
import styles from "./Patients.module.css";

interface Patient {
  id: number;
  email: string;
  full_name: string;
  gender: string;
  dob: string | null;
}

interface Section {
  title: string;
  data: Patient[];
}

function groupPatientsAZ(patients: Patient[]): Section[] {
  const groups: { [letter: string]: Patient[] } = {};
  patients.forEach((patient) => {
    const letter = (patient.full_name?.[0] || "").toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(patient);
  });
  return Object.keys(groups)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groups[letter].sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      ),
    }));
}

const Patients: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get("doctor/patients/");
      setPatients(response.data);
      setFiltered(response.data);
    } catch (err: any) {
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (!search) {
      setFiltered(patients);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        patients.filter(
          (p) =>
            p.full_name.toLowerCase().includes(s) ||
            (p.email && p.email.toLowerCase().includes(s))
        )
      );
    }
  }, [search, patients]);

  const sections = groupPatientsAZ(filtered);

  const genderIndicator = (gender: string) => {
    if (gender?.toLowerCase() === "male") {
      return (
        <div className={styles.genderIndicatorWrapper}>
          <span className={styles.genderIcon}>👨</span>
          <span className={styles.patientDetails}>Male</span>
        </div>
      );
    }
    if (gender?.toLowerCase() === "female") {
      return (
        <div className={styles.genderIndicatorWrapper}>
          <span className={styles.genderIcon}>👩</span>
          <span className={styles.patientDetails}>Female</span>
        </div>
      );
    }
    if (gender?.toLowerCase() === "other") {
      return (
        <div className={styles.genderIndicatorWrapper}>
          <span className={styles.genderIcon}>⚧</span>
          <span className={styles.patientDetails}>Other</span>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      {sections.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyText}>No patients found.</div>
        </div>
      ) : (
        <div className={styles.sectionList}>
          {sections.map((section) => (
            <div key={section.title} className={styles.section}>
              <div className={styles.sectionHeader}>{section.title}</div>
              {section.data.map((item) => (
                <div key={item.id} className={styles.patientItem}>
                  <div className={styles.patientName}>{item.full_name}</div>
                  <div className={styles.patientDetailsContainer}>
                    <div className={styles.patientDetails}>
                      {item.dob ? item.dob : "DOB: -"}
                    </div>
                    {genderIndicator(item.gender)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;
