export const getTranslatedTestStatus = (status: string): string => {
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
};
