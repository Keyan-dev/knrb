import { Injectable } from '@angular/core';
import { ResumeData } from '../models/resume-data.interface';

export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  template: string;
  lastModified: Date;
  created: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'resume_builder_saves';
  private readonly CURRENT_RESUME_KEY = 'current_resume';
  private readonly SELECTED_TEMPLATE_KEY = 'selected_template';

  constructor() { }

  // Save current resume data
  saveCurrentResume(data: ResumeData, template: string = 'modern'): void {
    localStorage.setItem(this.CURRENT_RESUME_KEY, JSON.stringify(data));
    localStorage.setItem(this.SELECTED_TEMPLATE_KEY, template);
  }

  // Load current resume data
  loadCurrentResume(): ResumeData | null {
    const data = localStorage.getItem(this.CURRENT_RESUME_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Get selected template
  getSelectedTemplate(): string {
    return localStorage.getItem(this.SELECTED_TEMPLATE_KEY) || 'modern';
  }

  // Save resume with name
  saveResume(name: string, data: ResumeData, template: string): string {
    const id = this.generateId();
    const savedResume: SavedResume = {
      id,
      name,
      data,
      template,
      lastModified: new Date(),
      created: new Date()
    };

    const savedResumes = this.getAllSavedResumes();
    savedResumes.push(savedResume);
    
    // Keep only the latest 10 saves
    if (savedResumes.length > 10) {
      savedResumes.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
      savedResumes.splice(10);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedResumes));
    return id;
  }

  // Get all saved resumes
  getAllSavedResumes(): SavedResume[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    const resumes = JSON.parse(data);
    return resumes.map((resume: any) => ({
      ...resume,
      lastModified: new Date(resume.lastModified),
      created: new Date(resume.created)
    }));
  }

  // Load specific resume by ID
  loadResume(id: string): SavedResume | null {
    const resumes = this.getAllSavedResumes();
    return resumes.find(resume => resume.id === id) || null;
  }

  // Delete saved resume
  deleteResume(id: string): void {
    const resumes = this.getAllSavedResumes();
    const filteredResumes = resumes.filter(resume => resume.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResumes));
  }

  // Get recent resumes (last 5)
  getRecentResumes(): SavedResume[] {
    const resumes = this.getAllSavedResumes();
    return resumes
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      .slice(0, 5);
  }

  // Check if there's unsaved data
  hasUnsavedData(): boolean {
    const currentData = this.loadCurrentResume();
    return currentData !== null && Object.keys(currentData).length > 0;
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(this.CURRENT_RESUME_KEY);
    localStorage.removeItem(this.SELECTED_TEMPLATE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
