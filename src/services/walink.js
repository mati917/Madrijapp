export function walink(number) {
  let clean = String(number).replace(/\D/g, '')
  return 'https://wa.me/54' + clean
}
