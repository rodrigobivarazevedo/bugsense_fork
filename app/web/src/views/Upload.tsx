import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import jsQR from "jsqr";
import Api from "../api/client";
import styles from "./Upload.module.css";
import { authUtils } from "../utils/auth";

const SCAN_TYPES = [
  {
    key: "qr-code",
    label: "test_kit_qr_code",
    desc: "test_kit_qr_code_desc",
  },
  {
    key: "test-strip",
    label: "test_strip",
    desc: "test_strip_desc",
  },
];

type ScanType = "qr-code" | "test-strip" | null;

const Upload: React.FC = () => {
  const { t } = useTranslation();
  const translate = (key: string): string => t(key) || key;
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
    const previewWidth = 200;
    const scale = previewWidth / image.width;
    const previewHeight = image.height * scale;

    const canvas = document.createElement("canvas");
    canvas.width = previewWidth;
    canvas.height = previewHeight;
    canvas.style.width = `${previewWidth}px`;
    canvas.style.height = `${previewHeight}px`;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, 0, 0, previewWidth, previewHeight);
    ctx.strokeStyle = "#FF3B58";
    ctx.lineWidth = 2;

    const scalePoint = (pt: { x: number; y: number }) => ({
      x: pt.x * scale,
      y: pt.y * scale,
    });
    const tl = scalePoint(location.topLeftCorner);
    const tr = scalePoint(location.topRightCorner);
    const br = scalePoint(location.bottomRightCorner);
    const bl = scalePoint(location.bottomLeftCorner);

    ctx.beginPath();
    ctx.moveTo(tl.x, tl.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(bl.x, bl.y);
    ctx.closePath();
    ctx.stroke();

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

      const preview = document.getElementById("preview");
      if (preview) preview.innerHTML = "";

      if (selectedScanType === "qr-code") {
        const result = await extractQrCodeFromImage(uploadedFile);
        if (result) {
          setQrData(result);
          setSuccessMsg(translate("qr_code_successfully_extracted"));
        } else {
          setErrorMsg(translate("could_not_detect_qr_code"));
        }
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!selectedScanType || !file) {
      setErrorMsg(translate("please_select_scan_type_and_file"));
      return;
    }
    const user = authUtils.getUser();
    if (!user) {
      setErrorMsg("User not found. Please log in again.");
      return;
    }
    try {
      try {
        await Api.post("qr-codes/", { user_id: user.id, qr_data: qrData });
      } catch (err: any) {
        if (
          err.response?.data?.detail &&
          err.response.data.detail.toLowerCase().includes("already exists")
        ) {
        } else {
          setErrorMsg(
            err.response?.data?.detail ||
              err.message ||
              "Failed to register kit."
          );
          return;
        }
      }

      const formData = new FormData();
      formData.append("image", file);
      const storage = "local";
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
      <h2 className={styles.heading}>
        {translate("what_would_you_like_to_upload")}
      </h2>
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
            <div className={styles.optionTitle}>{translate(type.label)}</div>
            <div className={styles.optionDesc}>{translate(type.desc)}</div>
          </button>
        ))}
      </div>
      {selectedScanType && (
        <form className={styles.uploadForm} onSubmit={handleUpload}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              {selectedScanType === "qr-code"
                ? translate("qr_code_value")
                : translate("kit_id")}
              <input
                type="text"
                value={qrData}
                onChange={handleQrDataChange}
                className={styles.textInput}
                placeholder={
                  selectedScanType === "qr-code"
                    ? translate("enter_qr_code_value")
                    : translate("enter_kit_id_before_uploading")
                }
              />
            </label>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              {translate("upload_image")}
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
            {uploading ? translate("uploading") : translate("upload")}
          </button>
        </form>
      )}
    </div>
  );
};

export default Upload;
