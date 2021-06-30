"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidateErrors = void 0;
const formatValidateErrors = (err) => {
    const errors = [];
    err.inner.forEach((element) => {
        errors.push({ field: element.path || '', message: element.message });
    });
    return errors;
};
exports.formatValidateErrors = formatValidateErrors;
//# sourceMappingURL=formatValidateErrors.js.map