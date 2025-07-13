import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../api/client";
import styles from "./ViewPatient.module.css";
import { formatDateTimeGerman } from "../utils/DateTimeFormatter";
import { getTranslatedTestStatus } from "../utils/TestResultsStatus";
import {
  getSpeciesDisplayName,
  navigateToBacteriaDiscoverPage,
} from "../utils/BacteriaSpeciesUtils";
import InfoIcon from "@mui/icons-material/Info";
import ListIcon from "@mui/icons-material/List";

interface Patient {
  id: number;
  email: string;
  full_name: string;
  gender: string;
  dob: string | null;
  phone_number: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  date_joined: string;
}

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

const ViewPatient: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = location.state?.patientId;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [recentTest, setRecentTest] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await Api.get(
          `doctor/patients/?patient_id=${patientId}`
        );
        if (response.data && response.data.length > 0) {
          setPatient(response.data[0]);
        } else {
          setError("Patient not found.");
        }
      } catch (err) {
        setError("Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patientId]);

  useEffect(() => {
    const fetchRecentTest = async () => {
      if (!patientId) return;
      setLoadingTest(true);
      try {
        const response = await Api.get(`results/list/?user_id=${patientId}`);
        if (response.data && response.data.length > 0) {
          // Get the most recent test (first in the list since they're ordered by created_at desc)
          setRecentTest(response.data[0]);
        }
      } catch (err) {
        console.error("Failed to load recent test:", err);
      } finally {
        setLoadingTest(false);
      }
    };
    fetchRecentTest();
  }, [patientId]);

  const handleViewAllTests = () => {
    navigate("/patient-tests", {
      state: {
        patientId,
        patientName: patient?.full_name,
      },
    });
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

  if (!patient) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Patient not found.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Patient Details Section */}
      <div className={styles.section}>
        <div className={styles.label}>Full Name:</div>
        <div className={styles.value}>{patient.full_name}</div>

        <div className={styles.label}>Email:</div>
        <div className={styles.value}>{patient.email}</div>

        <div className={styles.label}>Gender:</div>
        <div className={styles.value}>{patient.gender || "-"}</div>

        <div className={styles.label}>Date of Birth:</div>
        <div className={styles.value}>{patient.dob || "-"}</div>

        <div className={styles.label}>Phone Number:</div>
        <div className={styles.value}>{patient.phone_number || "-"}</div>

        <div className={styles.label}>Address:</div>
        <div className={styles.patientInfoRow}>
          <div className={styles.patientInfoValue}>
            {patient.street ? `${patient.street}, ` : ""}
            {patient.city ? `${patient.city}, ` : ""}
            {patient.postcode ? `${patient.postcode}, ` : ""}
            {patient.country || "-"}
          </div>
        </div>
      </div>

      {/* Most Recent Test Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Most Recent Test</div>
        {loadingTest ? (
          <div className={styles.loading}>Loading test...</div>
        ) : recentTest ? (
          <div className={styles.resultBox}>
            <div className={styles.resultLabel}>
              Test Status:{" "}
              <span className={styles.resultValue}>
                {getTranslatedTestStatus(recentTest.status, t)}
              </span>
            </div>

            <div className={styles.resultLabel}>
              Test Started At:{" "}
              <span className={styles.resultValue}>
                {formatDateTimeGerman(recentTest.created_at)}
              </span>
            </div>

            {recentTest.infection_detected !== undefined && (
              <div className={styles.resultLabel}>
                Infection Detected:{" "}
                <span className={styles.resultValue}>
                  {recentTest.infection_detected ? t("yes") : t("no")}
                </span>
              </div>
            )}

            {recentTest.species && (
              <div className={styles.speciesRow}>
                <div className={styles.resultLabel}>
                  Species:{" "}
                  <span className={styles.resultValue}>
                    {getSpeciesDisplayName(recentTest.species)}
                  </span>
                </div>
                {recentTest.species !== "Sterile" && (
                  <button
                    className={styles.infoButton}
                    onClick={() =>
                      navigateToBacteriaDiscoverPage(
                        navigate,
                        recentTest.species!
                      )
                    }
                  >
                    <InfoIcon />
                  </button>
                )}
              </div>
            )}

            {recentTest.concentration && (
              <div className={styles.resultLabel}>
                Concentration:{" "}
                <span className={styles.resultValue}>
                  {recentTest.concentration}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.noTestsMessage}>
            Patient has no previous tests
          </div>
        )}
      </div>

      {/* View All Tests Button Section */}
      <div className={styles.section}>
        <button
          className={styles.viewAllTestsButton}
          onClick={handleViewAllTests}
        >
          <ListIcon style={{ marginRight: 8 }} />
          View All Tests
        </button>
      </div>
    </div>
  );
};

export default ViewPatient;
