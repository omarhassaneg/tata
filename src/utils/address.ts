export function extractCountryFromAddress(address: string): string {
  // Common formats for US addresses
  if (/United States|USA|U\.S\.A\.|US$/i.test(address)) {
    return 'US';
  }
  
  // Look for state abbreviations at the end of the address
  const usStatePattern = /[^A-Z]([A-Z]{2})\s*(?:,\s*(?:USA?|United States)?)?\s*$/;
  const match = address.match(usStatePattern);
  
  if (match && isUSState(match[1])) {
    return 'US';
  }
  
  // Default to non-US if no US patterns are found
  return 'OTHER';
}

// List of US state abbreviations
const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC'
]);

function isUSState(state: string): boolean {
  return US_STATES.has(state.toUpperCase());
}