import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Account.module.css";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { ReactComponent as Logo } from "../assets/logo.svg";
import Api from "../api/client";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male", icon: <MaleIcon fontSize="small" /> },
  { value: "Female", label: "Female", icon: <FemaleIcon fontSize="small" /> },
  {
    value: "Not Specified",
    label: "Not Specified",
    icon: <TransgenderIcon fontSize="small" />,
  },
];

const Account = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [addressFields, setAddressFields] = useState({
    street: "",
    city: "",
    postcode: "",
    country: "",
  });
  const [originalAddressFields, setOriginalAddressFields] = useState({
    street: "",
    city: "",
    postcode: "",
    country: "",
  });
  const [showAddressActions, setShowAddressActions] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingField, setPendingField] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<string>("");

  // Always fetch user data from API
  const fetchUser = async () => {
    try {
      const res = await Api.get("users/me/");
      setUser(res.data);
      setAddressFields({
        street: res.data.street || "",
        city: res.data.city || "",
        postcode: res.data.postcode || "",
        country: res.data.country || "",
      });
      setOriginalAddressFields({
        street: res.data.street || "",
        city: res.data.city || "",
        postcode: res.data.postcode || "",
        country: res.data.country || "",
      });
    } catch (err) {
      setError(t("Could not load profile"));
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [t]);

  // Determine userType from API response
  const userType = user?.is_doctor ? "doctor" : "patient";

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(user?.[field] || "");
    if (field === "gender") setShowGenderModal(true);
    if (field === "dob") setShowDateModal(true);
  };

  const handleSave = async (field: string) => {
    if (field === "full_name" || field === "email") {
      setPendingField(field);
      setPendingValue(tempValue);
      setShowConfirmModal(true);
      return;
    }
    try {
      await Api.put("users/me/", { [field]: tempValue });
      setEditingField(null);
      await fetchUser();
    } catch (err) {
      setError(t("Failed to update field. Please try again."));
    }
  };

  const handleConfirmSave = async () => {
    if (pendingField) {
      try {
        await Api.put("users/me/", { [pendingField]: pendingValue });
        await fetchUser();
      } catch (err) {
        setError(t("Failed to update field. Please try again."));
      }
    }
    setEditingField(null);
    setShowConfirmModal(false);
    setPendingField(null);
    setPendingValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setShowGenderModal(false);
    setShowDateModal(false);
    setShowConfirmModal(false);
    setPendingField(null);
    setPendingValue("");
  };

  const handleGenderSelect = async (gender: string) => {
    try {
      await Api.put("users/me/", { gender });
      await fetchUser();
    } catch (err) {
      setError(t("Failed to update gender. Please try again."));
    }
    setEditingField(null);
    setShowGenderModal(false);
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempValue(value);
    try {
      await Api.put("users/me/", { dob: value });
      await fetchUser();
    } catch (err) {
      setError(t("Failed to update date of birth. Please try again."));
    }
    setEditingField(null);
    setShowDateModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempValue(value);
  };

  const handleAddressFieldChange = (field: string, value: string) => {
    setAddressFields((prev) => ({ ...prev, [field]: value }));
    setShowAddressActions(true);
  };

  const handleAddressSave = async () => {
    try {
      await Api.put("users/me/", addressFields);
      setOriginalAddressFields(addressFields);
      setShowAddressActions(false);
      await fetchUser();
    } catch (err) {
      setError(t("Failed to update address. Please try again."));
    }
  };

  const handleAddressCancel = () => {
    setAddressFields(originalAddressFields);
    setShowAddressActions(false);
  };

  const hasAddressChanges = () => {
    return (
      addressFields.street !== originalAddressFields.street ||
      addressFields.city !== originalAddressFields.city ||
      addressFields.postcode !== originalAddressFields.postcode ||
      addressFields.country !== originalAddressFields.country
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        t(
          "Are you sure you want to delete your account? This cannot be undone."
        )
      )
    )
      return;
    try {
      await Api.delete("users/me/");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    } catch (err) {
      setError(t("Could not delete account. Please try again."));
    }
  };

  // Renderers
  const renderEditableField = (field: string, value: string) => {
    if (userType === "doctor") {
      return <span className={styles.itemValue}>{value}</span>;
    }
    if (editingField === field) {
      if (field === "gender") {
        return null; // Modal will show
      }
      if (field === "dob") {
        return (
          <input
            type="date"
            value={tempValue}
            onChange={handleDateChange}
            className={styles.input}
            style={{ maxWidth: 180 }}
            autoFocus
          />
        );
      }
      return (
        <input
          type={field === "email" ? "email" : "text"}
          value={tempValue}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={styles.input}
          autoFocus
        />
      );
    }
    return <span className={styles.itemValue}>{value}</span>;
  };

  if (!user) {
    return <div className={styles.container}>{t("Loading...")}</div>;
  }

  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileCardBgLogo}>
          <Logo width={120} height={120} />
        </div>
        <div className={styles.profileCardContent}>
          <div className={styles.profileImage}>
            <AccountCircleIcon style={{ fontSize: 64, color: "#2e2747" }} />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.userName}>{user.full_name}</div>
            <div className={styles.dateJoined}>
              {t("Joined")} {user.date_joined}
            </div>
            <div className={styles.userTypeIndicator}>
              <span className={styles.userTypeText}>
                {userType === "doctor" ? t("Medical Personnel") : t("Patient")}
              </span>
            </div>
            {userType === "doctor" && user.institution_name && (
              <div className={styles.institutionInfo}>
                <div className={styles.institutionLabel}>
                  {t("Institution")}
                </div>
                <div className={styles.institutionName}>
                  {user.institution_name}
                </div>
              </div>
            )}
            {userType === "doctor" && user.doctor_id && (
              <div className={styles.doctorIdInfo}>
                <div className={styles.doctorIdLabel}>{t("Doctor ID")}</div>
                <div className={styles.doctorIdValue}>{user.doctor_id}</div>
              </div>
            )}
            {userType === "patient" && (
              <button className={styles.qrButton}>
                <QrCodeIcon fontSize="small" style={{ color: "#2e2747" }} />
                <span className={styles.qrButtonText}>
                  {t("View my QR code")}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className={styles.sectionTitle}>{t("Account Details")}</div>
      <div className={styles.lightCard}>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <div className={styles.itemLabel}>{t("Name")}</div>
            {renderEditableField("full_name", user.full_name)}
          </div>
          {userType === "patient" && (
            <button
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("full_name")}
            >
              {" "}
              <EditIcon fontSize="small" />{" "}
            </button>
          )}
        </div>
        {userType === "patient" && (
          <>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <div className={styles.itemLabel}>{t("Gender")}</div>
                {renderEditableField("gender", user.gender)}
              </div>
              <button
                className={styles.editIconBtnLight}
                onClick={() => handleEdit("gender")}
              >
                {" "}
                <EditIcon fontSize="small" />{" "}
              </button>
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <div className={styles.itemLabel}>{t("Date of birth")}</div>
                {renderEditableField("dob", user.dob)}
              </div>
              <button
                className={styles.editIconBtnLight}
                onClick={() => handleEdit("dob")}
              >
                {" "}
                <EditIcon fontSize="small" />{" "}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Contact Data */}
      <div className={styles.sectionTitle}>{t("Contact Data")}</div>
      <div className={styles.lightCard}>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <div className={styles.itemLabel}>{t("Email address")}</div>
            {renderEditableField("email", user.email)}
          </div>
          {userType === "patient" && (
            <button
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("email")}
            >
              {" "}
              <EditIcon fontSize="small" />{" "}
            </button>
          )}
        </div>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <div className={styles.itemLabel}>{t("Phone number")}</div>
            {renderEditableField("phone_number", user.phone_number)}
          </div>
          {userType === "patient" && (
            <button
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("phone_number")}
            >
              {" "}
              <EditIcon fontSize="small" />{" "}
            </button>
          )}
        </div>
      </div>

      {/* Address (patients only) */}
      {userType === "patient" && (
        <>
          <div className={styles.sectionTitle}>{t("Address")}</div>
          <div className={styles.lightCard}>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <div className={styles.itemLabel}>{t("Street")}</div>
                <input
                  type="text"
                  value={addressFields.street}
                  onChange={(e) =>
                    handleAddressFieldChange("street", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <div className={styles.itemLabel}>{t("City")}</div>
                <input
                  type="text"
                  value={addressFields.city}
                  onChange={(e) =>
                    handleAddressFieldChange("city", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <div className={styles.itemLabel}>{t("Postcode")}</div>
                <input
                  type="text"
                  value={addressFields.postcode}
                  onChange={(e) =>
                    handleAddressFieldChange("postcode", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <div className={styles.itemLabel}>{t("Country")}</div>
                <input
                  type="text"
                  value={addressFields.country}
                  onChange={(e) =>
                    handleAddressFieldChange("country", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
            </div>
            {hasAddressChanges() && (
              <div className={styles.addressActionContainer}>
                <button
                  className={styles.addressCancelButton}
                  onClick={handleAddressCancel}
                >
                  {t("Cancel")}
                </button>
                <button
                  className={styles.addressSaveButton}
                  onClick={handleAddressSave}
                >
                  {t("Save Changes")}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Actions */}
      {userType === "patient" && (
        <button className={styles.deleteButton} onClick={handleDelete}>
          {t("Delete My Account")}
        </button>
      )}
      <button className={styles.actionButton}>{t("Change password")}</button>
      <button className={styles.actionButton} onClick={handleSignOut}>
        {t("Sign out")}
      </button>

      {/* Gender Modal */}
      {showGenderModal && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalTitle}>{t("Select Gender")}</div>
            {GENDER_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={styles.modalOption}
                onClick={() => handleGenderSelect(opt.value)}
              >
                <span className={styles.modalOptionText}>
                  {opt.icon} {t(opt.label)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalTitle}>{t("Save Changes")}</div>
            <div style={{ marginBottom: 16 }}>
              {pendingField === "full_name"
                ? t("Are you sure you want to update your name?")
                : t("Are you sure you want to update your email address?")}
            </div>
            <button
              className={styles.addressCancelButton}
              onClick={handleCancel}
            >
              {t("Cancel")}
            </button>
            <button
              className={styles.addressSaveButton}
              onClick={handleConfirmSave}
            >
              {t("Confirm")}
            </button>
          </div>
        </div>
      )}
      {/* Error */}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Account;

// TODO: Add ability to edit name, gender, DOB, email, phone, address
