import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../api/client";
import styles from "./PatientTests.module.css";
import { getTranslatedTestStatus } from "../utils/TestResultsStatus";
import { formatDate, formatTime } from "../utils/DateTimeFormatter";

interface TestResult {
  id: number;
  user: number;
  qr_code: number;
  qr_data: string;
  status: string;
  infection_detected?: boolean;
  species?: string;
  concentration?: string;
  created_at: string;
}

interface Section {
  title: string;
  data: TestResult[];
}

function groupByDate(results: TestResult[]): Section[] {
  const groups: { [date: string]: TestResult[] } = {};
  results.forEach((item) => {
    const date = item.created_at.split("T")[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return Object.entries(groups).map(([date, data]) => ({ title: date, data }));
}

const PatientTests: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId, patientName } = location.state || {};

  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");

  useEffect(() => {
    setTimeFormat((localStorage.getItem("timeFormat") as "12" | "24") || "12");
  }, []);

  const fetchResults = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(`results/list/?user_id=${patientId}`);
      setResults(response.data);
    } catch (err: any) {
      setError("Failed to load patient test results.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const grouped = groupByDate(results);

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

  if (results.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noTestsContainer}>
          <div className={styles.noTestsText}>
            No tests available for this patient
          </div>
        </div>
      </div>
    );
  }

  const handleTestClick = (test: TestResult) => {
    navigate("/view-test", { state: { test } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.patientName}>
          {patientName ? `${patientName}'s Tests` : "Patient Tests"}
        </h2>
      </div>

      <div className={styles.sectionList}>
        {grouped.map((section) => (
          <div key={section.title} className={styles.section}>
            <div className={styles.sectionHeader}>
              {formatDate(section.title, "long", false, true)}
            </div>
            {section.data.map((item) => (
              <div
                key={item.id}
                className={styles.listItem}
                onClick={() => handleTestClick(item)}
              >
                <div className={styles.listItemTime}>
                  {formatTime(item.created_at, timeFormat)}
                </div>
                <div className={styles.listItemStatusContainer}>
                  <div
                    className={`${styles.statusIndicator} ${
                      item.status === "ongoing" ||
                      item.status === "preliminary_assessment"
                        ? styles.statusIndicatorYellow
                        : styles.statusIndicatorGreen
                    }`}
                  />
                  <div className={styles.listItemStatus}>
                    {getTranslatedTestStatus(item.status, t)}
                  </div>
                </div>
                {item.infection_detected !== undefined && (
                  <div className={styles.listItemValue}>
                    Infection: {item.infection_detected ? t("yes") : t("no")}
                  </div>
                )}
                {item.species && (
                  <div className={styles.listItemValue}>
                    Species: {item.species}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientTests;
