import { TemplateModel } from 'core/models/resumebuilder.model';
import * as moment from 'moment';

export class ResumeMock {
    public static data: TemplateModel = {
        firstName: 'John',
        lastName: 'Doe',
        contactNumber: '111-222-3333',
        email: 'john.doe@gmail.com',
        fullAddress: 'Lorem ipsum dolor met ',
        designation: 'developer',
        dateOfBirth: null,
        placeOfBirth: '',
        gender: '',
        linkedInUrl: '',
        twitterUrl: '',
        careerObjective: `I am a front-end developer with more than 3 years of experience writing html, css, and js. I'm
        motivated, result-focused and seeking a successful team-oriented company with opportunity to grow.`,
        professionalExperience: `<div class="section__list">
                <div class="section__list-item">
                    <div class="left">
                        <div class="name">KlowdBox</div>
                        <div class="addr">San Fr, CA</div>
                        <div class="duration">Jan 2011 - Feb 2015</div>
                    </div>
                    <div class="right">
                        <div class="name">Fr developer</div>
                        <div class="desc">did This and that</div>
                    </div>
                </div>
                <div class="section__list-item">
                    <div class="left">
                        <div class="name">Akount</div>
                        <div class="addr">San Monica, CA</div>
                        <div class="duration">Jan 2011 - Feb 2015</div>
                    </div>
                    <div class="right">
                        <div class="name">Fr developer</div>
                        <div class="desc">did This and that</div>
                    </div>
                </div>
            </div>`,
        educationHistory: `<div class="section__list">
                            <div class="section__list-item">
                                <div class="left">
                                    <div class="name">Sample Institute of technology</div>
                                    <div class="addr">San Fr, CA</div>
                                    <div class="duration">Jan 2011 - Feb 2015</div>
                                </div>
                                <div class="right">
                                    <div class="name">Fr developer</div>
                                    <div class="desc">did This and that</div>
                                </div>
                            </div>
                            <div class="section__list-item">
                                <div class="left">
                                    <div class="name">Akount</div>
                                    <div class="addr">San Monica, CA</div>
                                    <div class="duration">Jan 2011 - Feb 2015</div>
                                </div>
                                <div class="right">
                                    <div class="name">Fr developer</div>
                                    <div class="desc">did This and that</div>
                                </div>
                            </div>
                        </div>`,
        languages: ['English'],
        references: '',
        skillType: '',
        ratingType: '',
        skills: [
            {
                skillName: 'Sample Skill',
                ratings: 3,
            },
            {
                skillName: 'Sample Skill 2',
                ratings: 2,
            },
        ],
        profileSrc: 'assets/images/logos/profile.jpg',
    };
    public static templateForm = {
        firstName: 'John',
        lastName: 'Doe',
        contactNumber: '111-222-3333',
        email: 'john.doe@gmail.com',
        fullAddress: 'Lorem ipsum dolor met ',
    };
    public static experienceData = [
        {
            companyName: 'Sample Company',
            location: 'San Fransisco',
            designation: 'Frontend developer',
            joiningDate: moment(),
            leavingDate: moment().year(moment().year() + 1),
            isTillDate: false,
        },
        {
            companyName: 'Sample Company',
            location: 'San Fransisco',
            designation: 'Frontend developer',
            joiningDate: moment(),
            leavingDate: moment().year(moment().year() + 1),
            isTillDate: false,
        },
    ];
    public static educationData = [
        {
            collegeName: 'Sample College',
            universityName: 'Sample university',
            courseName: 'Course',
            yearOfPassing: moment(),
            isCurrentlyPursuing: false,
        },
        {
            collegeName: 'Sample College',
            universityName: 'Sample university',
            courseName: 'Course',
            yearOfPassing: moment(),
            isCurrentlyPursuing: false,
        },
    ];
    public static skillData = [
        {
            skillName: 'HTML5',
            ratings: 5,
        },
        {
            skillName: 'CSS3',
            ratings: 4,
        }
    ];
}
