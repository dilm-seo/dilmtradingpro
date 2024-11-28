import he from 'he';

export function sanitizeHtml(html: string): string {
  // Decode HTML entities
  const decodedHtml = he.decode(html);
  
  // Remove CDATA sections
  const withoutCDATA = decodedHtml.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  // Remove HTML tags except for basic formatting
  const allowedTags = ['p', 'b', 'i', 'strong', 'em'];
  const stripped = allowedTags.reduce((acc, tag) => {
    const regex = new RegExp(`<\/?${tag}>`, 'gi');
    return acc.replace(regex, '');
  }, withoutCDATA);
  
  return stripped.trim();
}