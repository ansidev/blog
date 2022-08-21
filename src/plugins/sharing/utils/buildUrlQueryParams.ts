export const buildUrlQueryParams = (params: any) => {
  const esc = encodeURIComponent
  const paramKeys = Object.keys(params)
  if (paramKeys.length < 1)
    return ''

  const s = paramKeys
    .map((key: string) => `${esc(key)}=${esc(params[key])}`)
    .join('&')

  return `?${s}`
}
