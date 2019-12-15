export interface JobModel {jobPosition: string;
    jobDescription: string;
    state: string;
    location: string;
    companyName: string;
    keywords: string;
    workExperience: any[];
    expectedSalary: string[];
    industry: string;
    jobCategory: string;
    jobType: string;
    logo?: string;
    email: string;
    image?: string;
}

export interface CityModel {
    id: string;
    city: string;
}
