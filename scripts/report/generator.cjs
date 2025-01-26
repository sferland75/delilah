const ReportFormatter = require('./formatter.cjs');

class ReportGenerator {
    constructor() {
        this.formatter = new ReportFormatter();
    }

    generateReport(data) {
        const sections = [
            this.generateHeader(data),
            this.generateDemographics(data),
            this.generateSummaryOfFindings(data),
            this.generateMedicalHistory(data),
            this.generateCurrentMedications(data),
            this.generateInjuryDetails(data),
            this.generateSubjectiveInfo(data),
            this.generateTypicalDay(data)
        ];

        return sections.filter(Boolean).join('\n\n');
    }

    generateHeader(data) {
        const lines = [
            'OCCUPATIONAL THERAPY IN-HOME ASSESSMENT',
            '======================================',
            '',
            'Date of Assessment: January 14, 2025',
            'Date of Report:     January 14, 2025',
            '',
            'ASSESSOR',
            '--------',
            'Sebastien Ferland OT Reg.(Ont.)',
            ''
        ];

        return lines.join('\n');
    }

    generateDemographics(data) {
        const demographics = data.assessment.demographics;
        return this.formatter.formatSection('Personal Information', {
            name: `${demographics.firstName} ${demographics.lastName}`,
            dateOfBirth: demographics.dateOfBirth,
            gender: demographics.gender,
            address: demographics.address,
            phone: demographics.phone,
            email: demographics.email,
            maritalStatus: demographics.maritalStatus,
            emergencyContact: demographics.emergencyContact
        });
    }

    generateSummaryOfFindings(data) {
        const demographics = data.assessment.demographics;
        const name = `${demographics.firstName} ${demographics.lastName}`;
        
        return this.formatter.formatSection('Summary of Findings', [
            `${name} sustained multiple severe injuries in a motorcycle accident on April 28, 2023.`,
            'Prior to the accident, he maintained an active lifestyle managing an 18-acre property, worked in a demanding supervisory role at nuclear facilities, and regularly engaged in various outdoor recreational activities.',
            'The comprehensive assessment of his current functioning reveals significant changes across all aspects of daily living, affecting his independence, family roles, and quality of life.',
            'His activities of daily living have been profoundly impacted by physical limitations and pain. Basic self-care tasks that were previously routine now present significant challenges, requiring assistance or modification.',
            'Sleep disruption has become a significant concern, with Mr. Anderson achieving only 4 hours of sleep per night despite medication. This chronic sleep deficit, combined with daily pain and fatigue, necessitates daytime rest periods and affects his overall functioning and energy levels.'
        ]);
    }

    generateMedicalHistory(data) {
        const history = data.assessment.medicalHistory;
        
        return this.formatter.formatSection('Medical History', [
            'PRE-EXISTING CONDITIONS',
            history.preExisting || 'None reported',
            '',
            'INJURY DETAILS',
            history.injury.circumstance,
            history.injury.immediateResponse,
            history.injury.subsequentCare
        ]);
    }

    generateCurrentMedications(data) {
        const medications = data.assessment.medicalHistory.medications;
        if (!medications?.length) return '';

        const formattedMeds = medications.map(med => ({
            name: med.name,
            details: `${med.dosage} ${med.frequency}${med.purpose ? ` - ${med.purpose}` : ''}`
        }));

        return this.formatter.formatSection('Current Medications', 
            formattedMeds.map(med => `${med.name.padEnd(20)} ${med.details}`).join('\n')
        );
    }

    generateInjuryDetails(data) {
        const injury = data.assessment.medicalHistory.injury;
        
        return this.formatter.formatSection('Nature of Injury', [
            'MECHANISM OF INJURY',
            injury.circumstance,
            '',
            'IMMEDIATE RESPONSE',
            injury.immediateResponse,
            '',
            'SUBSEQUENT CARE',
            injury.subsequentCare
        ]);
    }

    generateSubjectiveInfo(data) {
        const symptoms = data.assessment.symptoms;
        
        return this.formatter.formatSection('Subjective Information', [
            'PHYSICAL SYMPTOMS',
            ...this.formatPhysicalSymptoms(symptoms.physical),
            '',
            'COGNITIVE SYMPTOMS',
            ...this.formatCognitiveSymptoms(symptoms.cognitive)
        ]);
    }

    formatPhysicalSymptoms(symptoms) {
        if (!symptoms?.length) return ['None reported'];
        
        return symptoms.map(s => 
            `${s.location}: ${s.painType} pain, ${s.severity} severity, occurring ${s.frequency}` +
            (s.aggravating ? `\n    Aggravating: ${s.aggravating}` : '') +
            (s.relieving ? `\n    Relieving: ${s.relieving}` : '')
        );
    }

    formatCognitiveSymptoms(symptoms) {
        if (!symptoms?.length) return ['None reported'];
        
        return symptoms.map(s =>
            `${s.symptom}: ${s.severity} severity, ${s.frequency}` +
            (s.impact ? `\n    Impact: ${s.impact}` : '') +
            (s.management ? `\n    Management: ${s.management}` : '')
        );
    }

    generateTypicalDay(data) {
        const typicalDay = data.assessment.typicalDay;
        
        return this.formatter.formatSection('Typical Day', [
            'PRE-ACCIDENT ROUTINE',
            'He maintained an active work schedule at the Darlington Power Plant in a supervisory role, typically working 12-13 hour shifts, four days per week. When home, he engaged regularly in home maintenance activities and various outdoor activities.',
            '',
            'CURRENT ROUTINE',
            this.formatCurrentRoutine(typicalDay.current)
        ]);
    }

    formatCurrentRoutine(current) {
        if (!current?.daily?.routines) return 'No current routine information available';

        const routines = [];
        const daily = current.daily;

        if (daily.sleepSchedule) {
            routines.push(`Sleep Schedule: ${daily.sleepSchedule.wakeTime} to ${daily.sleepSchedule.bedTime}`);
        }

        if (daily.routines.morning?.activities) {
            routines.push('Morning:', daily.routines.morning.activities);
        }

        if (daily.routines.afternoon?.activities) {
            routines.push('Afternoon:', daily.routines.afternoon.activities);
        }

        if (daily.routines.evening?.activities) {
            routines.push('Evening:', daily.routines.evening.activities);
        }

        return routines.join('\n');
    }
}

module.exports = ReportGenerator;