import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Api from "../api/client";
import styles from "./Tests.module.css";
import { Add } from "@mui/icons-material";

interface ResultItem {
  id: string | number;
  created_at: string;
  status: string;
  patient_name?: string;
  patient_id?: string;
  patient_dob?: string;
  qr_data?: string;
  result_status?: string; // Added for new logic
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

// Helper for status color and label
function getStatusProps(result_status: string, t: (key: string) => string) {
  if (
    result_status === "ongoing" ||
    result_status === "preliminary_assessment"
  ) {
    return {
      colorClass: styles.statusIndicatorInProgress,
      label:
        result_status === "ongoing"
          ? t("test_status_ongoing")
          : t("test_status_preliminary_assessment"),
    };
  }
  if (result_status === "ready" || result_status === "closed") {
    return {
      colorClass: styles.statusIndicatorComplete,
      label:
        result_status === "ready"
          ? t("test_status_ready")
          : t("test_status_closed"),
    };
  }
  return { colorClass: styles.statusIndicator, label: result_status };
}

const Tests: React.FC = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.addButtonContainer}>
        <button
          className={styles.addButton}
          onClick={() => navigate("/upload")}
        >
          <span className={styles.addButtonIcon}>
            <Add fontSize="inherit" />
          </span>
          <span className={styles.addButtonText}>Add new</span>
        </button>
      </div>
      <div className={styles.date}>
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "2-digit",
        })}
      </div>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.errorMsg}>{error}</div>
      ) : results.length === 0 ? (
        <div className={styles.noTestsContainer}>
          <div className={styles.noTestsText}>No tests available</div>
        </div>
      ) : (
        <div className={styles.sectionList}>
          {grouped.map((section) => (
            <div key={section.date} className={styles.section}>
              <div className={styles.sectionHeader}>
                {new Date(section.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "2-digit",
                })}
              </div>
              {section.data.map((item) => {
                const status = item.result_status || item.status;
                const { colorClass, label } = getStatusProps(status, t);
                return (
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
                        className={`${styles.statusIndicator} ${colorClass}`}
                      ></span>
                      <span className={styles.listItemStatus}>{label}</span>
                    </div>
                    {userType === "doctor" && (
                      <div className={styles.listItemPatient}>
                        <span className={styles.listItemLabel}>
                          Patient Name:
                        </span>
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
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;
