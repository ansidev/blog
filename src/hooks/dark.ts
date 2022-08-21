export const isDark = useDark({ storageKey: 'color-scheme' })

export const toggleDark = useToggle(isDark)
