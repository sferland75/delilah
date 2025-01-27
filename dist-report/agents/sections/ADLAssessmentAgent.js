"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADLAssessmentAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class ADLAssessmentAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.ADL_ASSESSMENT);
    }
    generateSection(data) {
        const adl = data.assessment.adl;
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: this.generateADLNarrative(adl)
        };
    }
    generateADLNarrative(adl) {
        const sections = [];
        // Self-Care Activities
        sections.push(this.formatSelfCareActivities(adl));
        // Home Management
        sections.push(this.formatHomeManagement(adl));
        // Work Status
        sections.push(this.formatWorkStatus(adl));
        return sections.filter(Boolean).join('\n\n');
    }
    formatSelfCareActivities(adl) {
        const sections = ['Self-Care Activities:'];
        if (adl.basic) {
            // Bathing
            if (adl.basic.bathing) {
                sections.push(this.formatBathingSection(adl.basic.bathing));
            }
            // Dressing
            if (adl.basic.dressing) {
                sections.push(this.formatDressingSection(adl.basic.dressing));
            }
            // Feeding
            if (adl.basic.feeding) {
                sections.push(this.formatFeedingSection(adl.basic.feeding));
            }
            // Transfers
            if (adl.basic.transfers) {
                sections.push(this.formatTransfersSection(adl.basic.transfers));
            }
        }
        return sections.filter(Boolean).join('\n\n');
    }
    formatBathingSection(bathing) {
        const details = [];
        if (bathing.shower?.notes || bathing.shower?.independence) {
            details.push(`Shower: ${bathing.shower.notes || bathing.shower.independence || ''}`);
        }
        if (bathing.grooming?.notes || bathing.grooming?.independence) {
            details.push(`Grooming: ${bathing.grooming.notes || bathing.grooming.independence || ''}`);
        }
        return details.length ? 'Bathing/Grooming:\n' + details.map(d => `• ${d}`).join('\n') : '';
    }
    formatDressingSection(dressing) {
        const details = [];
        if (dressing.upper_body?.notes || dressing.upper_body?.independence) {
            details.push(`Upper Body: ${dressing.upper_body.notes || dressing.upper_body.independence || ''}`);
        }
        if (dressing.lower_body?.notes || dressing.lower_body?.independence) {
            details.push(`Lower Body: ${dressing.lower_body.notes || dressing.lower_body.independence || ''}`);
        }
        return details.length ? 'Dressing:\n' + details.map(d => `• ${d}`).join('\n') : '';
    }
    formatFeedingSection(feeding) {
        const details = [];
        if (feeding.eating?.notes || feeding.eating?.independence) {
            details.push(`Eating: ${feeding.eating.notes || feeding.eating.independence || ''}`);
        }
        if (feeding.setup?.notes || feeding.setup?.independence) {
            details.push(`Meal Setup: ${feeding.setup.notes || feeding.setup.independence || ''}`);
        }
        return details.length ? 'Feeding:\n' + details.map(d => `• ${d}`).join('\n') : '';
    }
    formatTransfersSection(transfers) {
        const details = [];
        if (transfers.bed_transfer?.notes || transfers.bed_transfer?.independence) {
            details.push(`Bed: ${transfers.bed_transfer.notes || transfers.bed_transfer.independence || ''}`);
        }
        if (transfers.toilet_transfer?.notes || transfers.toilet_transfer?.independence) {
            details.push(`Toilet: ${transfers.toilet_transfer.notes || transfers.toilet_transfer.independence || ''}`);
        }
        return details.length ? 'Transfers:\n' + details.map(d => `• ${d}`).join('\n') : '';
    }
    formatHomeManagement(adl) {
        if (!adl.iadl?.household)
            return '';
        const sections = ['Home Management:'];
        const activities = [];
        // Cleaning
        if (adl.iadl.household.cleaning?.notes) {
            activities.push(`Cleaning: ${adl.iadl.household.cleaning.notes}`);
        }
        // Laundry
        if (adl.iadl.household.laundry?.notes) {
            activities.push(`Laundry: ${adl.iadl.household.laundry.notes}`);
        }
        // Meal Preparation
        if (adl.iadl.household.meal_prep?.notes) {
            activities.push(`Meal Preparation: ${adl.iadl.household.meal_prep.notes}`);
        }
        if (activities.length) {
            sections.push(activities.map(a => `• ${a}`).join('\n'));
        }
        return sections.join('\n\n');
    }
    formatWorkStatus(adl) {
        if (!adl.work?.status)
            return '';
        const sections = ['Work Status:'];
        const details = [];
        if (adl.work.status.current_status?.notes) {
            details.push(`Current Status: ${adl.work.status.current_status.notes}`);
        }
        if (adl.work.status.barriers?.notes) {
            details.push(`Barriers: ${adl.work.status.barriers.notes}`);
        }
        if (details.length) {
            sections.push(details.map(d => `• ${d}`).join('\n'));
        }
        return sections.join('\n\n');
    }
}
exports.ADLAssessmentAgent = ADLAssessmentAgent;
