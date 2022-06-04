module.exports = {
    'src/**/*.{js,jsx,ts,tsx}': [
        'prettier --tab-width 3 --write',
        'eslint  --fix',
        'git add',
    ],
    'src/**/*.{htm,html,css,sss,less,scss,saas}': ['stylelint --fix', 'git add'],
};
