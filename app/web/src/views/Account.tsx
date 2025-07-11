import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Api from "../api/client";
import styles from "./Account.module.css";
import { formatDate } from "../utils/DateTimeFormatter";
import {
  securityQuestions,
  SecurityQuestionsData,
  validateSecurityQuestionsForUpdate,
  hasSecurityQuestionsChanges as hasSecurityQuestionsChangesUtil,
} from "../utils/SecurityQuestions";
import validateEmail from "../utils/ValidateEmail";
import { validatePassword } from "../utils/ValidatePassword";
import {
  AccountCircle,
  Edit,
  QrCode,
  ArrowDropDown,
  Delete,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import countryList from "../utils/countryList";
import ReactDOM from "react-dom";
import ChangePasswordModal from "../components/modal/ChangePasswordModal";

interface User {
  id: number;
  email: string;
  full_name: string;
  gender: string;
  dob: string;
  phone_number: string;
  date_joined: string;
  institution_name?: string;
  doctor_id?: string;
  street?: string;
  city?: string;
  postcode?: string;
  country?: string;
  security_question_1?: string;
  security_answer_1?: string;
  security_question_2?: string;
  security_answer_2?: string;
  security_question_3?: string;
  security_answer_3?: string;
}

const Account: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>("patient");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for editable fields
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [pendingValue, setPendingValue] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [
    showSecurityQuestionsConfirmationModal,
    setShowSecurityQuestionsConfirmationModal,
  ] = useState(false);

  // Address editing states
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

  // Security questions editing states
  const [securityQuestionsData, setSecurityQuestionsData] =
    useState<SecurityQuestionsData>({
      security_question_1: "",
      security_answer_1: "",
      security_question_2: "",
      security_answer_2: "",
      security_question_3: "",
      security_answer_3: "",
    });
  const [originalSecurityQuestions, setOriginalSecurityQuestions] =
    useState<SecurityQuestionsData>({
      security_question_1: "",
      security_answer_1: "",
      security_question_2: "",
      security_answer_2: "",
      security_question_3: "",
      security_answer_3: "",
    });
  const [showSecurityQuestionDropdown, setShowSecurityQuestionDropdown] =
    useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [securityQuestionsEditMode, setSecurityQuestionsEditMode] =
    useState(false);

  const availableQuestions = securityQuestions(t);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get("users/me/");
      const userData = response.data;
      setUser(userData);

      // Set address fields
      const addressData = {
        street: userData.street || "",
        city: userData.city || "",
        postcode: userData.postcode || "",
        country: userData.country || "",
      };
      setAddressFields(addressData);
      setOriginalAddressFields(addressData);

      // Set security questions
      const securityData = {
        security_question_1: userData.security_question_1 || "",
        security_answer_1: userData.security_answer_1 || "",
        security_question_2: userData.security_question_2 || "",
        security_answer_2: userData.security_answer_2 || "",
        security_question_3: userData.security_question_3 || "",
        security_answer_3: userData.security_answer_3 || "",
      };
      setSecurityQuestionsData(securityData);
      setOriginalSecurityQuestions(securityData);

      // Set user type
      const type = localStorage.getItem("userType") || "patient";
      setUserType(type);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        navigate("/login");
      } else {
        console.error("Could not load profile", err);
        setError("Could not load profile");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEdit = (field: string) => {
    setEditingField(field);
    const fieldValue = user?.[field as keyof typeof user];
    setTempValue(typeof fieldValue === "string" ? fieldValue : "");
  };

  const handleSave = async () => {
    if (editingField === "full_name" || editingField === "email") {
      setPendingValue(tempValue);
      setShowConfirmationModal(true);
    } else if (editingField && user) {
      try {
        const response = await Api.put("users/me/", {
          [editingField]: tempValue,
        });
        setUser(response.data);
        setEditingField(null);
      } catch (error) {
        console.error("Error updating field:", error);
        alert("Failed to update field. Please try again.");
      }
    }
  };

  const handleConfirmSave = async () => {
    if ((editingField === "full_name" || editingField === "email") && user) {
      try {
        const response = await Api.put("users/me/", {
          [editingField]: pendingValue,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error updating field:", error);
        alert("Failed to update field. Please try again.");
      }
    }
    setEditingField(null);
    setShowConfirmationModal(false);
    setPendingValue("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setShowConfirmationModal(false);
    setPendingValue("");
  };

  const handlePhoneChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9\s-]/g, "");
    setTempValue(cleanedText);
  };

  const handleGenderSelect = async (gender: string) => {
    if (user) {
      try {
        const response = await Api.put("users/me/", {
          gender,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error updating gender:", error);
        alert("Failed to update gender. Please try again.");
      }
    }
    setEditingField(null);
  };

  const handleDateChange = async (date: string) => {
    if (user) {
      try {
        const response = await Api.put("users/me/", {
          dob: date,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error updating date of birth:", error);
        alert("Failed to update date of birth. Please try again.");
      }
    }
    setEditingField(null);
  };

  // Address field handlers
  const handleAddressFieldChange = (field: string, value: string) => {
    setAddressFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressSave = async () => {
    if (user) {
      try {
        const response = await Api.put("users/me/", addressFields);
        setUser(response.data);
        setOriginalAddressFields(addressFields);
        alert("Address updated successfully");
      } catch (error) {
        console.error("Error updating address:", error);
        alert("Failed to update address. Please try again.");
      }
    }
  };

  const handleAddressCancel = () => {
    setAddressFields(originalAddressFields);
    setEditingField(null);
  };

  const hasAddressChanges = () => {
    return (
      addressFields.street !== originalAddressFields.street ||
      addressFields.city !== originalAddressFields.city ||
      addressFields.postcode !== originalAddressFields.postcode ||
      addressFields.country !== originalAddressFields.country
    );
  };

  // Security questions handlers
  const handleSecurityQuestionChange = (
    questionNumber: number,
    field: "question" | "answer",
    value: string
  ) => {
    setSecurityQuestionsData((prev) => ({
      ...prev,
      [`security_${field}_${questionNumber}`]: value,
    }));
  };

  const handleSecurityQuestionSelect = (
    question: string,
    questionNumber: number
  ) => {
    handleSecurityQuestionChange(questionNumber, "question", question);
    setShowSecurityQuestionDropdown(false);
    setSelectedQuestionIndex(null);
  };

  const getAvailableQuestionsForIndex = (questionNumber: number) => {
    const usedQuestions = [
      securityQuestionsData.security_question_1,
      securityQuestionsData.security_question_2,
      securityQuestionsData.security_question_3,
    ].filter((q, index) => index !== questionNumber - 1 && q);
    return availableQuestions.filter((q) => !usedQuestions.includes(q));
  };

  const handleSecurityQuestionsSave = async () => {
    if (
      !validateSecurityQuestionsForUpdate(
        securityQuestionsData,
        originalSecurityQuestions
      )
    ) {
      alert("Please answer all security questions");
      return;
    }

    try {
      const response = await Api.put("users/me/", securityQuestionsData);
      setUser(response.data);
      setOriginalSecurityQuestions(securityQuestionsData);
      setSecurityQuestionsEditMode(false);
      alert("Security questions updated successfully");
    } catch (error) {
      console.error("Error updating security questions:", error);
      alert("Failed to update security questions. Please try again.");
    }
  };

  const handleSecurityQuestionsCancel = () => {
    setSecurityQuestionsData(originalSecurityQuestions);
    setSecurityQuestionsEditMode(false);
    setShowSecurityQuestionDropdown(false);
    setSelectedQuestionIndex(null);
  };

  const hasSecurityQuestionsChanges = () => {
    return hasSecurityQuestionsChangesUtil(
      securityQuestionsData,
      originalSecurityQuestions
    );
  };

  const canSaveSecurityQuestions = () => {
    return (
      securityQuestionsData.security_question_1 &&
      securityQuestionsData.security_answer_1 &&
      securityQuestionsData.security_question_2 &&
      securityQuestionsData.security_answer_2 &&
      securityQuestionsData.security_question_3 &&
      securityQuestionsData.security_answer_3
    );
  };

  const renderEditableField = (field: string, value: string) => {
    if (editingField === field) {
      return (
        <input
          type={field === "email" ? "email" : "text"}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => e.key === "Enter" && handleSave()}
          className={styles.editableInput}
          autoFocus
        />
      );
    }
    return <span className={styles.itemValue}>{value || "-"}</span>;
  };

  const handleSignOut = async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        await Api.post("logout/", { refresh });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      Api.delete("users/me/")
        .then(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("userType");
          navigate("/login");
        })
        .catch((err: any) => {
          console.error("Delete failed", err);
          alert("Could not delete account. Please try again.");
        });
    }
  };

  const countryInputRef = React.useRef<HTMLInputElement | null>(null);
  const countryDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (editingField === "country" && countryInputRef.current) {
      const rect = countryInputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [editingField]);

  useEffect(() => {
    if (editingField !== "country") return;
    function updateDropdownPos() {
      if (countryInputRef.current) {
        const rect = countryInputRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }
    updateDropdownPos();
    window.addEventListener("scroll", updateDropdownPos, true);
    window.addEventListener("resize", updateDropdownPos);
    return () => {
      window.removeEventListener("scroll", updateDropdownPos, true);
      window.removeEventListener("resize", updateDropdownPos);
    };
  }, [editingField]);

  useEffect(() => {
    if (editingField !== "country") return;
    function handleClick(e: MouseEvent) {
      const input = countryInputRef.current;
      const dropdown = countryDropdownRef.current;
      if (
        input &&
        !input.contains(e.target as Node) &&
        dropdown &&
        !dropdown.contains(e.target as Node)
      ) {
        setEditingField(null);
        setTempValue("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [editingField]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || "Failed to load user data"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileCardContent}>
          <div className={styles.profileImage}>
            <AccountCircle fontSize="large" sx={{ color: "var(--white)" }} />
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.userName}>{user?.full_name}</h2>
            <p className={styles.dateJoined}>Joined {user?.date_joined}</p>

            <div className={styles.userTypeIndicator}>
              <span className={styles.userTypeText}>
                {userType === "doctor" ? t("Medical Personnel") : t("Patient")}
              </span>
            </div>

            {userType === "doctor" && user?.institution_name && (
              <div className={styles.institutionInfo}>
                <span className={styles.institutionLabel}>
                  {t("Institution")}
                </span>
                <span className={styles.institutionName}>
                  {user.institution_name}
                </span>
              </div>
            )}

            {userType === "doctor" && user?.doctor_id && (
              <div className={styles.doctorIdInfo}>
                <span className={styles.doctorIdLabel}>{t("Doctor ID")}</span>
                <span className={styles.doctorIdValue}>{user.doctor_id}</span>
              </div>
            )}

            {userType === "patient" && (
              <div className={styles.qrButton}>
                <QrCode fontSize="small" sx={{ color: "var(--white)" }} />
                <span className={styles.qrButtonText}>
                  {t("View my QR code")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>{t("Account Details")}</h3>
      <div className={styles.lightCard}>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <span className={styles.itemLabel}>{t("Name")}</span>
            {renderEditableField("full_name", user?.full_name)}
          </div>
          {userType === "patient" && (
            <IconButton
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("full_name")}
              size="small"
              sx={{ color: "var(--primary)" }}
            >
              <Edit fontSize="inherit" />
            </IconButton>
          )}
        </div>

        {userType === "patient" && (
          <>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Gender")}</span>
                {editingField === "gender" ? (
                  <div className={styles.genderSelector}>
                    <button onClick={() => handleGenderSelect("Male")}>
                      Male
                    </button>
                    <button onClick={() => handleGenderSelect("Female")}>
                      Female
                    </button>
                    <button onClick={() => handleGenderSelect("Other")}>
                      Other
                    </button>
                  </div>
                ) : (
                  <span className={styles.itemValue}>
                    {user?.gender || "-"}
                  </span>
                )}
              </div>
              <IconButton
                className={styles.editIconBtnLight}
                onClick={() => handleEdit("gender")}
                size="small"
                sx={{ color: "var(--primary)" }}
              >
                <Edit fontSize="inherit" />
              </IconButton>
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Date of birth")}</span>
                {editingField === "dob" ? (
                  <input
                    type="date"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={() => handleDateChange(tempValue)}
                    className={styles.editableInput}
                    autoFocus
                  />
                ) : (
                  <span className={styles.itemValue}>
                    {user?.dob ? formatDate(user.dob, "long", true) : "-"}
                  </span>
                )}
              </div>
              <IconButton
                className={styles.editIconBtnLight}
                onClick={() => handleEdit("dob")}
                size="small"
                sx={{ color: "var(--primary)" }}
              >
                <Edit fontSize="inherit" />
              </IconButton>
            </div>
          </>
        )}
      </div>

      <h3 className={styles.sectionTitle}>{t("Contact Data")}</h3>
      <div className={styles.lightCard}>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <span className={styles.itemLabel}>{t("Email address")}</span>
            {renderEditableField("email", user?.email)}
          </div>
          {userType === "patient" && (
            <IconButton
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("email")}
              size="small"
              sx={{ color: "var(--primary)" }}
            >
              <Edit fontSize="inherit" />
            </IconButton>
          )}
        </div>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <span className={styles.itemLabel}>{t("Phone number")}</span>
            {renderEditableField("phone_number", user?.phone_number)}
          </div>
          {userType === "patient" && (
            <IconButton
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("phone_number")}
              size="small"
              sx={{ color: "var(--primary)" }}
            >
              <Edit fontSize="inherit" />
            </IconButton>
          )}
        </div>
      </div>

      {userType === "patient" && (
        <>
          <h3 className={styles.sectionTitle}>{t("Address")}</h3>
          <div className={styles.lightCard}>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Street")}</span>
                {editingField === "street" ? (
                  <input
                    type="text"
                    value={addressFields.street}
                    onChange={(e) =>
                      handleAddressFieldChange("street", e.target.value)
                    }
                    placeholder={t("Enter street address")}
                    className={styles.editableInput}
                    autoFocus
                    onBlur={() => setEditingField(null)}
                  />
                ) : (
                  <span className={styles.itemValue}>
                    {addressFields.street}
                  </span>
                )}
              </div>
              {editingField !== "street" && (
                <IconButton
                  className={styles.editIconBtnLight}
                  onClick={() => setEditingField("street")}
                  size="small"
                  sx={{ color: "var(--primary)" }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
              )}
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("City")}</span>
                {editingField === "city" ? (
                  <input
                    type="text"
                    value={addressFields.city}
                    onChange={(e) =>
                      handleAddressFieldChange("city", e.target.value)
                    }
                    placeholder={t("Enter city")}
                    className={styles.editableInput}
                    autoFocus
                    onBlur={() => setEditingField(null)}
                  />
                ) : (
                  <span className={styles.itemValue}>{addressFields.city}</span>
                )}
              </div>
              {editingField !== "city" && (
                <IconButton
                  className={styles.editIconBtnLight}
                  onClick={() => setEditingField("city")}
                  size="small"
                  sx={{ color: "var(--primary)" }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
              )}
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Postcode")}</span>
                {editingField === "postcode" ? (
                  <input
                    type="text"
                    value={addressFields.postcode}
                    onChange={(e) =>
                      handleAddressFieldChange("postcode", e.target.value)
                    }
                    placeholder={t("Enter postcode")}
                    className={styles.editableInput}
                    autoFocus
                    onBlur={() => setEditingField(null)}
                  />
                ) : (
                  <span className={styles.itemValue}>
                    {addressFields.postcode}
                  </span>
                )}
              </div>
              {editingField !== "postcode" && (
                <IconButton
                  className={styles.editIconBtnLight}
                  onClick={() => setEditingField("postcode")}
                  size="small"
                  sx={{ color: "var(--primary)" }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
              )}
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Country")}</span>
                {editingField === "country" ? (
                  <div
                    className={styles.countryDropdownWrapper}
                    style={{ position: "relative" }}
                  >
                    <input
                      ref={countryInputRef}
                      type="text"
                      placeholder={t("Search country")}
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className={styles.countrySearchInput}
                      autoFocus
                    />
                    {ReactDOM.createPortal(
                      <div
                        ref={countryDropdownRef}
                        className={styles.countryDropdownList}
                        style={{
                          position: "absolute",
                          top: dropdownPos.top,
                          left: dropdownPos.left,
                          width: dropdownPos.width,
                          border: "2px solid red", // DEBUG: Remove after confirming overlay
                          background: "#fff",
                          zIndex: 99999,
                        }}
                      >
                        {countryList
                          .filter((c: string) =>
                            c.toLowerCase().includes(tempValue.toLowerCase())
                          )
                          .slice(0, 10)
                          .map((country: string, idx: number) => (
                            <div
                              key={country}
                              className={styles.countryDropdownItem}
                              onClick={() => {
                                handleAddressFieldChange("country", country);
                                setEditingField(null);
                                setTempValue("");
                              }}
                            >
                              {country}
                            </div>
                          ))}
                      </div>,
                      document.body
                    )}
                  </div>
                ) : (
                  <span className={styles.itemValue}>
                    {addressFields.country || t("Select a country")}
                  </span>
                )}
              </div>
              {editingField !== "country" && (
                <IconButton
                  className={styles.editIconBtnLight}
                  onClick={() => {
                    setEditingField("country");
                    setTempValue("");
                  }}
                  size="small"
                  sx={{ color: "var(--primary)" }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
              )}
            </div>
            {hasAddressChanges() && (
              <div className={styles.accountActionContainer}>
                <button
                  className={styles.accountCancelButton}
                  onClick={handleAddressCancel}
                >
                  {t("Cancel")}
                </button>
                <button
                  className={styles.accountSaveButton}
                  onClick={handleAddressSave}
                >
                  {t("Save Changes")}
                </button>
              </div>
            )}
          </div>

          <h3 className={styles.sectionTitle}>{t("Security Questions")}</h3>
          <div className={styles.lightCard}>
            {securityQuestionsEditMode ? (
              <>
                {[1, 2, 3].map((num) => (
                  <div
                    key={`qna${num}`}
                    className={styles.securityQuestionBlock}
                  >
                    <span className={styles.itemLabel}>
                      {t("Question")} {num}
                    </span>
                    <div className={styles.selectorRow}>
                      <Select
                        value={
                          securityQuestionsData[
                            `security_question_${num}` as keyof typeof securityQuestionsData
                          ] || ""
                        }
                        onChange={(e) =>
                          handleSecurityQuestionSelect(
                            e.target.value as string,
                            num
                          )
                        }
                        displayEmpty
                        fullWidth
                        size="small"
                        sx={{ width: "100%", background: "var(--white)" }}
                      >
                        <MenuItem value="">
                          {t("Select Security Question")}
                        </MenuItem>
                        {getAvailableQuestionsForIndex(num).map(
                          (question, idx) => (
                            <MenuItem key={idx} value={question}>
                              {question}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </div>
                    <input
                      type="text"
                      value={
                        securityQuestionsData[
                          `security_answer_${num}` as keyof typeof securityQuestionsData
                        ]
                      }
                      onChange={(e) =>
                        handleSecurityQuestionChange(
                          num,
                          "answer",
                          e.target.value
                        )
                      }
                      placeholder={t("Enter your answer")}
                      className={styles.answerInput}
                    />
                  </div>
                ))}
                {hasSecurityQuestionsChanges() && (
                  <div className={styles.accountActionContainer}>
                    <button
                      className={styles.accountCancelButton}
                      onClick={() => {
                        setSecurityQuestionsEditMode(false);
                        handleSecurityQuestionsCancel();
                      }}
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      className={styles.accountSaveButton}
                      disabled={
                        !(
                          hasSecurityQuestionsChanges() &&
                          canSaveSecurityQuestions()
                        )
                      }
                      onClick={() =>
                        setShowSecurityQuestionsConfirmationModal(true)
                      }
                    >
                      {t("Save Changes")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {securityQuestionsData.security_question_1 ||
                securityQuestionsData.security_question_2 ||
                securityQuestionsData.security_question_3 ? (
                  <>
                    {[1, 2, 3].map((num) =>
                      securityQuestionsData[
                        `security_question_${num}` as keyof typeof securityQuestionsData
                      ] ? (
                        <div key={`viewq${num}`} className={styles.itemRow}>
                          <div className={styles.itemTextCol}>
                            <span className={styles.itemLabel}>
                              {t("Question")} {num}
                            </span>
                            <span className={styles.itemValue}>
                              {
                                securityQuestionsData[
                                  `security_question_${num}` as keyof typeof securityQuestionsData
                                ]
                              }
                            </span>
                          </div>
                        </div>
                      ) : null
                    )}
                    <button
                      className={styles.actionButton}
                      onClick={() => setSecurityQuestionsEditMode(true)}
                    >
                      {t("Update Security Questions")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.itemRow}>
                      <div className={styles.itemTextCol}>
                        <span className={styles.itemLabel}>
                          {t(
                            "You have not set any security questions. Please set security questions to make sure you can reset your password."
                          )}
                        </span>
                      </div>
                    </div>
                    <button
                      className={styles.actionButton}
                      onClick={() => setSecurityQuestionsEditMode(true)}
                    >
                      {t("Add Security Questions")}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}

      {userType === "patient" && (
        <button className={styles.deleteButton} onClick={handleDelete}>
          <Delete
            fontSize="inherit"
            sx={{ verticalAlign: "middle", marginRight: 8 }}
          />
          {t("Delete My Account")}
        </button>
      )}

      <button
        className={styles.actionButton}
        onClick={() => setShowChangePasswordModal(true)}
      >
        {t("Change password")}
      </button>
      <button className={styles.actionButton} onClick={handleSignOut}>
        {t("Sign out")}
      </button>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Save Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className={styles.modalActions}>
              <button onClick={handleCancel}>
                <Cancel
                  fontSize="small"
                  sx={{ color: "var(--themeGray)", marginRight: 4 }}
                />{" "}
                Cancel
              </button>
              <button onClick={handleConfirmSave}>
                <CheckCircle
                  fontSize="small"
                  sx={{ color: "var(--primary)", marginRight: 4 }}
                />{" "}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Questions Confirmation Modal */}
      {showSecurityQuestionsConfirmationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Save Security Questions</h3>
            <p>Are you sure you want to save these security questions?</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowSecurityQuestionsConfirmationModal(false)}
              >
                <Cancel
                  fontSize="small"
                  sx={{ color: "var(--themeGray)", marginRight: 4 }}
                />{" "}
                Cancel
              </button>
              <button onClick={handleSecurityQuestionsSave}>
                <CheckCircle
                  fontSize="small"
                  sx={{ color: "var(--primary)", marginRight: 4 }}
                />{" "}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
};

export default Account;
