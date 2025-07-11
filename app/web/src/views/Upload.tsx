import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import jsQR from "jsqr";
import Api from "../api/client";
import styles from "./Upload.module.css";

const SCAN_TYPES = [
  {
    key: "qr-code",
    label: "Test Kit QR Code",
    desc: "Upload a photo of the QR code on your test kit",
  },
  {
    key: "test-strip",
    label: "Test Strip",
    desc: "Upload a photo of the test strip result",
  },
];

type ScanType = "qr-code" | "test-strip" | null;

const Upload: React.FC = () => {
  const { t } = useTranslation();
  const [selectedScanType, setSelectedScanType] = useState<ScanType>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [qrData, setQrData] = useState("");

  const handleSelectScanType = (type: ScanType) => {
    setSelectedScanType(type);
    setFile(null);
    setSuccessMsg("");
    setErrorMsg("");
    setQrData("");
  };

  const handleQrDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrData(e.target.value);
  };

  const drawBoundingBox = (location: any, image: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = "#FF3B58";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
    ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
    ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
    ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
    ctx.closePath();
    ctx.stroke();

    // Append canvas for visual aid (optional - can be removed or styled)
    document.getElementById("preview")?.appendChild(canvas);
  };

  const extractQrCodeFromImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas context not available.");
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            drawBoundingBox(code.location, img);
            resolve(code.data);
          } else {
            resolve(null);
          }
        };
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setSuccessMsg("");
      setErrorMsg("");

      // Clear previous preview
      const preview = document.getElementById("preview");
      if (preview) preview.innerHTML = "";

      if (selectedScanType === "qr-code") {
        const result = await extractQrCodeFromImage(uploadedFile);
        if (result) {
          setQrData(result);
          setSuccessMsg("QR code successfully extracted!");
        } else {
          setErrorMsg("Could not detect a QR code in the image.");
        }
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!selectedScanType || !file) {
      setErrorMsg("Please select a scan type and choose a file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const storage = "local"; // TODO: Change to 'gcs' when deployed to Google Cloud Storage
      const uploadUrl = qrData.trim()
        ? `upload/?qr_data=${encodeURIComponent(
            qrData.trim()
          )}&storage=${storage}`
        : `upload/?storage=${storage}`;

      const response = await Api.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        service: "ml",
      } as any);
      setSuccessMsg(response.data.message || "Upload successful!");
      setFile(null);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error ||
          err.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>What would you like to upload?</h2>
      <div className={styles.optionsRow}>
        {SCAN_TYPES.map((type) => (
          <button
            key={type.key}
            className={`${styles.optionCard} ${
              selectedScanType === type.key ? styles.selectedCard : ""
            }`}
            onClick={() => handleSelectScanType(type.key as ScanType)}
            type="button"
          >
            <div className={styles.optionTitle}>{type.label}</div>
            <div className={styles.optionDesc}>{type.desc}</div>
          </button>
        ))}
      </div>
      {selectedScanType && (
        <form className={styles.uploadForm} onSubmit={handleUpload}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              {selectedScanType === "qr-code"
                ? "QR Code Value (optional)"
                : "Kit ID (optional)"}
              <input
                type="text"
                value={qrData}
                onChange={handleQrDataChange}
                className={styles.textInput}
                placeholder={
                  selectedScanType === "qr-code"
                    ? "Enter QR code value (optional)"
                    : "Enter kit ID (optional)"
                }
              />
            </label>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                required
              />
            </label>
          </div>
          <div
            id="preview"
            style={{ marginTop: "1rem", textAlign: "center" }}
          />
          {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
          {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
          <button
            type="submit"
            className={styles.uploadButton}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Upload;
