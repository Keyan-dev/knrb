export interface PersonalDetails {
  name: string;
  profession: string;
  mobileNumber: string;
  email: string;
  linkedinProfile?: string;
  portfolioSite?: string;
  additionalLinks: string[];
}

export interface ProfessionalSummary {
  summary: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: Date;
  endDate: Date | 'Present';
  description: string;
}

export interface Certification {
  certificationName: string;
  issuingOrganization: string;
  dateIssued: Date;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  startYear: number;
  endYear: number;
  cgpa?: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  professionalSummary: ProfessionalSummary;
  skills: SkillCategory[];
  experience: Experience[];
  certifications: Certification[];
  education: Education[];
}
