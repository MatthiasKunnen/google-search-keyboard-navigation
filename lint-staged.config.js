function mapFilenames(filenames) {
    return filenames.map(filename => `"${filename}"`).join(' ');
}

module.exports = {
    '*': () => [
        'yarn run build',
        'yarn run test',
    ],
    '**/*.js': (filenames) => [
        `eslint --fix --cache ${mapFilenames(filenames)}`,
    ],
    '**/*.ts': (filenames) => [
        `eslint --fix --cache ${mapFilenames(filenames)}`,
    ],
};
