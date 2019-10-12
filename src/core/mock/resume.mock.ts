import { TemplateModel } from 'core/models/resumebuilder.model';

export class ResumeMock {
    public static data: TemplateModel = {
        firstName: 'John',
        lastName: 'Doe',
        contactNumber: '111-222-3333',
        email:  'john.doe@gmail.com',
        fullAddress:  '',
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
    };
}
