"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOrchestrator = void 0;
const DemographicsAgent_1 = require("./agents/DemographicsAgent");
const DocumentationAgent_1 = require("./agents/DocumentationAgent");
const MobilityAgent_1 = require("./agents/MobilityAgent");
const RangeOfMotionAgent_1 = require("./agents/RangeOfMotion/RangeOfMotionAgent");
const TransfersAgent_1 = require("./agents/TransfersAgent");
const BasicADLAgent_1 = require("./agents/adl/BasicADLAgent");
const IADLAgent_1 = require("./agents/adl/IADLAgent");
const PhysicalSymptomsAgent_1 = require("./agents/symptoms/PhysicalSymptomsAgent");
const CognitiveSymptomAgent_1 = require("./agents/symptoms/CognitiveSymptomAgent");
const EmotionalSymptomAgent_1 = require("./agents/symptoms/EmotionalSymptomAgent");
const SymptomIntegrationAgent_1 = require("./agents/symptoms/SymptomIntegrationAgent");
const TypicalDayAgent_1 = require("./agents/TypicalDayAgent");
const AttendantCareAgent_1 = require("./agents/AttendantCareAgent");
class AgentOrchestrator {
    constructor(context) {
        this.context = context;
        // Initialize all agents in order
        this.agents = [
            new DemographicsAgent_1.DemographicsAgent(context),
            new DocumentationAgent_1.DocumentationAgent(context),
            new MobilityAgent_1.MobilityAgent(context),
            new RangeOfMotionAgent_1.RangeOfMotionAgent(context),
            new TransfersAgent_1.TransfersAgent(context),
            new BasicADLAgent_1.BasicADLAgent(context),
            new IADLAgent_1.IADLAgent(context),
            new PhysicalSymptomsAgent_1.PhysicalSymptomsAgent(context),
            new CognitiveSymptomAgent_1.CognitiveSymptomAgent(context),
            new EmotionalSymptomAgent_1.EmotionalSymptomAgent(context),
            new SymptomIntegrationAgent_1.SymptomIntegrationAgent(context),
            new TypicalDayAgent_1.TypicalDayAgent(context),
            new AttendantCareAgent_1.AttendantCareAgent(context)
        ];
        // Sort by order number
        this.agents.sort((a, b) => a.getOrderNumber() - b.getOrderNumber());
    }
    async generateReport(data) {
        // Handle null/undefined data
        if (!data) {
            this.context.logger.warn('No assessment data provided');
            return [{
                    orderNumber: 0,
                    sectionName: 'Assessment Summary',
                    title: 'Assessment Summary',
                    content: 'No assessment data available for processing.',
                    valid: true
                }];
        }
        // Handle missing required fields
        if (!data.id || !data.date) {
            this.context.logger.warn('Missing required assessment fields');
            return [{
                    orderNumber: 0,
                    sectionName: 'Assessment Summary',
                    title: 'Assessment Summary',
                    content: 'Assessment data is missing required fields.',
                    valid: true
                }];
        }
        try {
            // Log start of processing
            this.context.logger.log('Starting report generation...');
            // Generate sections in parallel with error handling for each agent
            const sections = await Promise.all(this.agents.map(async (agent) => {
                try {
                    const section = await agent.generateSection(data);
                    // Log successful section generation
                    this.context.logger.log(`Generated section: ${agent.getSectionName()}`);
                    // Ensure valid sections for empty data
                    if (!section.content || section.content.trim() === '') {
                        return {
                            orderNumber: agent.getOrderNumber(),
                            sectionName: agent.getSectionName(),
                            title: agent.getSectionName(),
                            content: 'No data available for this section.',
                            valid: true
                        };
                    }
                    // Ensure section validity
                    return {
                        ...section,
                        valid: true
                    };
                }
                catch (error) {
                    this.context.logger.error(`Error in ${agent.constructor.name}: ${error.message}`);
                    return {
                        orderNumber: agent.getOrderNumber(),
                        sectionName: agent.getSectionName(),
                        title: agent.getSectionName(),
                        content: 'Unable to process this section.',
                        valid: true,
                        errors: [error.message]
                    };
                }
            }));
            // Filter out any null/undefined sections and sort by order number
            const processedSections = sections
                .filter((section) => section !== null && section !== undefined)
                .sort((a, b) => a.orderNumber - b.orderNumber);
            // Log completion
            this.context.logger.log(`Generated ${processedSections.length} sections`);
            return processedSections;
        }
        catch (error) {
            this.context.logger.error(`Error generating report: ${error.message}`);
            return [{
                    orderNumber: 0,
                    sectionName: 'Error',
                    title: 'Error',
                    content: 'An error occurred while generating the report.',
                    valid: true,
                    errors: [error.message]
                }];
        }
    }
}
exports.AgentOrchestrator = AgentOrchestrator;
