export function slugify(str: string): string {
  // Remove all non-word characters and replace with a hyphen
  const slug = str
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  // Trim leading and trailing hyphens
  return slug.replace(/^-+|-+$/g, '');
}

export function onlyLettersAndSpaces(str: string): boolean {
  return /^[A-Za-z\s]*$/.test(str);
}
