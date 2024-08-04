// ==================================================================
// n = the number of character to shorten the text
// ==================================================================
export const ShortenText = (text, n) => {
  if (text.length > n) {
    const shoretenedText = text.slice(0, n).concat('...');
    return shoretenedText;
  }
  return text;
};
