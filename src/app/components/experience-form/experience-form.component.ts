import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResumeDataService } from '../../services/resume-data.service';
import { Experience } from '../../models/resume-data.interface';

@Component({
  selector: 'app-experience-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss'
})
export class ExperienceFormComponent implements OnInit {
  experienceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    this.experienceForm = this.fb.group({
      experiences: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const currentData = this.resumeDataService.getCurrentResumeData().experience;
    
    if (currentData.length === 0) {
      this.addExperience();
    } else {
      currentData.forEach(experience => {
        this.addExperience(experience);
      });
    }

    // Subscribe to form changes and update service
    this.experienceForm.valueChanges.subscribe(() => {
      this.updateResumeData();
    });
  }

  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }

  createExperience(experience?: Experience): FormGroup {
    const isPresent = experience?.endDate === 'Present';
    
    return this.fb.group({
      jobTitle: [experience?.jobTitle || '', Validators.required],
      companyName: [experience?.companyName || '', Validators.required],
      location: [experience?.location || ''],
      startDate: [experience?.startDate || '', Validators.required],
      endDate: [isPresent ? '' : experience?.endDate || '', Validators.required],
      isPresent: [isPresent],
      description: [experience?.description || '', Validators.required]
    });
  }

  addExperience(experience?: Experience): void {
    this.experiences.push(this.createExperience(experience));
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
    this.updateResumeData();
  }

  onPresentCheckboxChange(index: number, isChecked: boolean): void {
    const experience = this.experiences.at(index);
    if (isChecked) {
      experience.get('endDate')?.setValue('');
      experience.get('endDate')?.clearValidators();
    } else {
      experience.get('endDate')?.setValidators([Validators.required]);
    }
    experience.get('endDate')?.updateValueAndValidity();
  }

  private updateResumeData(): void {
    if (this.experienceForm.valid) {
      const experiences: Experience[] = this.experiences.value.map((exp: any) => ({
        jobTitle: exp.jobTitle,
        companyName: exp.companyName,
        location: exp.location,
        startDate: new Date(exp.startDate),
        endDate: exp.isPresent ? 'Present' : new Date(exp.endDate),
        description: exp.description
      }));
      this.resumeDataService.updateExperience(experiences);
    }
  }
}
