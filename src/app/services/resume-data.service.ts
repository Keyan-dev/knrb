import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResumeData, PersonalDetails, ProfessionalSummary, SkillCategory, Experience, Certification, Education } from '../models/resume-data.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeDataService {
  private resumeDataSubject = new BehaviorSubject<ResumeData>(this.getInitialResumeData());
  public resumeData$ = this.resumeDataSubject.asObservable();

  constructor(private storageService: StorageService) {
    // Load data from localStorage on service initialization
    this.loadFromStorage();
  }

  private getInitialResumeData(): ResumeData {
    return {
      personalDetails: {
        name: '',
        profession: '',
        mobileNumber: '',
        email: '',
        linkedinProfile: '',
        portfolioSite: '',
        additionalLinks: []
      },
      professionalSummary: {
        summary: ''
      },
      skills: [],
      experience: [],
      certifications: [],
      education: []
    };
  }

  getCurrentResumeData(): ResumeData {
    return this.resumeDataSubject.value;
  }

  updatePersonalDetails(personalDetails: PersonalDetails): void {
    const currentData = this.resumeDataSubject.value;
    this.resumeDataSubject.next({
      ...currentData,
      personalDetails
    });
  }

  updateProfessionalSummary(professionalSummary: ProfessionalSummary): void {
    const currentData = this.resumeDataSubject.value;
    this.resumeDataSubject.next({
      ...currentData,
      professionalSummary
    });
  }

  updateSkills(skills: SkillCategory[]): void {
    const currentData = this.resumeDataSubject.value;
    this.resumeDataSubject.next({
      ...currentData,
      skills
    });
  }

  updateExperience(experience: Experience[]): void {
    const currentData = this.resumeDataSubject.value;
    this.resumeDataSubject.next({
      ...currentData,
      experience
    });
  }

  updateCertifications(certifications: Certification[]): void {
    const currentData = this.resumeDataSubject.value;
    this.resumeDataSubject.next({
      ...currentData,
      certifications
    });
  }

  updateEducation(education: Education[]): void {
    const currentData = this.resumeDataSubject.value;
    this.resumeDataSubject.next({
      ...currentData,
      education
    });
  }

  resetResumeData(): void {
    this.resumeDataSubject.next(this.getInitialResumeData());
    this.storageService.clearAllData();
  }

  private loadFromStorage(): void {
    const savedData = this.storageService.loadCurrentResume();
    if (savedData && this.hasValidData(savedData)) {
      this.resumeDataSubject.next(savedData);
    }
  }

  private hasValidData(data: ResumeData): boolean {
    return !!(data.personalDetails && 
              data.professionalSummary && 
              data.skills && 
              data.experience && 
              data.certifications && 
              data.education);
  }
}
