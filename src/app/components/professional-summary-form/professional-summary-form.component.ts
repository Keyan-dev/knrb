import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ResumeDataService } from '../../services/resume-data.service';

@Component({
  selector: 'app-professional-summary-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './professional-summary-form.component.html',
  styleUrl: './professional-summary-form.component.scss'
})
export class ProfessionalSummaryFormComponent implements OnInit {
  summaryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    this.summaryForm = this.fb.group({
      summary: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  ngOnInit(): void {
    const currentData = this.resumeDataService.getCurrentResumeData().professionalSummary;
    this.summaryForm.patchValue(currentData);

    // Subscribe to form changes and update service
    this.summaryForm.valueChanges.subscribe(() => {
      this.updateResumeData();
    });
  }

  private updateResumeData(): void {
    if (this.summaryForm.valid) {
      this.resumeDataService.updateProfessionalSummary(this.summaryForm.value);
    }
  }

  getErrorMessage(): string {
    const field = this.summaryForm.get('summary');
    if (field?.hasError('required')) {
      return 'Professional summary is required';
    }
    if (field?.hasError('minlength')) {
      return `Summary must be at least ${field.errors?.['minlength'].requiredLength} characters long`;
    }
    return '';
  }
}
