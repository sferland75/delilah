"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOrchestrator = void 0;
const BasicADLAgent_1 = require("./adl/BasicADLAgent");
const MobilityAgent_1 = require("./MobilityAgent");
const PhysicalSymptomsAgent_1 = require("./symptoms/PhysicalSymptomsAgent");
class AgentOrchestrator {
    constructor(context) {
        this.adlAgent = new BasicADLAgent_1.ADLAgent(context);
        this.mobilityAgent = new MobilityAgent_1.MobilityAgent(context);
        this.symptomsAgent = new PhysicalSymptomsAgent_1.PhysicalSymptomsAgent(context);
    }
    async generateReport(assessment) {
        const sections = await Promise.all([
            this.adlAgent.generateSection(assessment),
            this.mobilityAgent.generateSection(assessment),
            this.symptomsAgent.generateSection(assessment)
        ]);
        return sections.sort((a, b) => a.orderNumber - b.orderNumber);
    }
}
exports.AgentOrchestrator = AgentOrchestrator;
