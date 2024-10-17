/**
 * isArrayLength;
 * @param {Array} [arr]
 * @param {Number} [len]
 * @returns {Boolean} true if arr length > 0;
 */
export function isArrayLength(arr, len=0) {
  return Array.isArray(arr) && arr.length > len;
}