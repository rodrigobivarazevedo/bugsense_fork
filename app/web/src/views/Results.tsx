import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Api from "../api/client";
import styles from "./Results.module.css";

interface ResultItem {
  id: string | number;
  created_at: string;
  status: string;
  patient_name?: string;
  patient_id?: string;
  patient_dob?: string;
  qr_data?: string;
}

type GroupedResults = {
  date: string;
  data: ResultItem[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: "long", day: "2-digit" });
}

function formatTime(dateStr: string, timeFormat: "12" | "24") {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: timeFormat === "12",
  });
}

function groupByDate(results: ResultItem[]): GroupedResults[] {
  const groups: { [date: string]: ResultItem[] } = {};
  results.forEach((item) => {
    const date = item.created_at.split("T")[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return Object.entries(groups).map(([date, data]) => ({ date, data }));
}

const getTranslatedTestStatus = (status: string) => {
  switch (status) {
    case "ongoing":
      return "In Progress";
    case "preliminary_assessment":
      return "Preliminary Assessment";
    case "ready":
      return "Ready";
    case "closed":
      return "Completed";
    default:
      return status;
  }
};

const Results: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("patient");
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");

  useEffect(() => {
    setUserType(localStorage.getItem("userType") || "patient");
    setTimeFormat((localStorage.getItem("timeFormat") as "12" | "24") || "12");
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await Api.get("qr-codes/list/");
        setResults(response.data);
      } catch (err: any) {
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleItemClick = (item: ResultItem) => {
    navigate("/view-test", { state: { test: item } });
  };

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
        <div className={styles.errorMsg}>{error}</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.addButtonContainer}>
          <button
            className={styles.addButton}
            onClick={() => navigate("/upload")}
          >
            + Add new
          </button>
        </div>
        <div className={styles.noTestsContainer}>
          <div className={styles.noTestsText}>No tests available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.addButtonContainer}>
        <button
          className={styles.addButton}
          onClick={() => navigate("/upload")}
        >
          + Add new
        </button>
      </div>
      <div className={styles.sectionList}>
        {grouped.map((section) => (
          <div key={section.date} className={styles.section}>
            <div className={styles.sectionHeader}>
              {formatDate(section.date)}
            </div>
            {section.data.map((item) => (
              <div
                key={item.id}
                className={styles.listItem}
                onClick={() => handleItemClick(item)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.listItemTime}>
                  {formatTime(item.created_at, timeFormat)}
                </div>
                <div className={styles.listItemStatusContainer}>
                  <span
                    className={`${styles.statusIndicator} ${
                      item.status === "ongoing" ||
                      item.status === "preliminary_assessment"
                        ? styles.statusIndicatorInProgress
                        : styles.statusIndicatorComplete
                    }`}
                  ></span>
                  <span className={styles.listItemStatus}>
                    {getTranslatedTestStatus(item.status)}
                  </span>
                </div>
                {userType === "doctor" && (
                  <div className={styles.listItemPatient}>
                    <span className={styles.listItemLabel}>Patient Name:</span>
                    <span className={styles.listItemValue}>
                      {item.patient_name || "-"}
                    </span>
                    <span className={styles.listItemLabel}>ID:</span>
                    <span className={styles.listItemValue}>
                      {item.patient_id || "-"}
                    </span>
                    <span className={styles.listItemLabel}>DOB:</span>
                    <span className={styles.listItemValue}>
                      {item.patient_dob || "-"}
                    </span>
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

export default Results;
