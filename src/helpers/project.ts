export const getProjectBadgeStyle = (developmentStatus: string) => {
  switch (developmentStatus) {
    case 'active':
      return {
        fontSize: 'sm',
        backgroundColor: 'green-100',
        darkBackgroundColor: 'green-800',
        textColor: 'green-800',
        darkTextColor: 'green-100',
      }
    case 'inactive':
      return {
        fontSize: 'sm',
        backgroundColor: 'yellow-100',
        darkBackgroundColor: 'yellow-800',
        textColor: 'yellow-800',
        darkTextColor: 'yellow-100',
      }
    case 'unmaintained':
      return {
        fontSize: 'sm',
        backgroundColor: 'red-100',
        darkBackgroundColor: 'red-800',
        textColor: 'red-800',
        darkTextColor: 'red-100',
      }
    default:
      return {}
  }
}
