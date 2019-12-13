export interface JobModel {jobPosition: string;
    jobDescription: string;
    state: string;
    location: string;
    companyName: string;
    keywords: string;
    workExperience: string;
    expectedSalary: string;
    industry: string;
    jobCategory: string;
    jobType: string;
    logo?: string;
    email: string;
}

export interface CityModel {
    id: string;
    city: string;
}
