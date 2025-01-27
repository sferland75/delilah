"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
const lodash_1 = __importDefault(require("lodash"));
class BaseAgent {
    constructor(context, orderNumber, sectionName, requiredFields = []) {
        this.context = context;
        this.orderNumber = orderNumber;
        this.sectionName = sectionName;
        this.requiredFields = requiredFields;
        this.validationRules = new Map();
    }
    getField(data, path, defaultValue = undefined) {
        return lodash_1.default.get(data, path, defaultValue);
    }
    async validateData(data) {
        const errors = [];
        const warnings = [];
        // Check required fields
        for (const field of this.requiredFields) {
            const value = this.getField(data, field);
            if (value === undefined) {
                errors.push(`Missing required field: ${field}`);
            }
        }
        // Run validation rules
        for (const [field, rule] of this.validationRules.entries()) {
            const value = this.getField(data, field);
            if (value !== undefined && !rule(value)) {
                errors.push(`Invalid value for field: ${field}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    format(data) {
        return this.formatByDetailLevel(data, this.context.config?.detailLevel || 'standard');
    }
    getFormattedContent(data, level) {
        return this.formatByDetailLevel(data, level || 'standard');
    }
    formatByDetailLevel(data, level) {
        switch (level) {
            case 'brief':
                return this.formatBrief(data);
            case 'detailed':
                return this.formatDetailed(data);
            default:
                return this.formatStandard(data);
        }
    }
    getOrderNumber() {
        return this.orderNumber;
    }
    getSectionName() {
        return this.sectionName;
    }
    async generateSection(data) {
        const validationResult = await this.validateData(data);
        if (!validationResult.valid) {
            return {
                orderNumber: this.orderNumber,
                sectionName: this.sectionName,
                content: validationResult.errors.join('\n'),
                valid: false,
                title: this.sectionName,
                errors: validationResult.errors
            };
        }
        const processedData = await this.processData(data);
        return {
            orderNumber: this.orderNumber,
            sectionName: this.sectionName,
            content: this.getFormattedContent(processedData, this.context.config?.detailLevel),
            valid: processedData.valid,
            title: this.sectionName,
            errors: processedData.errors
        };
    }
}
exports.BaseAgent = BaseAgent;
