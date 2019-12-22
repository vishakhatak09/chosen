export interface JobModel {
    jobPosition: string;
    jobDescription: string;
    state: string;
    location: string;
    companyName: string;
    keywords: string;
    workExperience: any[];
    expectedSalary: string[];
    startSalary?: string;
    endSalary?: string;
    industry: string;
    jobCategory: string;
    jobType: string;
    logo?: string;
    email: string;
    image?: string;
    startworkExperience?: {
        years: string;
        month: string;
    };
    endworkExperience?: {
        years: string;
        month: string;
    };
    _id: string;
}

export interface CityModel {
    id: string;
    city: string;
}
