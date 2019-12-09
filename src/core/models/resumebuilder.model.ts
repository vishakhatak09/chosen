import { Moment } from 'moment';
import { SafeHtml } from '@angular/platform-browser';

export interface SkillWithBox {
    skillName: string;
}

export interface SkillRating {
    skillName: string;
    ratings?: number;
    _id?: string;
}

export interface TemplateModel {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    fullAddress: string;
    designation: string;
    dateOfBirth: Moment;
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
    profileSrc?: string | ArrayBuffer;
}


export class WorkModel {
    companyName: string;
    location: string;
    designation: string;
    joiningDate: any;
    leavingDate: any;
    isTillDate?: boolean;
    _id: string;
}

export class EducationModel {
    collegeName: string;
    universityName: string;
    courseName: string;
    yearOfPassing: any;
    isCurrentlyPursuing?: boolean;
    _id?: string;
}

export interface SocialModel {
    website: string;
    link: string;
    _id?: string;
}

export interface AdditionalModel {
    type: string;
    value: any;
    _id?: string;
}

export interface MyResumesModel {
    additionalInfo: AdditionalModel[];
    careerObjective: string;
    createdAt: string;
    educationHistory: EducationModel[];
    personalInfo: {
        contactNumber: string;
        dateOfBirth: string;
        email: string;
        firstName: string;
        fullAddress: string;
        gender: 'female' | 'male';
        lastName: string;
        maritalStatus: 'unmarried' | 'married';
        placeOfBirth: string;
        profileImage: string;
        socialLinks: SocialModel[],
        templateImage?: string;
        designation: string;
    };
    skills: SkillRating[];
    status: string;
    templateId: string;
    updatedAt: string;
    userId: string;
    workExperience: WorkModel[];
    _id: string;
}
