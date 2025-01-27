"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class DocumentationAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.DOCUMENTATION);
    }
    generateSection(data) {
        const documentation = data.assessment.documentation;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: {
                medicalDocumentation: this.formatDocumentList('Medical Documentation', documentation.medicalDocumentation),
                legalDocumentation: this.formatDocumentList('Legal Documentation', documentation.legalDocumentation)
            }
        };
    }
    formatDocumentList(type, docs) {
        if (!docs?.length)
            return { items: [] };
        return {
            items: docs.map((doc, index) => ({
                id: index + 1,
                description: doc
            }))
        };
    }
}
exports.DocumentationAgent = DocumentationAgent;
