import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Resume Builder';

  steps = [
    { label: 'Template', route: '/template-selector', icon: 'palette',headerText:'Choose Template' },
    { label: 'Personal Details', route: '/personal-details', icon: 'person', headerText:'Personal Details' },
    { label: 'Professional Summary', route: '/professional-summary', icon: 'description', headerText:'Professional Summary' },
    { label: 'Skills', route: '/skills', icon: 'build', headerText:'Skills' },
    { label: 'Experience', route: '/experience', icon: 'work', headerText:'Work Experience' },
    { label: 'Certifications', route: '/certifications', icon: 'school', headerText:'Certifications' },
    { label: 'Education', route: '/education', icon: 'menu_book', headerText:'Education Details' },
    { label: 'Preview', route: '/preview', icon: 'preview' ,headerText:'Resume Preview'},
  ];

  constructor(private router: Router) {}

  navigateToStep(route: string): void {
    this.router.navigate([route]);
  }

  getCurrentStep(): number {
    const currentRoute = this.router.url;
    const stepIndex = this.steps.findIndex(step => step.route === currentRoute);
    console.log("Current Step Index:", stepIndex);
    return stepIndex >= 0 ? stepIndex : 0;
  }
}
