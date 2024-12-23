export function generateDefaultSlug(userData: {
  businessName?: string;
  instagram?: string;
  firstName?: string;
}): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

  if (userData.businessName) {
    return slugify(userData.businessName);
  }

  if (userData.instagram) {
    return slugify(userData.instagram.replace('@', ''));
  }

  if (userData.firstName) {
    return `${slugify(userData.firstName)}-${dateStr}`;
  }

  return `user-${dateStr}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}