import { environment } from 'environments/environment';

export class AppConstant {

    public static MaxSocialLinks = 4;
    public static GeneralConst = {
        UserImagePath: environment.serverImagePath + 'resume/',
        profileImagePath: environment.serverImagePath + 'profile/',
        TemplateBasePath: environment.serverImagePath + 'template/',
    };

    public static MaritalStatusOptions: OptionType[] = [
        {
            value: 'unmarried',
            viewValue: 'Unmarried',
        },
        {
            value: 'married',
            viewValue: 'Married',
        },
    ];

    public static GenderOptions: OptionType[] = [
        {
            value: 'male',
            viewValue: 'Male',
            icon: 'male-icon'
        },
        {
            value: 'female',
            viewValue: 'Female',
            icon: 'female-icon'
        },
    ];

    public static ValidUrlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    public static ValidPhonePattern = '[0-9]\\d{9}';

    /** Bar Rating Theme List with css imports */
    public static ratingThemeList = [
        {
            name: 'default',
            cssImport: '@import "~ngx-bar-rating/themes/br-default-theme"',
        },
        {
            name: 'bootstrap',
            cssImport: '@import "~ngx-bar-rating/themes/br-bootstrap-theme"',
        },
        {
            name: 'fontawesome',
            cssImport: '@import "~ngx-bar-rating/themes/br-fontawesome-theme"',
        },
        {
            name: 'fontawesome-o',
            cssImport: '@import "~ngx-bar-rating/themes/br-fontawesome-o-theme"',
        },
        {
            name: 'horizontal',
            cssImport: '@import "~ngx-bar-rating/themes/br-horizontal-theme"',
        },
        {
            name: 'vertical',
            cssImport: '@import "~ngx-bar-rating/themes/br-vertical-theme"',
        },
        {
            name: 'stars',
            cssImport: '@import "~ngx-bar-rating/themes/br-stars-theme"',
        },
        {
            name: 'movie',
            cssImport: '@import "~ngx-bar-rating/themes/br-movie-theme"',
        },
        {
            name: 'square',
            cssImport: '@import "~ngx-bar-rating/themes/br-square-theme"',
        },
    ];

    public static RatingThemes = [
        {
            value: 'default',
            viewValue: 'Default',
        },
        {
            value: 'square',
            viewValue: 'Square',
        },
        // { // not proper in view while in mobile screen
        //     value: 'movie',
        //     viewValue: 'Movie',
        // },
        {
            value: 'stars',
            viewValue: 'Stars',
        },
    ];

    public static SkillCustomOptions: OptionType[] = [
        {
            value: 'basic',
            viewValue: 'Basic',
        },
        {
            value: 'basicStyled',
            viewValue: 'Basic Styled',
        },
        {
            value: 'basicWithRating',
            viewValue: 'Basic With Ratings',
        },
        // {
        //     value: 'withRating',
        //     viewValue: 'Basic with Ratings',
        // }
    ];

    public static SocialSites: string[] = [
        'skype',
        'linkedin',
        'website',
        'facebook'
    ];

    public static AdditionalInfo = [
        {
            value: 'Languages',
            checked: false,
        },
        {
            value: 'Interests',
            checked: false,
        },
        {
            value: 'References',
            checked: false,
        },
        {
            value: 'Accomplishments',
            checked: false,
        },
        {
            value: 'Affiliations',
            checked: false,
        },
        {
            value: 'Certifications',
            checked: false,
        },
    ];

    public static FooterLinkUrl = 'http://staging.chosenyou.com/';

    public static ConstantMsgs = {
        'inactiveUser': 'Your account is not active, please contact to administrator',
        'somethingWentWrong': 'Something went wrong, please try again later',
        'notAuthorized': 'Not a valid authorization, please login again with valid credentials',
        'internalServerError': 'Internal server error occurred, please try again',
        'serverDown': 'The server is temporary unavailable. Please try again later',
        'noInternet': 'No internet connection detected.',
    };

    public static AuthStorageKey = 'user';

    public static MY_YEAR_FORMATS = {
        parse: {
            dateInput: 'YYYY',
        },
        display: {
            dateInput: 'YYYY',
            // monthYearLabel: 'MMM YYYY',
            // dateA11yLabel: 'LL',
            // monthYearA11yLabel: 'MMMM YYYY',
            yearLabel: 'YYYY',
            yearA11yLabel: 'YYYY',
        },
    };

    public static DEFAULT_FORMATS = {
        parse: {
            dateInput: 'DD-MMM-YYYY',
        },
        display: {
            dateInput: 'DD-MMM-YYYY',
            monthYearLabel: 'MMM YYYY',
            // dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY',
        },
    };

    public static ResumeFormApi = {
        saveFirstStepApi: environment.serverBaseUrl + 'api/resume/resumeFirstStep',
        saveSecondStepApi: environment.serverBaseUrl + 'api/resume/resumeSecondStep',
        saveThirdStepApi: environment.serverBaseUrl + 'api/resume/resumeThirdStep',
        saveFourthStepApi: environment.serverBaseUrl + 'api/resume/resumeForthStep',
        saveFifthStepApi: environment.serverBaseUrl + 'api/resume/resumeFifthStep',
        saveSixthStepApi: environment.serverBaseUrl + 'api/resume/resumeSixthStep',
        saveImgPdfStepApi: environment.serverBaseUrl + 'api/resume/resumeImagePdf',
    };

    public static JobTypeOptions: OptionType[] = [
        {
            value: 'alljob',
            viewValue: 'All Jobs',
        },
        {
            value: 'companyjob',
            viewValue: 'Company Jobs',
        },
        {
            value: 'consultantjob',
            viewValue: 'Consultant Jobs',
        },
    ];

    public static FontFamilyOptions: OptionType[] = [
        {
            value: 'sans-serif',
            viewValue: 'Sans Serif',
        },
        {
            value: 'serif',
            viewValue: 'Serif',
        },
    ];
}

export interface OptionType {
    value: string;
    viewValue: string;
    icon?: string;
}
