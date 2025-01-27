"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersAgentPatterns = void 0;
const TransfersAgentAnalysis_1 = require("./TransfersAgentAnalysis");
class TransfersAgentPatterns extends TransfersAgentAnalysis_1.TransfersAgentAnalysis {
    analyzeTransferPatterns(data) {
        const patterns = [];
        const transfers = data.transfers || {};
        if (transfers.bedMobility && this.isValidAssistanceLevel(transfers.bedMobility)) {
            patterns.push({
                type: transfers.bedMobility,
                context: 'bed_mobility',
                modifications: this.getModifications(data, 'bed'),
                equipment: this.getRequiredEquipment(data, 'bed')
            });
        }
        if (transfers.sitToStand && this.isValidAssistanceLevel(transfers.sitToStand)) {
            patterns.push({
                type: transfers.sitToStand,
                context: 'sit_to_stand',
                modifications: this.getModifications(data, 'chair'),
                equipment: this.getRequiredEquipment(data, 'chair')
            });
        }
        return patterns;
    }
    isValidAssistanceLevel(level) {
        return ['independent', 'modified_independent', 'minimal_assist', 'moderate_assist', 'maximum_assist'].includes(level);
    }
    analyzeLocationSpecificTransfers(data) {
        const locations = [];
        const locationTypes = ['bed', 'chair', 'toilet', 'shower/tub'];
        locationTypes.forEach((location) => {
            locations.push({
                location,
                patterns: this.getLocationPatterns(data, location === 'shower/tub' ? 'shower' : location),
                risks: this.getLocationRisks(data, location === 'shower/tub' ? 'shower' : location)
            });
        });
        return locations;
    }
    getLocationPatterns(data, location) {
        const patterns = [];
        const transfers = data.transfers || {};
        const transferData = transfers[location];
        if (transferData && transferData.assistanceLevel) {
            const type = this.isValidAssistanceLevel(transferData.assistanceLevel)
                ? transferData.assistanceLevel
                : 'independent';
            patterns.push({
                type,
                context: `${location}_transfer`,
                modifications: this.getModifications(data, location),
                equipment: this.getRequiredEquipment(data, location),
                safety_concerns: this.getSafetyConcerns(data, location)
            });
        }
        return patterns;
    }
    getLocationRisks(data, location) {
        const risks = [];
        const transfers = data.transfers || {};
        const transferData = transfers[location];
        if (transferData?.safety_concerns) {
            risks.push(...transferData.safety_concerns);
        }
        const environmentRisks = this.getEnvironmentalRisks(data, location);
        if (environmentRisks.length > 0) {
            risks.push(...environmentRisks);
        }
        return risks;
    }
    getModifications(data, location) {
        const modifications = [];
        const transfers = data.transfers || {};
        const transferData = transfers[location];
        if (transferData?.modifications) {
            modifications.push(...transferData.modifications);
        }
        return modifications;
    }
    getRequiredEquipment(data, location) {
        const equipment = [];
        const transfers = data.transfers || {};
        const transferData = transfers[location];
        if (transferData?.equipment) {
            equipment.push(...transferData.equipment);
        }
        return equipment;
    }
    getSafetyConcerns(data, location) {
        const concerns = [];
        const transfers = data.transfers || {};
        const transferData = transfers[location];
        if (transferData?.safety_concerns) {
            concerns.push(...transferData.safety_concerns);
        }
        return concerns;
    }
    getEnvironmentalRisks(data, location) {
        const risks = [];
        const environment = data.environment || {};
        const environmentData = environment[location];
        if (environmentData?.hazards) {
            risks.push(...environmentData.hazards.map((hazard) => `${location}: ${hazard}`));
        }
        return risks;
    }
    identifyRequiredEquipment(data, patterns) {
        const equipment = new Set();
        // Add equipment from patterns
        for (const pattern of patterns) {
            if (pattern.equipment) {
                for (const item of pattern.equipment) {
                    equipment.add(item);
                }
            }
        }
        // Add equipment from transfers
        const transfers = data.transfers || {};
        for (const details of Object.values(transfers)) {
            const transferDetails = details;
            if (transferDetails?.equipment) {
                for (const item of transferDetails.equipment) {
                    equipment.add(item);
                }
            }
        }
        // Add current equipment that's still needed
        const currentEquipment = data.currentEquipment || [];
        for (const item of currentEquipment) {
            if (this.isEquipmentRequired(item, patterns)) {
                equipment.add(item);
            }
        }
        return Array.from(equipment);
    }
    isEquipmentRequired(item, patterns) {
        return patterns.some((pattern) => pattern.type !== 'independent' &&
            pattern.equipment?.includes(item));
    }
}
exports.TransfersAgentPatterns = TransfersAgentPatterns;
