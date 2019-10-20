import { Component, OnInit, ViewEncapsulation, Input, OnChanges, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TemplateModel, WorkModel, EducationModel, SkillRating } from 'core/models/resumebuilder.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResumeBuilderService } from '../resumebuilder.service';
import { environment } from 'environments/environment';
import { ResumeMock } from 'core/mock/resume.mock';

@Component({
    selector: 'app-resume-template',
    templateUrl: './resumetemplate.component.html',
    styleUrls: ['./resumetemplate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ResumeTemplateComponent implements OnInit, OnChanges {

    public str = String;
    public defaultProfile = environment.baseUrl + 'assets/images/avatars/profile.jpg';
    public Arr = Array;
    public ratingMax = 5;
    public skillMockData = ResumeMock.data;

    @Input() templateForm: TemplateModel;
    @Input() skillData: SkillRating[];
    @Input() experienceData: WorkModel[] = [];
    @Input() careerObjective: string;
    @Input() educationData: EducationModel[] = [];
    @Input() public profileSrc: string | ArrayBuffer = this.defaultProfile;

    /**
     * Constructor
     * @param domsanitizer DomSanitizer
     */
    constructor(
        private domsanitizer: DomSanitizer,
        private resumeBuilderService: ResumeBuilderService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

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

        // if (this.templateForm.careerObjective && this.templateForm.careerObjective !== '') {
        //     this.templateForm.careerObjective = this.domsanitizer.bypassSecurityTrustHtml(
        //         String(this.templateForm.careerObjective)
        //     );
        // }

        // if (this.templateForm.educationHistory && this.templateForm.educationHistory !== '') {
        //     this.templateForm.educationHistory = this.domsanitizer.bypassSecurityTrustHtml(
        //         String(this.templateForm.educationHistory)
        //     );
        // }

    }
}
