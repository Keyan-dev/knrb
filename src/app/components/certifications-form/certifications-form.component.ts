import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ResumeDataService } from '../../services/resume-data.service';
import { Certification } from '../../models/resume-data.interface';

@Component({
  selector: 'app-certifications-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './certifications-form.component.html',
  styleUrl: './certifications-form.component.scss'
})
export class CertificationsFormComponent implements OnInit {
  certificationsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    this.certificationsForm = this.fb.group({
      certifications: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const currentData = this.resumeDataService.getCurrentResumeData().certifications;
    
    if (currentData.length === 0) {
      this.addCertification();
    } else {
      currentData.forEach(certification => {
        this.addCertification(certification);
      });
    }

    // Subscribe to form changes and update service
    this.certificationsForm.valueChanges.subscribe(() => {
      this.updateResumeData();
    });
  }

  get certifications(): FormArray {
    return this.certificationsForm.get('certifications') as FormArray;
  }

  createCertification(certification?: Certification): FormGroup {
    return this.fb.group({
      certificationName: [certification?.certificationName || '', Validators.required],
      issuingOrganization: [certification?.issuingOrganization || '', Validators.required],
      dateIssued: [certification?.dateIssued || '', Validators.required],
      description: [certification?.description || '']
    });
  }

  addCertification(certification?: Certification): void {
    this.certifications.push(this.createCertification(certification));
  }

  removeCertification(index: number): void {
    this.certifications.removeAt(index);
    this.updateResumeData();
  }

  private updateResumeData(): void {
    if (this.certificationsForm.valid) {
      const certifications: Certification[] = this.certifications.value.map((cert: any) => ({
        certificationName: cert.certificationName,
        issuingOrganization: cert.issuingOrganization,
        dateIssued: new Date(cert.dateIssued),
        description: cert.description
      }));
      this.resumeDataService.updateCertifications(certifications);
    }
  }
}
