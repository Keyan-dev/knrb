import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ResumeData } from '../models/resume-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  async exportToPDF(elementId: string, filename: string = 'resume.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }

  async exportToDOCX(resumeData: ResumeData, filename: string = 'resume.docx'): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Personal Details
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalDetails.name,
                bold: true,
                size: 32,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalDetails.profession,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Contact Information
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${resumeData.personalDetails.email}`,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Phone: ${resumeData.personalDetails.mobileNumber}`,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Professional Summary
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.professionalSummary.summary,
                size: 20,
              }),
            ],
            spacing: { after: 300 },
          }),

          // Skills
          new Paragraph({
            children: [
              new TextRun({
                text: 'SKILLS',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),

          ...resumeData.skills.flatMap(skillCategory => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${skillCategory.category}: ${skillCategory.skills.join(', ')}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          ]),

          new Paragraph({
            children: [
              new TextRun({
                text: '',
                size: 20,
              }),
            ],
            spacing: { after: 300 },
          }),

          // Experience
          new Paragraph({
            children: [
              new TextRun({
                text: 'EXPERIENCE',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),

          ...resumeData.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.jobTitle} | ${exp.companyName}`,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.location ? `${exp.location} | ` : ''}${this.formatDate(exp.startDate)} – ${exp.endDate === 'Present' ? 'Present' : this.formatDate(exp.endDate as Date)}`,
                  size: 18,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: 20,
                }),
              ],
              spacing: { after: 200 },
            })
          ]),

          // Education
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),

          ...resumeData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree} – ${edu.institution}`,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.location ? `${edu.location} | ` : ''}${edu.startYear} – ${edu.endYear}${edu.cgpa ? ` | ${edu.cgpa}` : ''}`,
                  size: 18,
                }),
              ],
              spacing: { after: 200 },
            })
          ]),

          // Certifications
          ...(resumeData.certifications.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'CERTIFICATIONS & ACHIEVEMENTS',
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            }),

            ...resumeData.certifications.flatMap(cert => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${cert.certificationName} – ${cert.issuingOrganization}, ${this.formatDate(cert.dateIssued)}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 100 },
              })
            ])
          ] : [])
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, filename);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  }
}
