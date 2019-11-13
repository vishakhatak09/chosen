import { Component, HostListener, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { ResumeMock } from 'core/mock/resume.mock';
import { AdditionalModel, EducationModel, SkillRating, TemplateModel, WorkModel, SocialModel } from 'core/models/resumebuilder.model';
import { environment } from 'environments/environment';
import { ResumeBuilderService } from '../resumebuilder.service';

@Component({
    selector: 'app-resume-template',
    templateUrl: './resumetemplate.component.html',
    styleUrls: ['./resumetemplate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ResumeTemplateComponent implements OnInit, OnChanges {

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
    @Input() content;

    /**
     * Constructor
     * @param domsanitizer DomSanitizer
     * @param resumeBuilderService ResumeBuilderService
     */
    constructor(
        private domsanitizer: DomSanitizer,
        private resumeBuilderService: ResumeBuilderService
    ) { }

    // Disable ctrl + p, ctrl + c,  ctrl + v,  ctrl + x
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.ctrlKey &&
            // tslint:disable-next-line: deprecation
            (event.key === 'p' || event.charCode === 16 || event.charCode === 112 || event.keyCode === 80 ||
                event.key === 'c' || event.key === 'x')
        ) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    // Disable right click menu open
    @HostListener('contextmenu', ['$event'])
    onRightClick(event: KeyboardEvent) {
        event.preventDefault();
    }

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
