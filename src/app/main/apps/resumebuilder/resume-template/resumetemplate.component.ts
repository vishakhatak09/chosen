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

@Component({
    selector: 'app-resume-template',
    // templateUrl: './resumetemplate.component.html',
    template: `
    <div  [innerHTML]="content">
    </div>
    `,
    // styleUrls: ['./resumetemplate.component.scss'],
    styles: [],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ResumeTemplateComponent implements OnInit, OnChanges {

    // public str = String;
    // public Arr = Array;
    // public ratingMax = 5;
    // public MockData = ResumeMock.data;

    // @Input() templateForm: TemplateModel;
    // @Input() skillData: SkillRating[];
    // @Input() experienceData: WorkModel[] = [];
    // @Input() careerObjective: string;
    // @Input() educationData: EducationModel[] = [];
    // @Input() additionalInfo: AdditionalModel[] = [];
    // @Input() public profileSrc: string | ArrayBuffer;
    // @Input() socialData: SocialModel[] = [];
    // // Template content
    // @Input() content: string;

    // public safeInnerHtml: SafeHtml;
    // public safeInnerCareerHtml: SafeHtml;
    templateForm: any;
    experienceData = [];
    careerObjective: any;
    educationData = [];
    skillData = [];
    additionalInfo = [];
    socialData = [];
    profileSrc: any;
    content: any;
    skillMockData = [];
    fontColor: string;
    backColor: string;


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
        if (this.content) {
            this.content = this.domsanitizer.bypassSecurityTrustHtml(this.content);
        }
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
    }

    // getInnerHTMLValue() {
    //     return this.domsanitizer.bypassSecurityTrustHtml(
    //         String(this.content)
    //     );
    // }

    // setElementValues(): void {
    //     if (this.templateForm) {
    //         const firstName = document.getElementById('firstName') as HTMLElement;
    //         const lastName = document.getElementById('lastName') as HTMLElement;
    //         const profileSrc: any = document.getElementById('profileSrc');
    //         const email = document.getElementById('email') as HTMLElement;
    //         const contactNumber = document.getElementById('contactNumber') as HTMLElement;
    //         const fullAddress = document.getElementById('fullAddress') as HTMLElement;
    //         const careerObjective: any = document.getElementById('careerObjective') as HTMLElement;
    //         if (firstName) {
    //             firstName.innerHTML = this.templateForm.firstName || this.MockData.firstName;
    //         }
    //         if (lastName) {
    //             lastName.innerHTML = this.templateForm.lastName || this.MockData.lastName;
    //         }
    //         if (profileSrc) {
    //             profileSrc.src = this.profileSrc || this.MockData.profileSrc;
    //         }
    //         if (email) {
    //             email.innerHTML = this.templateForm.email || this.MockData.email;
    //         }
    //         if (contactNumber) {
    //             contactNumber.innerHTML = this.templateForm.contactNumber || this.MockData.contactNumber;
    //         }
    //         if (fullAddress) {
    //             fullAddress.innerHTML = this.templateForm.fullAddress || this.MockData.fullAddress;
    //         }
    //         if (careerObjective) {
    //             // this.safeInnerCareerHtml = this.domsanitizer.bypassSecurityTrustHtml(
    //             //     String(this.careerObjective || this.MockData.careerObjective)
    //             // );
    //             careerObjective.innerHTML = this.careerObjective || this.MockData.careerObjective;
    //         }
    //     }
    // }
}
