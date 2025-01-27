"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AgentOrchestrator_1 = require("./AgentOrchestrator");
const mockData_1 = require("./testing/mockData");
describe('Report Generation System', () => {
    const orchestrator = new AgentOrchestrator_1.AgentOrchestrator(mockData_1.mockContext);
    it('successfully generates complete reports', async () => {
        const sections = await orchestrator.generateReport(mockData_1.mockAssessmentData);
        expect(sections.length).toBeGreaterThan(0);
        expect(sections.every(s => s.valid)).toBe(true);
    });
});
