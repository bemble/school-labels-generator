const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { parse } = require("csv-parse/sync");

const VAR_TEMPLATE = `%VAR_varname%`;

function getColorizeScript(color) {
    return `<script>
        function colorizeFirstLetters(e) {
            var text = e.innerHTML;
            let sep = " ";
            if (text.includes("-")) {
                sep = "-";
            }
            var words = text.split(" ").map(word => word.split("-")).flat();
        
            e.innerHTML = words.map((word) => {
                return \`<tspan><tspan style="fill:${color};">\${word[0]}</tspan><tspan>\${word.slice(1)}</tspan></tspan>\`;
            }).join(sep);
        }

        [...document.querySelectorAll("tspan")].filter(e => e.innerHTML !== "&amp;&amp;").forEach(e => {
            colorizeFirstLetters(e, " ");
        });
    </script>`;
}

function adaptTemplate(template, remplacements) {
    let adaptedTemplate = template;
    Object.keys(remplacements).forEach((key) => {
        adaptedTemplate = adaptedTemplate.replace(new RegExp(VAR_TEMPLATE.replace("varname", key), 'g'), remplacements[key]);
    });
    return adaptedTemplate;
}

(async () => {
    program
        .option('-v, --verbose', 'Verbose mode')
        .requiredOption('-t, --template <string>', 'Template file used to generate the output')
        .requiredOption('-l, --list <string>', 'List of content replacements, CSV format comma separated')
        .option('-c, --color <hex>', 'Color of the first letter, default is #FF0000')
        .option('-n, --no-colorize', 'Do not colorize first letter of each name')
        .parse();
    const { verbose, colorize, template, list, color } = program.opts();
    const templateName = path.parse(template).name;
    const outputFilename = `result_${templateName}.html`;

    if (verbose && !colorize) {
        console.log('No colorize option enabled, first letter of each name will not be colorized.');
    }

    const templateContent = await fs.promises.readFile(template, { encoding: "utf-8" });
    const listContent = parse(await fs.promises.readFile(list, { encoding: "utf-8" }), { columns: true });

    verbose && console.log(`${listContent.length} entries found in list file.`);
    const images = [];
    listContent.forEach((entry, index) => {
        verbose && console.log(`Adapting template for entry #${index}.`);
        images.push(adaptTemplate(templateContent, entry));
    });

    verbose && console.log(`Generating "${outputFilename}"...`);
    const html = `<html>
        <head>
            <title>${templateName}</title>
        </head>
        <body>
            ${images.join('\n')}
            ${colorize ? getColorizeScript(color || "#FF0000") : ''}
        </body>
    </html>`;
    fs.promises.writeFile(outputFilename, html);
})();