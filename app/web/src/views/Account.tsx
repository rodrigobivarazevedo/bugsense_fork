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
            <span className={styles.profileIcon}>👤</span>
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
                <span className={styles.qrIcon}>📱</span>
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
            <button
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("full_name")}
            >
              ✏️
            </button>
          )}
        </div>

        {userType === "patient" && (
          <>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Gender")}</span>
                {editingField === "gender" ? (
                  <div className={styles.genderSelector}>
                    <button onClick={() => handleGenderSelect("male")}>
                      Male
                    </button>
                    <button onClick={() => handleGenderSelect("female")}>
                      Female
                    </button>
                    <button onClick={() => handleGenderSelect("other")}>
                      Other
                    </button>
                  </div>
                ) : (
                  <span className={styles.itemValue}>
                    {user?.gender || "-"}
                  </span>
                )}
              </div>
              <button
                className={styles.editIconBtnLight}
                onClick={() => handleEdit("gender")}
              >
                ✏️
              </button>
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
              <button
                className={styles.editIconBtnLight}
                onClick={() => handleEdit("dob")}
              >
                ✏️
              </button>
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
            <button
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("email")}
            >
              ✏️
            </button>
          )}
        </div>
        <div className={styles.itemRow}>
          <div className={styles.itemTextCol}>
            <span className={styles.itemLabel}>{t("Phone number")}</span>
            {renderEditableField("phone_number", user?.phone_number)}
          </div>
          {userType === "patient" && (
            <button
              className={styles.editIconBtnLight}
              onClick={() => handleEdit("phone_number")}
            >
              ✏️
            </button>
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
                <button
                  className={styles.editIconBtnLight}
                  onClick={() => setEditingField("street")}
                >
                  ✏️
                </button>
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
                <button
                  className={styles.editIconBtnLight}
                  onClick={() => setEditingField("city")}
                >
                  ✏️
                </button>
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
                <button
                  className={styles.editIconBtnLight}
                  onClick={() => setEditingField("postcode")}
                >
                  ✏️
                </button>
              )}
            </div>
            <div className={styles.itemRow}>
              <div className={styles.itemTextCol}>
                <span className={styles.itemLabel}>{t("Country")}</span>
                <span className={styles.itemValue}>
                  {addressFields.country || t("Select a country")}
                </span>
              </div>
              <button
                className={styles.editIconBtnLight}
                onClick={() => setEditingField("country")}
              >
                ✏️
              </button>
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
                      <button
                        className={styles.selectorButton}
                        onClick={() => {
                          setSelectedQuestionIndex(num);
                          setShowSecurityQuestionDropdown(
                            selectedQuestionIndex !== num ||
                              !showSecurityQuestionDropdown
                          );
                        }}
                      >
                        {securityQuestionsData[
                          `security_question_${num}` as keyof typeof securityQuestionsData
                        ] || t("Select Security Question")}
                        <span className={styles.selectorIcon}>▼</span>
                      </button>
                    </div>
                    {showSecurityQuestionDropdown &&
                      selectedQuestionIndex === num && (
                        <div className={styles.dropdownContainer}>
                          {getAvailableQuestionsForIndex(num).map(
                            (question, idx) => (
                              <button
                                key={idx}
                                className={styles.dropdownItem}
                                onClick={() =>
                                  handleSecurityQuestionSelect(question, num)
                                }
                              >
                                {question}
                              </button>
                            )
                          )}
                        </div>
                      )}
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
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleConfirmSave}>Save</button>
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
                Cancel
              </button>
              <button onClick={handleSecurityQuestionsSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
