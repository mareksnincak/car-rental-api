/**
 * See https://www.postgresql.org/docs/current/textsearch-intro.html#TEXTSEARCH-MATCHING
 * Creates partially matching ts query from provided string, works with multi word phrases.
 */
export const stringToPartialTsQuery = (query?: string) => {
  const modifiedQuery = query?.trim();
  if (!modifiedQuery) {
    return '';
  }

  // We use JS functions instead of regex as it works properly even for queries with special characters
  return modifiedQuery
    .replace(/[:*&|!()]+/g, '')
    .split(/\s+/)
    .map((term) => `${term}:*`)
    .join(' & ');
};

export default {
  stringToPartialTsQuery,
};
