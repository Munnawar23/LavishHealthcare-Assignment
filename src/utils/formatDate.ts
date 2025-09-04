/**
 * Formats a date string as "Wed, Sep 4"
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
