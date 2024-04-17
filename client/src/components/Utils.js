export const formatMoney = (str) => {
  str = String(str)
  const digits = str.replace(/\D/g, "").split("")

  const commasCount = Math.floor((digits.length - 1) / 3)

  for (let i = 1; i <= commasCount; i++) {
    const insertIndex = digits.length - i * 3
    digits.splice(insertIndex, 0, ".")
  }

  return "$" + digits.join("")
}
