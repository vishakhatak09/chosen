import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { ResumeBuilderService } from 'app/main/apps/resumebuilder/resumebuilder.service';
import { ResumeMock } from 'core/mock/resume.mock';
import {
  AdditionalModel,
  EducationModel,
  SkillRating,
  SocialModel,
  TemplateModel,
  WorkModel
} from 'core/models/resumebuilder.model';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class Template1Component implements OnInit, OnChanges {

  public str = String;
  public Arr = Array;
  public ratingMax = 5;
  public skillMockData = ResumeMock.data;

  @Input() templateForm: TemplateModel;
  @Input() skillData: SkillRating[];
  @Input() experienceData: WorkModel[] = [];
  @Input() careerObjective: string;
  @Input() educationData: EducationModel[] = [];
  @Input() additionalInfo: AdditionalModel[] = [];
  @Input() public profileSrc: string | ArrayBuffer;
  @Input() socialData: SocialModel[] = [];

  // Template content
  @Input() content: string;

  /**
     * Constructor
     * @param domsanitizer DomSanitizer
     * @param resumeBuilderService ResumeBuilderService
     */
  constructor(
    private domsanitizer: DomSanitizer,
    private resumeBuilderService: ResumeBuilderService
  ) { }

  /**
     * On init
     */
  ngOnInit() {

    this.resumeBuilderService.templateData
      .subscribe((matData: any) => {
        if (matData) {
          if (matData.templateForm) {
            this.templateForm = matData.templateForm;
          }
          if (matData.careerObjective) {
            this.careerObjective = matData.careerObjective;
          }
          if (matData.experienceData) {
            this.experienceData = matData.experienceData;
          }
          if (matData.additionalInfo) {
            this.additionalInfo = matData.additionalInfo;
          }
          if (matData.socialData) {
            this.socialData = matData.socialData;
          }
          if (matData.profileSrc) {
            this.profileSrc = matData.profileSrc;
          }
          if (matData.templateContent) {
            this.content = matData.templateContent;
          }
        }
      });

  }

  /**
   * On Changes
   */
  ngOnChanges(): void {
    // Sanitize ckeditor html
    if (this.templateForm.professionalExperience && this.templateForm.professionalExperience !== '') {
      this.templateForm.professionalExperience = this.domsanitizer.bypassSecurityTrustHtml(
        String(this.templateForm.professionalExperience)
      );
    }
  }

}
