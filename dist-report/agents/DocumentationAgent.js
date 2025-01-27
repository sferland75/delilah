"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class DocumentationAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 1.1, 'Documentation Review', ['documentation']);
    }
    async processData(data) {
        const docs = lodash_1.default.get(data, 'documentation', {});
        // Process documents by category
        const medicalDocs = this.processDocuments(docs.medicalDocumentation || []);
        const legalDocs = this.processDocuments(docs.legalDocumentation || []);
        const otherDocs = this.processDocuments(docs.otherDocumentation || []);
        // Generate recommendations
        const recommendations = this.generateRecommendations(medicalDocs, legalDocs);
        return {
            valid: true,
            medicalDocumentation: medicalDocs,
            legalDocumentation: legalDocs,
            otherDocumentation: otherDocs,
            recommendations
        };
    }
    processDocuments(docs) {
        return docs.map(doc => ({
            title: doc.title || 'Untitled Document',
            date: doc.date || 'Unknown date',
            type: doc.type || 'Unknown type',
            summary: doc.summary,
            provider: doc.provider,
            relevantFindings: doc.relevantFindings || []
        }));
    }
    generateRecommendations(medicalDocs, legalDocs) {
        const recommendations = new Set();
        // Add recommendations based on missing documentation
        if (medicalDocs.length === 0) {
            recommendations.add('Obtain recent medical records');
        }
        const oldestDoc = this.findOldestDocument([...medicalDocs, ...legalDocs]);
        if (oldestDoc && this.isDocumentOld(oldestDoc.date)) {
            recommendations.add('Update medical documentation');
        }
        return Array.from(recommendations);
    }
    findOldestDocument(docs) {
        return docs.reduce((oldest, current) => {
            const currentDate = new Date(current.date);
            return !oldest || currentDate < new Date(oldest.date) ? current : oldest;
        }, null);
    }
    isDocumentOld(dateStr) {
        const docDate = new Date(dateStr);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return docDate < sixMonthsAgo;
    }
    formatBrief(data) {
        const sections = ['Documentation Summary'];
        // Medical documentation count
        if (data.medicalDocumentation.length > 0) {
            sections.push(`\nMedical Documentation: ${data.medicalDocumentation.length} record(s)`);
        }
        // Legal documentation count
        if (data.legalDocumentation.length > 0) {
            sections.push(`Legal Documentation: ${data.legalDocumentation.length} record(s)`);
        }
        // Urgent recommendations
        const urgentRecs = data.recommendations.filter(rec => rec.toLowerCase().includes('urgent') ||
            rec.toLowerCase().includes('immediate') ||
            rec.toLowerCase().includes('required'));
        if (urgentRecs.length > 0) {
            sections.push('\nUrgent Needs:', ...urgentRecs.map(rec => `- ${rec}`));
        }
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = ['Documentation Review'];
        // Medical documentation
        if (data.medicalDocumentation.length > 0) {
            sections.push('\nMedical Documentation:');
            data.medicalDocumentation.forEach(doc => {
                sections.push(`- ${doc.date}: ${doc.title} (${doc.type})`);
                if (doc.provider)
                    sections.push(`  Provider: ${doc.provider}`);
                if (doc.relevantFindings?.length) {
                    sections.push('  Key Findings:');
                    doc.relevantFindings.forEach(finding => sections.push(`    - ${finding}`));
                }
            });
        }
        // Legal documentation
        if (data.legalDocumentation.length > 0) {
            sections.push('\nLegal Documentation:');
            data.legalDocumentation.forEach(doc => {
                sections.push(`- ${doc.date}: ${doc.title} (${doc.type})`);
                if (doc.provider)
                    sections.push(`  Provider: ${doc.provider}`);
                if (doc.summary)
                    sections.push(`  Summary: ${doc.summary}`);
            });
        }
        // Other documentation
        if (data.otherDocumentation?.length) {
            sections.push('\nOther Documentation:');
            data.otherDocumentation.forEach(doc => {
                sections.push(`- ${doc.date}: ${doc.title} (${doc.type})`);
            });
        }
        // Recommendations
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = ['Documentation Review'];
        // Medical documentation
        if (data.medicalDocumentation.length > 0) {
            sections.push('\nMedical Documentation:');
            data.medicalDocumentation.forEach(doc => {
                sections.push(`\n${doc.type} - ${doc.date}`);
                sections.push(`Title: ${doc.title}`);
                if (doc.provider)
                    sections.push(`Provider: ${doc.provider}`);
                if (doc.summary)
                    sections.push(`Summary: ${doc.summary}`);
                if (doc.relevantFindings?.length) {
                    sections.push('Key Findings:');
                    doc.relevantFindings.forEach(finding => sections.push(`- ${finding}`));
                }
            });
        }
        // Legal documentation
        if (data.legalDocumentation.length > 0) {
            sections.push('\nLegal Documentation:');
            data.legalDocumentation.forEach(doc => {
                sections.push(`\n${doc.type} - ${doc.date}`);
                sections.push(`Title: ${doc.title}`);
                if (doc.provider)
                    sections.push(`Provider: ${doc.provider}`);
                if (doc.summary)
                    sections.push(`Summary: ${doc.summary}`);
                if (doc.relevantFindings?.length) {
                    sections.push('Key Findings:');
                    doc.relevantFindings.forEach(finding => sections.push(`- ${finding}`));
                }
            });
        }
        // Other documentation
        if (data.otherDocumentation?.length) {
            sections.push('\nOther Documentation:');
            data.otherDocumentation.forEach(doc => {
                sections.push(`\n${doc.type} - ${doc.date}`);
                sections.push(`Title: ${doc.title}`);
                if (doc.summary)
                    sections.push(`Summary: ${doc.summary}`);
            });
        }
        // Recommendations
        if (data.recommendations.length > 0) {
            sections.push('\nRecommendations:');
            data.recommendations.forEach(rec => sections.push(`- ${rec}`));
        }
        return sections.join('\n');
    }
}
exports.DocumentationAgent = DocumentationAgent;
