"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendantCareAgent = void 0;
const BaseReportAgent_1 = require("./BaseReportAgent");
class AttendantCareAgent extends BaseReportAgent_1.BaseReportAgent {
    constructor() {
        super(...arguments);
        this.sectionType = BaseReportAgent_1.ReportSectionType.MODERATE_NARRATIVE;
    }
    generateSection(data) {
        const care = data.assessment.care;
        return {
            title: 'Attendant Care Requirements',
            type: this.sectionType,
            order: 6,
            content: {
                personalCare: this.analyzePersonalCare(care.personalCare),
                housekeeping: this.analyzeHousekeeping(care.housekeeping),
                mealPreparation: this.analyzeMealPrep(care.mealPreparation),
                transportation: this.analyzeTransportation(care.transportation),
                costSummary: this.formatCostSummary(care.costSummary)
            }
        };
    }
    analyzePersonalCare(data) {
        if (!data)
            return '';
        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }
    analyzeHousekeeping(data) {
        if (!data)
            return '';
        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }
    analyzeMealPrep(data) {
        if (!data)
            return '';
        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }
    analyzeTransportation(data) {
        if (!data)
            return '';
        return this.generateModerateNarrative({
            type: data.type,
            frequency: data.frequency,
            provider: data.provider,
            notes: data.notes
        });
    }
    formatCostSummary(data) {
        if (!data)
            return {};
        return {
            monthlyCost: this.formatClinicalValue(data.monthly, 'CAD'),
            annualCost: this.formatClinicalValue(data.annual, 'CAD'),
            notes: data.notes
        };
    }
}
exports.AttendantCareAgent = AttendantCareAgent;
