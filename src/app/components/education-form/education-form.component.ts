import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ResumeDataService } from '../../services/resume-data.service';
import { Education } from '../../models/resume-data.interface';

@Component({
  selector: 'app-education-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './education-form.component.html',
  styleUrl: './education-form.component.scss'
})
export class EducationFormComponent implements OnInit {
  educationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    this.educationForm = this.fb.group({
      education: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const currentData = this.resumeDataService.getCurrentResumeData().education;
    
    if (currentData.length === 0) {
      this.addEducation();
    } else {
      currentData.forEach(education => {
        this.addEducation(education);
      });
    }

    // Subscribe to form changes and update service
    this.educationForm.valueChanges.subscribe(() => {
      this.updateResumeData();
    });
  }

  get education(): FormArray {
    return this.educationForm.get('education') as FormArray;
  }

  createEducation(education?: Education): FormGroup {
    return this.fb.group({
      degree: [education?.degree || '', Validators.required],
      institution: [education?.institution || '', Validators.required],
      location: [education?.location || ''],
      startYear: [education?.startYear || '', Validators.required],
      endYear: [education?.endYear || '', Validators.required],
      cgpa: [education?.cgpa || '']
    });
  }

  addEducation(education?: Education): void {
    this.education.push(this.createEducation(education));
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
    this.updateResumeData();
  }

  private updateResumeData(): void {
    if (this.educationForm.valid) {
      const education: Education[] = this.education.value.map((edu: any) => ({
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        startYear: parseInt(edu.startYear),
        endYear: parseInt(edu.endYear),
        cgpa: edu.cgpa
      }));
      this.resumeDataService.updateEducation(education);
    }
  }
}
