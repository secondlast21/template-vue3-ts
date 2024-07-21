export function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase())
}


