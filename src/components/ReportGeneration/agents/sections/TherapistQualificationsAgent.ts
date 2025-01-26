import { AssessmentData } from '../../types';
import { BaseAgent } from '../core/BaseAgent';
import { ReportSection } from '../core/ReportStructure';
import { SectionContent } from '../core/ReportSectionTypes';

export class TherapistQualificationsAgent extends BaseAgent {
    constructor() {
        super(ReportSection.THERAPIST_QUALIFICATIONS);
    }

    public generateSection(data: AssessmentData): SectionContent {
        // Note: This would ideally come from a therapist profile database
        // For now, hardcoding Sebastien's qualifications as shown in report
        return {
            title: this.config.title,
            type: this.config.type,
            order: this.config.order,
            content: `Mr. Ferland is an Occupational Therapist with over 25 years of experience providing rehabilitation and expert opinion services in the province of Ontario. His professional practice began in 1998 when he graduated from the University of Ottawa's School of Rehabilitation and began working as a registered Occupational Therapist in the private sector. Over the years, Mr. Ferland has developed his clinical skills and evolved to provide expert opinions in matters of human function to stakeholders in the automobile insurance sector, personal injury and family law, the Workplace Safety and Insurance Board (WSIB), Veterans Affairs and the Long-Term Disability sectors.

His opinions are sought by both plaintiff and defense counsel in the context of resolving matters in personal injury and family law cases. He has been qualified several times as an expert in his field, providing testimony under oath in FSCO tribunals and cases appearing before the Ontario Superior Court of Justice.

Mr. Ferland's practice includes regular contributions to catastrophic designation assessment teams where he provides opinions related to daily function of individuals suffering from serious physical, psychological and cognitive impairments. His assessments inform multidisciplinary team members (psychiatry, orthopedics, neurology, physiatry, psychology, etc.) of injured client's daily functional capabilities at home, work and in the community, assisting them in forming opinions surrounding whether the catastrophic injury threshold is met.

Mr. Ferland concurrently provides services as a treating Occupational Therapist to clients who have sustained physical and psychological trauma in motor vehicle accidents. He has extensive experience in providing care to individuals suffering from chronic pain, depression, anxiety and posttraumatic stress, overseeing and directing functional reactivation programs to foster improvements in function and participation in meaningful activity.`
        };
    }
}