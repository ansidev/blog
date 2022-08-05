import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({ storageKey: 'color-scheme' })

export const toggleDark = useToggle(isDark)
