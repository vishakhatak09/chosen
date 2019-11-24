export class AppConstant {

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
    public static ValidPhonePattern = '[6-9]\\d{9}';

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
        'Twitter',
        'LinkedIn',
        'Website',
        'Facebook'
    ];

    public static AdditionalInfo = [
        'Languages',
        'Interests',
        'References',
        'Accomplishments',
        'Affiliations',
        'Certifications',
    ];

    public static FooterLinkUrl = 'http://staging.chosenyou.com/';

    public static ConstantMsgs = {
        'inactiveUser': 'Your account is not active, please contact to administrator',
        'somethingWentWrong': 'Something went wrong, please try again later',
        'notAuthorized': 'Not a valid authorization, please login again with valid credentials',
        'internalServerError': 'Internal server error occurred, please try again',
        'serverDown': 'The server is temporary unavailable. Please try again later',
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
}

export interface OptionType {
    value: string;
    viewValue: string;
    icon?: string;
}
