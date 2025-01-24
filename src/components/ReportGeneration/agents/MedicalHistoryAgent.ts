import { BaseAgent } from './BaseAgent';
import { formatDate } from './utils';

export class MedicalHistoryAgent extends BaseAgent {
  constructor(context: any) {
    super(
      context,
      3,
      'Medical History',
      ['medicalHistory.medications', 'medicalHistory.preExisting', 'medicalHistory.injury']
    );
  }

  process(data: any) {
    const history = data.medicalHistory;

    return {
      currentMedications: this.processMedications(history.medications),
      preExisting: history.preExisting,
      injury: this.processInjury(history.injury),
      treatments: this.processTreatments(history.currentTreatment),
      surgeries: history.surgeries
    };
  }

  private processMedications(medications: any[]) {
    if (!medications?.length) return [];
    
    return medications.map(med => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      purpose: med.purpose,
      isPostAccident: this.determineIfPostAccident(med.purpose)
    }));
  }

  private processInjury(injury: any) {
    if (!injury) return null;

    return {
      circumstance: injury.circumstance,
      immediateResponse: injury.immediateResponse,
      subsequentCare: injury.subsequentCare,
      position: injury.position
    };
  }

  private processTreatments(treatments: any[]) {
    if (!treatments?.length) return [];

    return treatments
      .filter(t => t.name || t.focus) // Filter empty entries
      .map(t => ({
        provider: t.providerType,
        name: t.name,
        focus: t.focus,
        frequency: t.frequency,
        startDate: t.startDate ? formatDate(t.startDate) : undefined,
        progress: t.progress
      }));
  }

  private determineIfPostAccident(purpose: string): boolean {
    const postAccidentIndicators = [
      'accident',
      'injury',
      'pain',
      'trauma',
      'post',
      'since',
      'after'
    ];
    
    return postAccidentIndicators.some(indicator => 
      purpose?.toLowerCase().includes(indicator)
    );
  }

  format(data: any): string {
    let report = 'MEDICAL HISTORY\n\n';

    // Pre-existing Conditions
    if (data.preExisting) {
      report += 'Pre-existing Conditions:\n';
      report += `${data.preExisting}\n\n`;
    }

    // Injury Details
    if (data.injury) {
      report += 'Nature of Injury:\n';
      report += `${data.injury.circumstance}\n\n`;
      report += 'Initial Response:\n';
      report += `${data.injury.immediateResponse}\n\n`;
      report += 'Subsequent Care:\n';
      report += `${data.injury.subsequentCare}\n\n`;
    }

    // Current Medications
    if (data.currentMedications?.length) {
      report += 'Current Medications:\n';
      data.currentMedications.forEach((med: any) => {
        report += `• ${med.name} ${med.dosage} ${med.frequency}\n`;
        if (med.purpose) report += `  Purpose: ${med.purpose}\n`;
      });
      report += '\n';
    }

    // Current Treatments
    if (data.treatments?.length) {
      report += 'Current Treatment:\n';
      data.treatments.forEach((treatment: any) => {
        if (treatment.name) {
          report += `• ${treatment.name}`;
          if (treatment.provider) report += ` (${treatment.provider})`;
          report += '\n';
          if (treatment.focus) report += `  Focus: ${treatment.focus}\n`;
          if (treatment.frequency) report += `  Frequency: ${treatment.frequency}\n`;
        }
      });
      report += '\n';
    }

    // Surgeries
    if (data.surgeries) {
      report += 'Surgical History:\n';
      report += `${data.surgeries}\n\n`;
    }

    return report;
  }
}