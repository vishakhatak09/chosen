import { Component, OnInit, OnChanges, Input, ElementRef, HostListener, SimpleChanges } from '@angular/core';
import { ResumeMock } from 'core/mock/resume.mock';
import { TemplateModel, SkillRating, WorkModel, EducationModel, AdditionalModel, SocialModel } from 'core/models/resumebuilder.model';
import { SafeHtml } from '@angular/platform-browser';
import { ResumeBuilderService } from '../resumebuilder.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-resume-professional',
  templateUrl: './resume-professional.component.html',
  styleUrls: ['./resume-professional.component.scss']
})
export class ResumeProfessionalComponent implements OnInit, OnChanges {

  public str = String;
    public Arr = Array;
    public ratingMax = 5;
    public MockData = ResumeMock.data;

    @Input() templateForm: TemplateModel;
    @Input() skillData: SkillRating[] = [];
    @Input() experienceData: WorkModel[] = [];
    @Input() careerObjective: string | SafeHtml;
    @Input() educationData: EducationModel[] = [];
    @Input() additionalInfo: AdditionalModel[] = [];
    @Input() public profileSrc: string | ArrayBuffer;
    @Input() socialData: SocialModel[] = [];
    @Input() userEmail: string;
    // Template content
    @Input() content: string;

    public safeInnerHtml: SafeHtml;
    public safeInnerCareerHtml: SafeHtml;
    public ResumeMockData = ResumeMock;
    public experienceList: WorkModel[] = [];
    public careerObj: string | SafeHtml;
    public educationList: EducationModel[] = [];
    public skillList: SkillRating[] = [];
    public additionalList: AdditionalModel[] = [];
    @Input() fontColor: string;
    @Input() backColor: string;


    /**
     * Constructor
     * @param domsanitizer DomSanitizer
     * @param resumeBuilderService ResumeBuilderService
     */
    constructor(
        private resumeBuilderService: ResumeBuilderService,
        public hostElement: ElementRef
    ) {
    }

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
    }

    /**
     * On Changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (this.experienceData.length === 0) {
            this.experienceList = ResumeMock.experienceData;
        } else {
            this.experienceList = this.experienceData;
        }
        if (this.careerObjective === undefined || this.careerObjective === '') {
            this.careerObj = ResumeMock.data.careerObjective;
        } else {
            this.careerObj = this.careerObjective;
        }
        if (this.educationData.length === 0) {
            this.educationList = ResumeMock.educationData;
        } else {
            this.educationList = this.educationData;
        }
        if (this.skillData.length === 0) {
            this.skillList = ResumeMock.skillData;
        } else {
            this.skillList = this.skillData;
        }
        // if (!this.fontColor) {
        //     this.fontColor = 'rgba(0, 0, 0, 0.87)';
        // }
        // if (!this.backColor) {
        //     this.backColor = '#e0e0e0';
        // }
        this.fontColor = 'black';
        this.backColor = '';
        const additionalDataList = _.clone(this.additionalInfo);
        this.additionalList = additionalDataList;
    }

}
