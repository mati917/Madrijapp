export function formatDate(dateString, formatting) {
  // crear la fecha usando partes en vez de new Date(string)
  const [year, month, day] = dateString.split('-')
  const date = new Date(year, month - 1, day) // mes 0-indexado

  switch (formatting) {
    case 'DD/MM/YYYY':
      return new Intl.DateTimeFormat('es-AR').format(date)
    case 'YYYY-MM-DD':
      return new Intl.DateTimeFormat('en-CA').format(date)
    default:
      return date.toISOString().split('T')[0]
  }
}
