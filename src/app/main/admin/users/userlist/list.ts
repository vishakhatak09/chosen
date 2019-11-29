export const USERS = [
    {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@yahoo.com',
        resumes: 2,
        payment: true,
        status: 'Active',
    },
    {
        id: '2',
        name: 'Sarah gratified',
        email: 'sarah.gratified@gmail.com',
        resumes: 4,
        payment: true,
        status: 'Active',
    },
    {
        id: '3',
        name: 'Martis',
        email: 'martis20@gmail.com',
        resumes: 0,
        payment: false,
        status: 'Active',
    },
];

export interface User {
    id: string;
    name: string;
    email: string;
    resumes: number;
    payment: boolean;
    status: string;
}
