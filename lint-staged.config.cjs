module.exports = {
    'src/**/*.{js,jsx,ts,tsx}': [
        'prettier  --write',
        'eslint  --fix',
    ],
    'src/**/*.{htm,html,css,sss,less,scss,saas}': ['stylelint --fix'],
};
