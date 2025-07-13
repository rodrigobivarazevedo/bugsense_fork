import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Api from "../api/client";
import styles from "./Overview.module.css";

interface TestItem {
    id: number;
    qr_data: string;
    created_at: string;
    result_status: string;
    patient?: {
        id: number;
        full_name: string;
        email: string;
        dob?: string;
    };
}

const Overview: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ongoingTests, setOngoingTests] = useState<TestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userType, setUserType] = useState<string>("patient");
    const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");

    useEffect(() => {
        setUserType(localStorage.getItem("userType") || "patient");
        setTimeFormat((localStorage.getItem("timeFormat") as "12" | "24") || "12");
    }, []);

    useEffect(() => {
        const fetchOngoingTests = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Api.get("qr-codes/list/");

                // Filter for ongoing tests (ongoing, preliminary_assessment, ready)
                const ongoing = response.data.filter((test: TestItem) =>
                    ["ongoing", "preliminary_assessment", "ready"].includes(test.result_status)
                );

                setOngoingTests(ongoing);
            } catch (err: any) {
                setError(t("failed_to_load_results"));
            } finally {
                setLoading(false);
            }
        };

        fetchOngoingTests();
    }, [t]);

    const handleTestClick = (test: TestItem) => {
        navigate("/view-test", { state: { test } });
    };

    const getStatusIndicatorClass = (status: string) => {
        switch (status) {
            case "ongoing":
                return styles.statusIndicatorOngoing;
            case "preliminary_assessment":
                return styles.statusIndicatorPreliminary;
            case "ready":
                return styles.statusIndicatorReady;
            default:
                return styles.statusIndicatorOngoing;
        }
    };

    const formatTime = (dateStr: string, timeFormat: "12" | "24") => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: timeFormat === "12",
        });
    };

    const getTranslatedTestStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            ongoing: t("test_status_ongoing"),
            preliminary_assessment: t("test_status_preliminary_assessment"),
            ready: t("test_status_ready"),
            closed: t("test_status_closed"),
            completed: t("test_status_completed"),
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>
                    {userType === "doctor" ? t("overview") : t("overview")}
                </h1>
                <p className={styles.headerSubtitle}>
                    {userType === "doctor"
                        ? t("overview_subtitle_doctor")
                        : t("overview_subtitle_patient")}
                </p>
            </div>

            <div className={styles.content}>
                {error ? (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorText}>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            {t("retry")}
                        </button>
                    </div>
                ) : ongoingTests.length > 0 ? (
                    <div className={styles.ongoingTestsSection}>
                        <h2 className={styles.sectionTitle}>
                            {userType === "doctor"
                                ? t("ongoing_tests_for_patients")
                                : t("ongoing_tests")}
                        </h2>
                        <div className={styles.testGrid}>
                            {ongoingTests.map((test) => (
                                <div
                                    key={test.id}
                                    className={styles.testCard}
                                    onClick={() => handleTestClick(test)}
                                >
                                    <div className={styles.testCardHeader}>
                                        <h3 className={styles.testCardTitle}>
                                            {userType === "doctor" ? t("test") : t("test")} #{test.id}
                                        </h3>
                                        <span className={styles.testCardTime}>
                                            {formatTime(test.created_at, timeFormat)}
                                        </span>
                                    </div>

                                    <div className={styles.testCardStatus}>
                                        <div
                                            className={`${styles.statusIndicator} ${getStatusIndicatorClass(
                                                test.result_status
                                            )}`}
                                        ></div>
                                        <span className={styles.statusText}>
                                            {getTranslatedTestStatus(test.result_status)}
                                        </span>
                                    </div>

                                    {userType === "doctor" && test.patient && (
                                        <div className={styles.patientInfo}>
                                            <div className={styles.patientInfoRow}>
                                                <span className={styles.patientInfoLabel}>
                                                    {t("patient_name_colon")}
                                                </span>
                                                <span className={styles.patientInfoValue}>
                                                    {test.patient.full_name}
                                                </span>
                                            </div>
                                            <div className={styles.patientInfoRow}>
                                                <span className={styles.patientInfoLabel}>
                                                    {t("id_colon")}
                                                </span>
                                                <span className={styles.patientInfoValue}>
                                                    {test.patient.id}
                                                </span>
                                            </div>
                                            <div className={styles.patientInfoRow}>
                                                <span className={styles.patientInfoLabel}>
                                                    {t("dob_colon")}
                                                </span>
                                                <span className={styles.patientInfoValue}>
                                                    {test.patient.dob || t("dob_not_available")}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.noTestsContainer}>
                        <div className={styles.noTestsIcon}>🔬</div>
                        <h2 className={styles.noTestsTitle}>
                            {userType === "doctor"
                                ? t("no_ongoing_tests_for_patients")
                                : t("no_ongoing_tests")}
                        </h2>
                        <p className={styles.noTestsText}>
                            {userType === "doctor"
                                ? t("no_ongoing_tests_for_patients_description")
                                : t("no_ongoing_tests_description")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview; 