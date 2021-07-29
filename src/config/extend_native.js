import numeral from 'numeral';
/**
 * BE CAREFUL using this file.
 * There is risk introduced by extending native components.
 * All extensions must have eslint exceptions annotated!
 */

// NOTE: This is to avoid having to wrap conversions and other things with toFixed and
// parseFloat calls
if (!Number.prototype.fixFloat) {
  Number.prototype.fixFloat = function fixFloat(digits) {
    return parseFloat(this.toFixed(digits));
  };
}

if (!Number.prototype.formatNumeral) {
  Number.prototype.formatNumeral = function formatNumeral(fmt) {
    return numeral(this).format(fmt);
  };
}
