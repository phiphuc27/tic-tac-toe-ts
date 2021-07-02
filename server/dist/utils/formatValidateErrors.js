"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidateErrors = void 0;
const formatValidateErrors = (err) => {
    const error = {
        field: err.path || '',
        message: err.message,
    };
    return error;
};
exports.formatValidateErrors = formatValidateErrors;
//# sourceMappingURL=formatValidateErrors.js.map