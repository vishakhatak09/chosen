import { Component, OnInit, ViewEncapsulation, Input, OnChanges, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TemplateModel } from 'core/models/resumebuilder.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResumeBuilderService } from '../resumebuilder.service';

@Component({
    selector: 'app-resume-template',
    templateUrl: './resumetemplate.component.html',
    styleUrls: ['./resumetemplate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ResumeTemplateComponent implements OnInit, OnChanges {

    @Input() templateForm: TemplateModel;
    @Input() skillData: any;
    public str = String;

    /**
     * Constructor
     * @param domsanitizer DomSanitizer
     */
    constructor(
        private domsanitizer: DomSanitizer,
        private resumeBuilderService: ResumeBuilderService
    ) {
        // if (matData) {
        //     if (this.matData.formData) {
        //         this.templateForm = matData.formData;
        //     }
        //     if (this.matData.skillData) {
        //         this.skillData = matData.skillData;
        //     }
        // }
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
                    if (matData.formData) {
                        this.templateForm = matData.formData;
                    }
                    if (matData.skillData) {
                        this.skillData = matData.skillData;
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

        if (this.templateForm.careerObjective && this.templateForm.careerObjective !== '') {
            this.templateForm.careerObjective = this.domsanitizer.bypassSecurityTrustHtml(
                String(this.templateForm.careerObjective)
            );
        }

        if (this.templateForm.educationHistory && this.templateForm.educationHistory !== '') {
            this.templateForm.educationHistory = this.domsanitizer.bypassSecurityTrustHtml(
                String(this.templateForm.educationHistory)
            );
        }
    }
}
