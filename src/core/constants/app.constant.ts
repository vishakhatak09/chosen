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
        {
            value: 'movie',
            viewValue: 'Movie',
        },
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
            value: 'withBox',
            viewValue: 'Box Styled',
        },
        {
            value: 'withRating',
            viewValue: 'Box Styled with Ratings',
        }
    ];

}

export interface OptionType {
    value: string;
    viewValue: string;
    icon?: string;
}
