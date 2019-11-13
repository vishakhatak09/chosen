export const mockTemplate = `
<div class="template-container" *ngIf="templateForm">
    <div class="template-header">

        <div class="full-name">
            <span class="first-name" *ngIf="templateForm.firstName != ''" [innerHTML]="templateForm.firstName"></span>
            <span class="first-name" *ngIf="templateForm.firstName == ''">John</span>
            <span class="last-name" *ngIf="templateForm.lastName != ''" [innerHTML]="templateForm.lastName"></span>
            <span class="last-name" *ngIf="templateForm.lastName == ''">Doe</span>
            <img *ngIf="profileSrc" [src]="profileSrc" style="float: right;border-radius: 100%;">
        </div>
        <div class="contact-info">
            <span class="email">Email: </span>
            <span class="email-val" *ngIf="templateForm.email != ''" [innerHTML]="templateForm.email"></span>
            <span class="email-val" *ngIf="templateForm.email == ''">john.doe@gmail.com</span>
            <span class="separator"></span>
            <span class="phone">Phone: </span>
            <span class="phone-val" *ngIf="templateForm.contactNumber != ''"
                [innerHTML]="templateForm.contactNumber"></span>
            <span class="phone-val" *ngIf="templateForm.contactNumber == ''">1112223333</span>
        </div>

        <div class="address">
            <span class="email">Address: </span>
            <span class="desc" *ngIf="templateForm.fullAddress == ''">
                KlowdBox, San Fr, CA
            </span>
            <span class="desc" *ngIf="templateForm.fullAddress != ''" [innerHTML]="templateForm.fullAddress"></span>
        </div>

        <div class="contact-info" *ngFor="let social of socialData">
            <span class="email" [innerHTML]="social.website"></span>: 
            <span class="email-val" [innerHTML]="social.link"></span>
        </div>

    </div>
    <div class="details">
        <div class="template-section">
            <div class="section__list" *ngIf="careerObjective" [innerHTML]="careerObjective">
            </div>
            <div class="section__list" *ngIf="!careerObjective">
                I am a front-end developer with more than 3 years of experience writing html, css, and js. I'm
                motivated, result-focused and seeking a successful team-oriented company with opportunity to grow.
            </div>
        </div>
        <div class="template-section">
            <div class="section__title">Experience</div>
            <div class="section__list" *ngIf="experienceData && experienceData.length > 0">
                <div class="section__list-item" *ngFor="let work of experienceData">
                    <div class="left">
                        <div class="name" [innerHTML]="work.designation"></div>
                        <div class="addr" [innerHTML]="work.companyName"></div>
                        <div class="addr" [innerHTML]="work.location"></div>
                        <div class="duration" [innerHTML]=" work.joiningDate | date: 'LLLL yyyy' -  work.leavingDate | date: 'LLLL yyyy'">
                            <!-- {{ work.joiningDate | date: 'LLLL yyyy' }} -
                            {{ work.leavingDate | date: 'LLLL yyyy' }} -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="section__list" *ngIf="!experienceData || experienceData.length == 0">
                <div class="section__list-item">
                    <div class="left">
                        <div class="name">Fr developer</div>
                        <div class="addr">KlowdBox</div>
                        <div class="addr">San Fr, CA</div>
                        <div class="duration">
                            Jan 2011 - Feb 2015
                        </div>
                    </div>
                </div>
                <div class="section__list-item">
                    <div class="left">
                        <div class="name">Fr developer</div>
                        <div class="addr">KlowdBox</div>
                        <div class="addr">San Fr, CA</div>
                        <div class="duration">
                            Jan 2011 - Feb 2015
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="template-section">
            <div class="section__title">Education</div>
            <div class="section__list" *ngIf="!educationData || educationData.length == 0">
                <div class="section__list-item">
                    <div class="left">
                        <div class="name">Bachelor of Engineering</div>
                        <div class="addr">Sample Institute of technology</div>
                        <div class="addr">Univerisity of SA</div>
                        <div class="duration">2011</div>
                    </div>
                </div>
                <div class="section__list-item">
                    <div class="left">
                        <div class="name">Bachelor of Engineering</div>
                        <div class="addr">Sample Institute of technology</div>
                        <div class="addr">Univerisity of SA</div>
                        <div class="duration">2011</div>
                    </div>
                </div>
            </div>
            <div class="section__list" *ngIf="educationData && educationData.length > 0">
                <div class="section__list-item" *ngFor="let item of educationData">
                    <div class="left">
                        <div class="name" [innerHTML]="item.courseName"></div>
                        <div class="addr" [innerHTML]="item.collegeName"></div>
                        <div class="addr" [innerHTML]="item.universityName"></div>
                        <div class="duration" [innerHTML]="item.yearOfPassing | date: 'yyyy'"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="template-section">
            <div class="section__title">Skills</div>
            <ng-container *ngIf="skillData && skillData.length > 0; else mockTemplate">
                <div class="skills" *ngFor="let skill of skillData">
                    <div class="skills__item">
                        <div class="left">
                            <div class="name" [innerHTML]="skill.skillName">
                            </div>
                        </div>
                        <div class="right">
                            <ng-container *ngFor="let i of Arr(ratingMax); let ind = index">
                                <input [id]="skill.skillName + ind" type="checkbox" [disabled]="true"
                                    [checked]="(ind + 1) <= skill.ratings" />
                                <label [for]="skill.skillName + ind"></label>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </ng-container>
            <ng-template #mockTemplate>
                <div class="skills" *ngFor="let skill of skillMockData.skills">
                    <div class="skills__item">
                        <div class="left">
                            <div class="name" [innerHTML]="skill.skillName">
                            </div>
                        </div>
                        <div class="right">
                            <ng-container *ngFor="let i of Arr(ratingMax); let ind = index">
                                <input [id]="skill.skillName + ind" type="checkbox"
                                    [disabled]="true" [checked]="(ind + 1) <= skill.ratings" />
                                <label [for]="skill.skillName + ind"></label>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </ng-template>
        </div>
        <ng-container *ngIf="additionalInfo.length > 0">
            <div class="template-section" *ngFor="let item of additionalInfo">
                <div class="section__title" [innerHTML]="item.type">
                </div>
                <div class="section__list">
                    <div class="section__list-item" [innerHTML]="item.value">
                    </div>
                </div>
            </div>
        </ng-container>
    </div>
</div>`;
