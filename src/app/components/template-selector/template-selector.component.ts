import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TemplateService, ResumeTemplate } from '../../services/template.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-template-selector',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './template-selector.component.html',
  styleUrl: './template-selector.component.scss'
})
export class TemplateSelectorComponent implements OnInit {
  @Output() templateSelected = new EventEmitter<string>();
  
  templates: ResumeTemplate[] = [];
  selectedTemplate: string = 'modern';
  recentResumes: any[] = [];

  constructor(
    private templateService: TemplateService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.templates = this.templateService.getAllTemplates();
    this.selectedTemplate = this.storageService.getSelectedTemplate();
    this.recentResumes = this.storageService.getRecentResumes();
  }

  selectTemplate(templateId: string): void {
    this.selectedTemplate = templateId;
    this.templateSelected.emit(templateId);
    
    // Update template service
    this.templateService.setSelectedTemplate(templateId);
    
    // Save template selection to localStorage
    localStorage.setItem('selected_template', templateId);
    
    // Save current resume data with new template
    const currentData = this.storageService.loadCurrentResume();
    if (currentData) {
      this.storageService.saveCurrentResume(currentData, templateId);
    }
  }

  loadRecentResume(resume: any): void {
    // Load the resume data and template
    this.storageService.saveCurrentResume(resume.data, resume.template);
    this.selectedTemplate = resume.template;
    this.templateSelected.emit(resume.template);
    
    // Update template service
    this.templateService.setSelectedTemplate(resume.template);
    
    // Save template selection to localStorage
    localStorage.setItem('selected_template', resume.template);
    
    // Navigate to preview to see the loaded resume
    this.router.navigate(['/preview']);
  }

  clearRecentResume(resumeId: string): void {
    this.storageService.deleteResume(resumeId);
    this.recentResumes = this.storageService.getRecentResumes();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  startBuilding(): void {
    this.router.navigate(['/personal-details']);
  }
}
