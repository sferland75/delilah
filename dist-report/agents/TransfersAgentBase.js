"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgentBase = void 0;
class TransfersAgentBase {
    constructor(context, orderNumber, sectionTitle, requiredFields) {
        this.validationRules = [];
        this.context = context;
        this.orderNumber = orderNumber;
        this.sectionTitle = sectionTitle;
        this.requiredFields = requiredFields;
        this.initializeValidationRules();
    }
    initializeValidationRules() {
        // Default implementation that can be overridden
    }
    getSectionKeys() {
        return [];
    }
    async validateData(data) {
        const errors = [];
        // Check required fields
        if (this.context.config.validateData) {
            for (const field of this.requiredFields) {
                if (!this.getField(data, field)) {
                    errors.push('Required fields missing');
                    break;
                }
            }
            // Run custom validation rules
            for (const { rule, errorMessage } of this.validationRules) {
                if (!rule(data)) {
                    errors.push(errorMessage);
                }
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    addValidationRule(rule, errorMessage) {
        this.validationRules.push({ rule, errorMessage });
    }
    getField(obj, path, defaultValue = undefined) {
        const value = path
            .split('.')
            .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
        return value !== undefined ? value : defaultValue;
    }
}
exports.TransfersAgentBase = TransfersAgentBase;
