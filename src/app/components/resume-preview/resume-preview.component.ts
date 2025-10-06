import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ResumeDataService } from '../../services/resume-data.service';
import { ExportService } from '../../services/export.service';
import { StorageService } from '../../services/storage.service';
import { TemplateService, ResumeTemplate } from '../../services/template.service';
import { ResumeData } from '../../models/resume-data.interface';

@Component({
  selector: 'app-resume-preview',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.scss'
})
export class ResumePreviewComponent implements OnInit {
  resumeData: ResumeData | null = null;
  currentTemplate: ResumeTemplate | null = null;
  selectedTemplate: string = 'modern';

  constructor(
    private resumeDataService: ResumeDataService,
    private exportService: ExportService,
    private storageService: StorageService,
    private templateService: TemplateService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load template first
    this.selectedTemplate = this.storageService.getSelectedTemplate();
    this.currentTemplate = this.templateService.getTemplate(this.selectedTemplate);

    this.resumeDataService.resumeData$.subscribe(data => {
      this.resumeData = data;
      // Auto-save to localStorage whenever data changes
      if (data && this.hasValidData(data)) {
        this.storageService.saveCurrentResume(data, this.selectedTemplate);
      }
    });

    // Listen for template changes from template service
    this.templateService.selectedTemplate$.subscribe(templateId => {
      this.selectedTemplate = templateId;
      this.currentTemplate = this.templateService.getTemplate(templateId);
    });
  }

  async exportToPDF(): Promise<void> {
    if (this.resumeData) {
      try {
        await this.exportService.exportToPDF('resume-preview', 'resume.pdf');
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Error exporting to PDF. Please try again.');
      }
    }
  }

  async exportToDOCX(): Promise<void> {
    if (this.resumeData) {
      try {
        await this.exportService.exportToDOCX(this.resumeData, 'resume.docx');
      } catch (error) {
        console.error('Error exporting to DOCX:', error);
        alert('Error exporting to DOCX. Please try again.');
      }
    }
  }

  formatDate(date: Date): string {
    return date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
  }

  formatExperienceDate(exp: any): string {
    const startDate = this.formatDate(exp.startDate || new Date());
    const endDate = exp.endDate === 'Present' ? 'Present' : this.formatDate(exp.endDate || new Date());
    return `${startDate} – ${endDate}`;
  }

  saveResumeWithName(): void {
    if (!this.resumeData || !this.hasValidData(this.resumeData)) {
      alert('Please fill in at least your name and profession before saving.');
      return;
    }

    const name = prompt('Enter a name for this resume:', 
      this.resumeData.personalDetails.name + ' - Resume');
    
    if (name && name.trim()) {
      const id = this.storageService.saveResume(name.trim(), this.resumeData, this.selectedTemplate);
      alert(`Resume saved successfully as "${name}"`);
    }
  }

  private hasValidData(data: ResumeData): boolean {
    return !!(data.personalDetails.name && data.personalDetails.profession);
  }

  getTemplateStyles(): any {
    const styles = this.currentTemplate?.styles || {};
    return {
      '--primary-color': styles.primaryColor || '#1976d2',
      '--secondary-color': styles.secondaryColor || '#f5f5f5',
      '--text-color': styles.textColor || '#333',
      '--accent-color': styles.accentColor || '#ff4081',
      '--font-family': styles.fontFamily || 'Roboto, Arial, sans-serif'
    };
  }

  changeTemplate(): void {
    this.router.navigate(['/template-selector']);
  }
}
