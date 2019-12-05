import {
    Component,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    SimpleChanges,
    ElementRef
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { ResumeMock } from 'core/mock/resume.mock';
import { AdditionalModel, EducationModel, SkillRating, TemplateModel, WorkModel, SocialModel } from 'core/models/resumebuilder.model';
import { ResumeBuilderService } from '../resumebuilder.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-resume-template',
    templateUrl: './resumetemplate.component.html',
    // template: `
    // <div  [innerHTML]="content">
    // </div>
    // `,
    styleUrls: ['./resumetemplate.component.scss'],
    // styles: [],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ResumeTemplateComponent implements OnInit, OnChanges {

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
    // templateForm: any;
    // experienceData = [];
    // careerObjective: any;
    // educationData = [];
    // skillData = [];
    // additionalInfo = [];
    // socialData = [];
    // profileSrc: any;
    // content: any;
    // skillMockData = [];
    @Input() fontColor: string;
    @Input() backColor: string;


    /**
     * Constructor
     * @param domsanitizer DomSanitizer
     * @param resumeBuilderService ResumeBuilderService
     */
    constructor(
        private domsanitizer: DomSanitizer,
        private resumeBuilderService: ResumeBuilderService,
        private cdRef: ChangeDetectorRef,
        public hostElement: ElementRef
    ) {
        // if (this.content) {
        //     this.content = this.domsanitizer.bypassSecurityTrustHtml(this.content);
        // }
    }

    // Disable ctrl + p, ctrl + c,  ctrl + v,  ctrl + x
    // @HostListener('document:keydown', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     if (event.ctrlKey &&
    //         // tslint:disable-next-line: deprecation
    //         (event.key === 'p' || event.charCode === 16 || event.charCode === 112 || event.keyCode === 80 ||
    //             event.key === 'c' || event.key === 'x')
    //     ) {
    //         event.cancelBubble = true;
    //         event.preventDefault();
    //         event.stopImmediatePropagation();
    //     }
    // }

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
        // this.resumeBuilderService.templateData
        //     .subscribe((matData: any) => {
        //         if (matData) {

        //             if (matData.templateContent) {
        //                 this.content = matData.templateContent;
        //                 this.safeInnerHtml = this.getInnerHTMLValue();
        //             }
        //             if (matData.templateForm) {
        //                 this.templateForm = matData.templateForm;
        //             }
        //             if (matData.careerObjective) {
        //                 this.careerObjective = matData.careerObjective;
        //             }
        //             if (matData.experienceData) {
        //                 this.experienceData = matData.experienceData;
        //             }
        //             if (matData.additionalInfo) {
        //                 this.additionalInfo = matData.additionalInfo;
        //             }
        //             if (matData.socialData) {
        //                 this.socialData = matData.socialData;
        //             }
        //             if (matData.profileSrc) {
        //                 this.profileSrc = matData.profileSrc;
        //             }
        //             if (matData.skillData) {
        //                 this.skillData = matData.skillData;
        //             }
        //         }
        //     });

    }

    /**
     * On Changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Sanitize editor html
        // if ( changes.careerObjective && changes.careerObjective.currentValue && changes.careerObjective.currentValue !== '') {
        //     this.careerObjective = this.domsanitizer.bypassSecurityTrustHtml(
        //         String(changes.careerObjective.currentValue)
        //     );
        // }
        // this.setElementValues();
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
        if (!this.fontColor) {
            this.fontColor = 'rgba(0, 0, 0, 0.87)';
        }
        if (!this.backColor) {
            this.backColor = '#e0e0e0';
        }
        const additionalDataList = _.clone(this.additionalInfo);
        this.additionalList = additionalDataList.filter((info) => {
            if (info.type.toLowerCase() === 'accomplishments' || info.type.toLowerCase() === 'affiliations') {
                if (info.value && info.value['changingThisBreaksApplicationSecurity']) {
                    info.value = info.value['changingThisBreaksApplicationSecurity']['changingThisBreaksApplicationSecurity'];
                }
            }
            return info;
        });
    }

    // getInnerHTMLValue() {
    //     return this.domsanitizer.bypassSecurityTrustHtml(
    //         String(this.content)
    //     );
    // }

}
