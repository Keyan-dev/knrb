import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  styles: any;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private selectedTemplateSubject = new BehaviorSubject<string>('modern');
  public selectedTemplate$ = this.selectedTemplateSubject.asObservable();
  private templates: ResumeTemplate[] = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design with subtle colors',
      preview: 'modern-preview',
      styles: {
        primaryColor: '#1976d2',
        secondaryColor: '#f5f5f5',
        textColor: '#333',
        accentColor: '#ff4081',
        fontFamily: 'Roboto, Arial, sans-serif'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant design with focus on content',
      preview: 'minimal-preview',
      styles: {
        primaryColor: '#424242',
        secondaryColor: '#ffffff',
        textColor: '#212121',
        accentColor: '#757575',
        fontFamily: 'Helvetica, Arial, sans-serif'
      }
    },
    {
      id: 'ats',
      name: 'ATS-Friendly',
      description: 'Optimized for Applicant Tracking Systems',
      preview: 'ats-preview',
      styles: {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        textColor: '#000000',
        accentColor: '#333333',
        fontFamily: 'Arial, sans-serif'
      }
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold design with vibrant colors',
      preview: 'creative-preview',
      styles: {
        primaryColor: '#e91e63',
        secondaryColor: '#fce4ec',
        textColor: '#333',
        accentColor: '#9c27b0',
        fontFamily: 'Montserrat, Arial, sans-serif'
      }
    }
  ];

  constructor() { }

  getAllTemplates(): ResumeTemplate[] {
    return [...this.templates];
  }

  getTemplate(id: string): ResumeTemplate | null {
    return this.templates.find(template => template.id === id) || null;
  }

  getDefaultTemplate(): ResumeTemplate {
    return this.templates[0];
  }

  setSelectedTemplate(templateId: string): void {
    this.selectedTemplateSubject.next(templateId);
  }

  getSelectedTemplate(): string {
    return this.selectedTemplateSubject.value;
  }
}
