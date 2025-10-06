import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/template-selector', pathMatch: 'full' },
  { 
    path: 'template-selector', 
    loadComponent: () => import('./components/template-selector/template-selector.component').then(m => m.TemplateSelectorComponent)
  },
  { 
    path: 'personal-details', 
    loadComponent: () => import('./components/personal-details-form/personal-details-form.component').then(m => m.PersonalDetailsFormComponent)
  },
  { 
    path: 'professional-summary', 
    loadComponent: () => import('./components/professional-summary-form/professional-summary-form.component').then(m => m.ProfessionalSummaryFormComponent)
  },
  { 
    path: 'skills', 
    loadComponent: () => import('./components/skills-form/skills-form.component').then(m => m.SkillsFormComponent)
  },
  { 
    path: 'experience', 
    loadComponent: () => import('./components/experience-form/experience-form.component').then(m => m.ExperienceFormComponent)
  },
  { 
    path: 'certifications', 
    loadComponent: () => import('./components/certifications-form/certifications-form.component').then(m => m.CertificationsFormComponent)
  },
  { 
    path: 'education', 
    loadComponent: () => import('./components/education-form/education-form.component').then(m => m.EducationFormComponent)
  },
  { 
    path: 'preview', 
    loadComponent: () => import('./components/resume-preview/resume-preview.component').then(m => m.ResumePreviewComponent)
  },
  { path: '**', redirectTo: '/personal-details' }
];
