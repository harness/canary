import fs from 'node:fs';
import path from 'node:path';

const darkDir = path.join(new URL('.', import.meta.url).pathname, '..', 'design-tokens', 'mode', 'dark');

const EXPECTED_TEXT_VALUE = '{pure.white}';
const EXPECTED_INNER_ALPHA = '0.35';

function walkJsonFiles(dir, acc = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkJsonFiles(full, acc);
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            acc.push(full);
        }
    }
    return acc;
}

function main() {
    const files = walkJsonFiles(darkDir);
    const errors = [];

    for (const file of files) {
        const raw = fs.readFileSync(file, 'utf8');
        let json;
        try {
            json = JSON.parse(raw);
        } catch (e) {
            errors.push(`${path.relative(process.cwd(), file)}: JSON parse error`);
            continue;
        }

        const outline = json?.set?.ai?.outline;
        if (!outline) continue; // skip files without AI set

        const textValue = outline?.text?.$value;
        if (textValue !== EXPECTED_TEXT_VALUE) {
            errors.push(
                `${path.relative(process.cwd(), file)}: set.ai.outline.text.$value = ${JSON.stringify(
                    textValue
                )}, expected ${EXPECTED_TEXT_VALUE}`
            );
        }

        const modify = outline?.inner?.$extensions?.['studio.tokens']?.modify;
        const innerAlpha = modify?.value;
        const innerType = modify?.type;

        if (innerType !== 'alpha' || innerAlpha !== EXPECTED_INNER_ALPHA) {
            errors.push(
                `${path.relative(
                    process.cwd(),
                    file
                )}: set.ai.outline.inner alpha = ${JSON.stringify(innerAlpha)} (type=${JSON.stringify(
                    innerType
                )}), expected type="alpha" & value="${EXPECTED_INNER_ALPHA}"`
            );
        }
    }

    if (errors.length === 0) {
        console.log('OK: all dark set.ai.outline text/inner tokens match expected values');
    } else {
        console.error('Found mismatches in dark AI tokens:');
        for (const err of errors) {
            console.error(' -', err);
        }
        process.exitCode = 1;
    }
}

main();
