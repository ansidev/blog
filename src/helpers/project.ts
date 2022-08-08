export const getProjectBadgeStyle = (developmentStatus: string) => {
  switch (developmentStatus) {
    case "active":
      return {
        backgroundColor: "green-100",
        darkBackgroundColor: "green-900",
        textColor: "green-900",
        darkTextColor: "green-100",
      }
    case "inactive":
      return {
        backgroundColor: "yellow-100",
        darkBackgroundColor: "yellow-900",
        textColor: "yellow-900",
        darkTextColor: "yellow-100",
      }
    case "unmaintained":
      return {
        backgroundColor: "red-100",
        darkBackgroundColor: "red-900",
        textColor: "red-900",
        darkTextColor: "red-100",
      }
    default:
      return {}
  }
}
