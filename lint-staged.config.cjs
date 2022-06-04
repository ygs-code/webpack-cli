module.exports = {
    'src/**/*.{js,jsx,ts,tsx}': [
        'prettier --tab-width 4 --write',
        'eslint',
        'git add',
    ],
    'src/**/*.{htm,html,css,sss,less,scss,saas}': ['stylelint', 'git add'],
};
