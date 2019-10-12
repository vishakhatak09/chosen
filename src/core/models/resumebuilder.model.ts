import { Moment } from 'moment';
import { SafeHtml } from '@angular/platform-browser';

export interface SkillWithBox {
    skillName: string;
}

export interface SkillRating {
    skillName: string;
    ratings: number;
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
}
