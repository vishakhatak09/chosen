import { Moment } from 'moment';
import { SafeHtml } from '@angular/platform-browser';

export interface SkillWithBox {
    skillName: string;
}

export interface SkillRating {
    skillName: string;
    ratings?: number;
}

export interface TemplateModel {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email:  string;
    fullAddress:  string;
    dateOfBirth:  Moment;
    placeOfBirth: string;
    gender: string;
    linkedInUrl?: string;
    twitterUrl?: string;
    careerObjective: string | SafeHtml;
    professionalExperience?: string | SafeHtml;
    educationHistory: string | SafeHtml;
    languages: string[];
    references: string;
    skillType: string;
    ratingType?: string;
    skills: SkillRating[];
}


export class WorkModel {
    companyName: string;
    location: string;
    designation: string;
    joiningDate: Moment;
    leavingDate: Moment;
    isTillDate: boolean;
}

export class EducationModel {
    collegeName: string;
    universityName: string;
    courseName: string;
    yearOfPassing: Moment;
    isCurrentlyPursuing: boolean;
}

export interface SocialModel {
    website: string;
    link: string;
}

export interface AdditionalModel {
    type: string;
    value: any;
}
