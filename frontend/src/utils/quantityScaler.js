/**
 * Scales an ingredient quantity string based on the servings ratio.
 * Supports mixed fractions (e.g., "1 1/2"), simple fractions (e.g., "1/2"),
 * integers, decimals, and retains non-numeric descriptors (e.g., "to taste").
 * 
 * @param {string} quantityStr - Raw quantity string (e.g., "200g", "1 1/2 cups")
 * @param {number} baseServings - Original number of servings
 * @param {number} currentServings - Targeted number of servings
 * @returns {string} Scaled quantity string
 */
export const scaleQuantity = (quantityStr, baseServings, currentServings) => {
  if (!quantityStr || typeof quantityStr !== 'string') return '';
  
  const scaleFactor = currentServings / baseServings;
  if (scaleFactor === 1) return quantityStr;

  // Helper to format values into clean decimals or fractions
  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num.toString();
    
    // Round to 2 decimal places to avoid IEEE 754 precision issues (e.g., 0.3000000000004)
    const rounded = Math.round(num * 100) / 100;
    const integer = Math.floor(rounded);
    const decimal = Math.round((rounded - integer) * 100) / 100;

    // Map common cooking fractions to unicode characters for premium aesthetics
    if (decimal === 0.5) return integer > 0 ? `${integer} ½` : '½';
    if (decimal === 0.25) return integer > 0 ? `${integer} ¼` : '¼';
    if (decimal === 0.75) return integer > 0 ? `${integer} ¾` : '¾';
    if (decimal === 0.33 || decimal === 0.34) return integer > 0 ? `${integer} ⅓` : '⅓';
    if (decimal === 0.66 || decimal === 0.67) return integer > 0 ? `${integer} ⅔` : '⅔';

    return rounded.toString();
  };

  const trimmed = quantityStr.trim();

  // 1. Match mixed fractions: "1 1/2 cups", "2 3/4 tbsp"
  const mixedFractionRegex = /^(\d+)\s+(\d+)\/(\d+)(.*)$/;
  const mixedMatch = trimmed.match(mixedFractionRegex);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const numerator = parseInt(mixedMatch[2], 10);
    const denominator = parseInt(mixedMatch[3], 10);
    const suffix = mixedMatch[4];
    
    const value = (whole + (numerator / denominator)) * scaleFactor;
    return `${formatNumber(value)}${suffix}`;
  }

  // 2. Match simple fractions: "1/2 cup", "3/4 tsp"
  const fractionRegex = /^(\d+)\/(\d+)(.*)$/;
  const fractionMatch = trimmed.match(fractionRegex);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10);
    const denominator = parseInt(fractionMatch[2], 10);
    const suffix = fractionMatch[3];
    
    const value = (numerator / denominator) * scaleFactor;
    return `${formatNumber(value)}${suffix}`;
  }

  // 3. Match decimals/integers at the start: "2.5 liters", "200g", "4 large"
  const decimalRegex = /^(\d+(?:\.\d+)?)(.*)$/;
  const decimalMatch = trimmed.match(decimalRegex);
  if (decimalMatch) {
    const numberPart = parseFloat(decimalMatch[1]);
    const suffix = decimalMatch[2];
    
    const value = numberPart * scaleFactor;
    return `${formatNumber(value)}${suffix}`;
  }

  // Fallback for non-numeric quantities like "to taste" or "pinch"
  return quantityStr;
};
export default scaleQuantity;
