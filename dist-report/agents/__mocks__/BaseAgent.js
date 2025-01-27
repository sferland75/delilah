"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAgent = void 0;
class BaseAgent {
    constructor(context, sectionOrder, sectionTitle, requiredFields = []) {
        this.context = context;
        this.sectionOrder = sectionOrder;
        this.sectionTitle = sectionTitle;
        this.requiredFields = requiredFields;
        this.validationRules = new Map();
    }
    formatByDetailLevel(data, level) {
        return '';
    }
    format(data) {
        const { detailLevel = 'standard' } = this.context.options || {};
        return this.formatByDetailLevel(data, detailLevel);
    }
    getSectionKeys() {
        return [];
    }
}
exports.BaseAgent = BaseAgent;
