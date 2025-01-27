"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalObservationsAgent = void 0;
const BaseAgent_1 = require("../core/BaseAgent");
const ReportStructure_1 = require("../core/ReportStructure");
class FunctionalObservationsAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super(ReportStructure_1.ReportSection.FUNCTIONAL_OBSERVATIONS);
    }
    generateSection(data) {
        const functional = data.assessment.functionalAssessment;
        const narrative = [
            this.formatTolerances(functional),
            this.formatBalanceAndMobility(functional),
            this.formatRangeOfMotion(functional.rangeOfMotion),
            this.formatMuscleTesting(functional.manualMuscleTesting)
        ].filter(Boolean).join('\n\n');
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: narrative
        };
    }
    formatTolerances(assessment) {
        const tolerances = [];
        // Sitting tolerance
        if (assessment.posturalTolerances?.sitting) {
            tolerances.push(`Sitting Tolerance: ${assessment.posturalTolerances.sitting}`);
        }
        // Standing tolerance
        if (assessment.posturalTolerances?.standing) {
            tolerances.push(`Standing Tolerance: ${assessment.posturalTolerances.standing}`);
        }
        // Walking tolerance
        if (assessment.posturalTolerances?.walking) {
            tolerances.push(`Walking Tolerance: ${assessment.posturalTolerances.walking}`);
        }
        return tolerances.length ?
            'Postural Tolerances:\n' + tolerances.join('\n') : '';
    }
    formatBalanceAndMobility(assessment) {
        const sections = [];
        // Berg Balance
        if (assessment.bergBalance) {
            const berg = assessment.bergBalance;
            sections.push('Balance Assessment:', `Total Score: ${berg.totalScore}/56`, berg.generalNotes);
        }
        // Transfers
        if (assessment.transfers) {
            sections.push('Transfer Abilities:', this.formatTransfers(assessment.transfers));
        }
        return sections.filter(Boolean).join('\n\n');
    }
    formatRangeOfMotion(rom) {
        if (!rom?.measurements?.length)
            return '';
        const sections = ['Range of Motion Findings:'];
        // Group by joint
        const byJoint = rom.measurements.reduce((acc, m) => {
            if (!acc[m.joint])
                acc[m.joint] = [];
            acc[m.joint].push(m);
            return acc;
        }, {});
        // Format each joint's measurements
        Object.entries(byJoint).forEach(([joint, measurements]) => {
            sections.push(`\n${joint}:`);
            measurements.forEach((m) => {
                const notes = m.notes ? ` - ${m.notes}` : '';
                sections.push(`• ${m.movement}: ${m.left.active}° / ${m.right.active}°${notes}`);
            });
        });
        if (rom.generalNotes) {
            sections.push('\n' + rom.generalNotes);
        }
        return sections.join('\n');
    }
    formatMuscleTesting(mmt) {
        if (!mmt?.grades)
            return '';
        const sections = ['Manual Muscle Testing Results:'];
        Object.entries(mmt.grades).forEach(([region, muscles]) => {
            sections.push(`\n${region}:`);
            Object.entries(muscles).forEach(([muscle, movements]) => {
                sections.push(`${muscle}:`);
                Object.entries(movements).forEach(([movement, grades]) => {
                    const left = grades.left ? `L: ${grades.left}` : '';
                    const right = grades.right ? `R: ${grades.right}` : '';
                    sections.push(`• ${movement}: ${[left, right].filter(Boolean).join(' / ')}`);
                });
            });
        });
        if (mmt.generalNotes) {
            sections.push('\n' + mmt.generalNotes);
        }
        return sections.join('\n');
    }
    formatTransfers(transfers) {
        const sections = [];
        if (transfers.bedTransfer) {
            sections.push(`Bed Transfers: ${transfers.bedTransfer}`);
        }
        if (transfers.toiletTransfer) {
            sections.push(`Toilet Transfers: ${transfers.toiletTransfer}`);
        }
        if (transfers.tub_shower) {
            sections.push(`Tub/Shower Transfers: ${transfers.tub_shower}`);
        }
        if (transfers.car) {
            sections.push(`Car Transfers: ${transfers.car}`);
        }
        return sections.join('\n');
    }
}
exports.FunctionalObservationsAgent = FunctionalObservationsAgent;
