import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ResumeDataService } from '../../services/resume-data.service';
import { PersonalDetails } from '../../models/resume-data.interface';

@Component({
  selector: 'app-personal-details-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './personal-details-form.component.html',
  styleUrl: './personal-details-form.component.scss'
})
export class PersonalDetailsFormComponent implements OnInit {
  personalDetailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    this.personalDetailsForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      profession: ['', [Validators.required, Validators.minLength(2)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      linkedinProfile: ['', Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/)],
      portfolioSite:['', Validators.pattern(/^https?:\/\/.+/)]
    });
  }

  ngOnInit(): void {
    const currentData = this.resumeDataService.getCurrentResumeData().personalDetails;
    
    // Initialize additional links FormArray
    const additionalLinksArray = this.fb.array([]);
    this.personalDetailsForm.addControl('additionalLinks', additionalLinksArray);
    
    // Load additional links
    currentData.additionalLinks.forEach(link => {
      this.addAdditionalLink(link);
    });

    // Patch form with current data
    this.personalDetailsForm.patchValue({
      name: currentData.name,
      profession: currentData.profession,
      mobileNumber: currentData.mobileNumber,
      email: currentData.email,
      linkedinProfile: currentData.linkedinProfile,
      portfolioSite: currentData.portfolioSite
    });

    // Subscribe to form changes and update service
    this.personalDetailsForm.valueChanges.subscribe(() => {
      this.updateResumeData();
    });
  }

  get additionalLinks(): FormArray {
    return this.personalDetailsForm.get('additionalLinks') as FormArray;
  }

  addAdditionalLink(value: string = ''): void {
    const linkControl = this.fb.control(value, Validators.pattern(/^https?:\/\/.+/));
    this.additionalLinks.push(linkControl);
  }

  removeAdditionalLink(index: number): void {
    this.additionalLinks.removeAt(index);
    this.updateResumeData();
  }

  private updateResumeData(): void {
    if (this.personalDetailsForm.valid) {
      const formValue = this.personalDetailsForm.value;
      const personalDetails: PersonalDetails = {
        name: formValue.name,
        profession: formValue.profession,
        mobileNumber: formValue.mobileNumber,
        email: formValue.email,
        linkedinProfile: formValue.linkedinProfile,
        portfolioSite: formValue.portfolioSite,
        additionalLinks: this.additionalLinks.value || []
      };
      this.resumeDataService.updatePersonalDetails(personalDetails);
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personalDetailsForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'mobileNumber') {
        return 'Please enter a valid phone number';
      }
      if (fieldName === 'linkedinProfile') {
        return 'Please enter a valid LinkedIn profile URL';
      }
      return 'Please enter a valid URL';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least ${field.errors?.['minlength'].requiredLength} characters long`;
    }
    return '';
  }
}
