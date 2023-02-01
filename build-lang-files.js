const fs = require('fs');

// The export file must be placed at this location : src/assets/
fs.readFile('googlesheetslocale.json', (err, data) => {
    if (err) throw err;
    parseSource(JSON.parse(data));
});

function parseSource(data) {
    const tabsName = Object.keys(data);
    const detectedLanguages = Object.keys(data[tabsName[0]][Object.keys(data[tabsName[0]])[0]]); // ["en", "fr", "es"]

    detectedLanguages.forEach(language => {
        const messages = tabsName.reduce((acc, tabName) => {
            if (!(tabName in acc)) {
                acc[tabName] = {};
            }

            Object.keys(data[tabName]).forEach(key => {
                acc[tabName][key] = data[tabName][key][language];
            });

            return acc;
        }, {});

        const fileContent = JSON.stringify(messages);
        fs.writeFile(`src/locales/${language.toLocaleLowerCase()}.json`, fileContent, (err) => {
            if (err) throw err;
            console.log(`File ${language} wrote successfully`);
        });
    });
}