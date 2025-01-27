"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSection = exports.sanitizeText = exports.frequencyScale = exports.severityScale = exports.formatDate = exports.validateData = void 0;
const validateData = (data, requiredFields) => {
    if (!data)
        return false;
    return requiredFields.every(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], data);
        return value !== undefined && value !== null;
    });
};
exports.validateData = validateData;
const formatDate = (date) => {
    if (!date)
        return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
exports.formatDate = formatDate;
exports.severityScale = {
    None: 0,
    Mild: 1,
    Moderate: 2,
    Severe: 3,
    'Very Severe': 4
};
exports.frequencyScale = {
    Rarely: 1,
    Sometimes: 2,
    Often: 3,
    'Most of the time': 4,
    Constantly: 5
};
const sanitizeText = (text) => {
    if (!text)
        return '';
    // Remove any potentially unsafe content
    return text
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim();
};
exports.sanitizeText = sanitizeText;
const createSection = (title, content, order, isValid = true, errors = [], warnings = []) => ({
    title,
    content,
    order,
    isValid,
    errors,
    warnings
});
exports.createSection = createSection;
