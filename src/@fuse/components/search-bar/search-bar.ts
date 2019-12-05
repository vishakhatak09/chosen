export interface JobModel {
    title: string;
    description: string;
    company: string;
    location: string;
    time: any;
    jobType: 'Full-Time' | 'Part-Time';
    logo: string;
}
