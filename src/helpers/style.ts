export const getRandomColor = () => {
  const colors = [
    'red', 'orange', 'yellow',
    'green', 'teal', 'blue',
    'indigo', 'purple', 'pink',
  ]

  return colors.sort(() => 0.5 - Math.random())[0]
}

export const getDismissableBadgeStyle = (color: string) => {
  return {
    backgroundColor: `${color}-100`,
    darkBackgroundColor: `${color}-800`,
    textColor: `${color}-800`,
    darkTextColor: `${color}-100`,
    buttonHoverBackgroundColor: `${color}-200`,
    buttonDarkHoverBackgroundColor: `${color}-900`,
  }
}

export const getRandomDismissableBadgeStyle = () => getDismissableBadgeStyle(getRandomColor())
