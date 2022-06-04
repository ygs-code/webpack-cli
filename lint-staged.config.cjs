module.exports = {
    'src/**/*.{js,jsx,ts,tsx}': [
        'prettier --tab-width 4 --write',
        'eslint  --fix',
        'git add',
    ],
    '*.{htm,html,css,sss,less,scss,saas}': ['stylelint --fix', 'git add'],
};
