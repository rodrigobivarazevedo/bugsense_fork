import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../api/client";
import styles from "./ViewTest.module.css";
import { formatDateTimeGerman } from "../utils/DateTimeFormatter";
import { getTranslatedTestStatus } from "../utils/TestResultsStatus";
import {
  getSpeciesDisplayName,
  navigateToBacteriaDiscoverPage,
} from "../utils/BacteriaSpeciesUtils";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

interface TestResult {
  id: string | number;
  created_at: string;
  status: string;
  qr_data: string;
  infection_detected?: boolean;
  species?: string;
  concentration?: number;
  closed_at?: string;
}

interface TestData {
  id: string | number;
  qr_data: string;
  created_at: string;
  closed_at?: string;
}

const ViewTest: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const test = location.state?.test as TestData;

  console.log("ViewTest component - test data:", test);

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!test?.qr_data) return;

      const token = localStorage.getItem("accessToken");
      console.log("Authentication check:", {
        hasToken: !!token,
        tokenLength: token?.length,
        qrData: test.qr_data,
      });

      if (!token) {
        setError("Not authenticated. Please log in again.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await Api.get(
          `results/list/?qr_data=${encodeURIComponent(test.qr_data)}`
        );
        setResult(
          response.data && response.data.length > 0 ? response.data[0] : null
        );
      } catch (err: any) {
        console.error("Error fetching test results:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Authentication failed. Please log in again.");
          } else if (err.response.status === 403) {
            setError(
              "Access denied. You don't have permission to view these results."
            );
          } else if (err.response.status === 404) {
            setError("Test results not found.");
          } else {
            setError(
              `Server error: ${err.response.status} - ${
                err.response.data?.detail || err.response.statusText
              }`
            );
          }
        } else if (err.request) {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setError(`Failed to load test results: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [test?.qr_data]);

  const uploadImage = async () => {
    if (!image || !test?.qr_data) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const storage = "local";

      await Api.post(
        `upload/?qr_data=${encodeURIComponent(
          test.qr_data
        )}&storage=${storage}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          service: "ml",
        } as any
      );
      alert("Image uploaded successfully!");
      setImage(null);

      const response = await Api.get(
        `results/list/?qr_data=${encodeURIComponent(test.qr_data)}`
      );
      setResult(
        response.data && response.data.length > 0 ? response.data[0] : null
      );
    } catch (err) {
      alert("Upload failed. Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyQrData = async () => {
    try {
      await navigator.clipboard.writeText(test?.qr_data || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleScanModalConfirm = () => {
    setShowScanModal(false);

    navigate("/upload", { state: { testId: test?.id } });
  };

  const handleScanModalClose = () => {
    setShowScanModal(false);
  };

  if (!test) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No test data provided</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.label}>Test Started At:</div>
        <div className={styles.value}>
          {formatDateTimeGerman(result?.created_at || test.created_at)}
        </div>

        <div className={styles.label}>Test Status:</div>
        <div className={styles.value}>
          {getTranslatedTestStatus(result?.status || "ongoing")}
        </div>

        <div className={styles.label}>Test QR Data:</div>
        <div className={styles.qrRow}>
          <div
            className={styles.qrValue}
            title={result?.qr_data || test.qr_data}
          >
            {result?.qr_data || test.qr_data}
          </div>
          <button className={styles.copyButton} onClick={handleCopyQrData}>
            {copied ? "✓" : "📋"}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Upload Image</div>
        <div className={styles.imageButtonsWrapper}>
          <button
            className={styles.uploadButton}
            type="button"
            onClick={() => navigate("/upload")}
          >
            <FolderOpenIcon style={{ marginRight: 8 }} />
            Return to Upload
          </button>
        </div>

        {image && (
          <>
            <div className={styles.imageContainer}>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className={styles.image}
              />
              <button
                className={styles.deleteImageButton}
                onClick={() => setImage(null)}
              >
                🗑️
              </button>
            </div>
            <button
              className={`${styles.uploadButton} ${
                uploading ? styles.uploading : ""
              }`}
              onClick={uploadImage}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Test Results</div>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : result ? (
          <div className={styles.resultBox}>
            <div className={styles.resultLabel}>
              Infection Detected:{" "}
              <span className={styles.resultValue}>
                {result.infection_detected !== undefined
                  ? result.infection_detected
                    ? t("yes")
                    : t("no")
                  : "-"}
              </span>
            </div>

            <div className={styles.speciesRow}>
              <div className={styles.resultLabel}>
                Species:{" "}
                <span className={styles.resultValue}>
                  {getSpeciesDisplayName(result.species || "") || "-"}
                </span>
              </div>
              {result.species && result.species !== "Sterile" && (
                <button
                  className={styles.infoButton}
                  onClick={() =>
                    navigateToBacteriaDiscoverPage(navigate, result.species!)
                  }
                >
                  ℹ️
                </button>
              )}
            </div>

            <div className={styles.resultLabel}>
              Concentration:{" "}
              <span className={styles.resultValue}>
                {result.concentration ? `${result.concentration} CFU/mL` : "-"}
              </span>
            </div>

            <div className={styles.resultLabel}>
              Test Completed At:{" "}
              <span className={styles.resultValue}>
                {test.closed_at ? formatDateTimeGerman(test.closed_at) : "-"}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            No results available for this test yet.
          </div>
        )}
      </div>

      {/* Scan Instructions Modal */}
      {showScanModal && (
        <div className={styles.modalOverlay} onClick={handleScanModalClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Scan Instructions</h3>
            <p>
              Please ensure your test strip is well-lit and clearly visible
              before scanning.
            </p>
            <div className={styles.modalActions}>
              <button onClick={handleScanModalClose}>Cancel</button>
              <button onClick={handleScanModalConfirm}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTest;
