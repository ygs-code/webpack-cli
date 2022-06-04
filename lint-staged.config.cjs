module.exports = {
    'src/**/*.js': [
        'prettier --tab-width 4 --write',
        'eslint src/**/*.js',  
    ],
    '*.{htm,html,css,sss,less,scss,saas}': ['stylelint --fix',  ],
};
