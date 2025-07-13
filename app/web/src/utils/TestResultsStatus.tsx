export const getTranslatedTestStatus = (
  status: string,
  t?: (key: string) => string
): string => {
  if (!t) {
    // Fallback without translation
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
        return status || "Unknown";
    }
  }

  const statusMap: { [key: string]: string } = {
    ongoing: t("test_status_ongoing"),
    preliminary_assessment: t("test_status_preliminary_assessment"),
    ready: t("test_status_ready"),
    closed: t("test_status_closed"),
    completed: t("test_status_completed"),
  };
  return statusMap[status] || status;
};
