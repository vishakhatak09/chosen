import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'menu',
        title: 'Menu',
        translate: 'NAV.MENU',
        type: 'group',
        icon: 'apps',
        children: [
            {
                id: 'templates',
                title: 'Templates',
                translate: 'NAV.TEMPLATES',
                type: 'item',
                icon: 'folder_open',
                url: '/user/templates'
            },
            {
                id: 'my_resumes',
                title: 'My Resumes',
                translate: 'NAV.MY_RESUMES',
                type: 'item',
                icon: 'folder_shared',
                url: '/user/my-resumes'
            },
            {
                id: 'profile',
                title: 'Profile',
                translate: 'NAV.PROFILE',
                type: 'item',
                icon: 'person',
                url: '/user/profile'
            },
            {
                id: 'jobsearch',
                title: 'Job Search',
                translate: 'NAV.JOB_SEARCH',
                type: 'item',
                icon: 'work_outline',
                url: '/user/job-search'
            },
        ]
    },
];
