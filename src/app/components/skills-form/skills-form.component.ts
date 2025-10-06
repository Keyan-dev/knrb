import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ResumeDataService } from '../../services/resume-data.service';
import { SkillCategory } from '../../models/resume-data.interface';

@Component({
  selector: 'app-skills-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './skills-form.component.html',
  styleUrl: './skills-form.component.scss'
})
export class SkillsFormComponent implements OnInit {
  skillsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private resumeDataService: ResumeDataService
  ) {
    this.skillsForm = this.fb.group({
      skillCategories: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const currentData = this.resumeDataService.getCurrentResumeData().skills;
    
    if (currentData.length === 0) {
      this.addSkillCategory();
    } else {
      currentData.forEach(skillCategory => {
        this.addSkillCategory(skillCategory);
      });
    }

    // Subscribe to form changes and update service
    this.skillsForm.valueChanges.subscribe(() => {
      this.updateResumeData();
    });
  }

  get skillCategories(): FormArray {
    return this.skillsForm.get('skillCategories') as FormArray;
  }

  createSkillCategory(skillCategory?: SkillCategory): FormGroup {
    const skillsArray = this.fb.array([]);
    
    if (skillCategory) {
      skillCategory.skills.forEach(skill => {
        skillsArray.push(this.fb.control(skill, Validators.required));
      });
    } else {
      skillsArray.push(this.fb.control('', Validators.required));
    }

    return this.fb.group({
      category: [skillCategory?.category || '', Validators.required],
      skills: skillsArray
    });
  }

  addSkillCategory(skillCategory?: SkillCategory): void {
    this.skillCategories.push(this.createSkillCategory(skillCategory));
  }

  removeSkillCategory(index: number): void {
    this.skillCategories.removeAt(index);
    this.updateResumeData();
  }

  getSkills(index: number): FormArray {
    return this.skillCategories.at(index).get('skills') as FormArray;
  }

  addSkill(categoryIndex: number): void {
    const skillsArray = this.getSkills(categoryIndex);
    skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(categoryIndex: number, skillIndex: number): void {
    const skillsArray = this.getSkills(categoryIndex);
    skillsArray.removeAt(skillIndex);
    this.updateResumeData();
  }

  private updateResumeData(): void {
    if (this.skillsForm.valid) {
      const skillCategories: SkillCategory[] = this.skillCategories.value.map((category: any) => ({
        category: category.category,
        skills: category.skills.filter((skill: string) => skill.trim() !== '')
      }));
      this.resumeDataService.updateSkills(skillCategories);
    }
  }
}
