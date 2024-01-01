import axios from 'axios';
import * as fs from 'fs/promises';
import * as JSONC from 'jsonc-parser';
import path from 'path';
import { fileURLToPath } from 'url';

export const themes = {
    'Eva Dark': 'https://raw.githubusercontent.com/fisheva/Eva-Theme/master/themes/Eva-Dark.json',
    'Eva Light': 'https://raw.githubusercontent.com/fisheva/Eva-Theme/master/themes/Eva-Light.json',
};
export const jsonOutDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../docs/public/');

/**
 *
 * @param {string} url
 * @returns {Promise<import('./types.mjs').TextmateTheme | undefined>}
 */
export async function getThemeJson(url) {
    try {
        const response = await axios.get(url);
        const text = response.data;
        /**
         * @type {import('./types.mjs').TextmateTheme}
         */
        const json = JSONC.parse(text);
        return {
            name: json.name,
            // @ts-ignore
            tokenColors: json.tokenColors.map(r => {
                return { scope: r.scope, settings: r.settings };
            }),
        };
    } catch (error) {
        console.warn(`Fetch ${url} failed!`, error);
        return;
    }
}

export async function syncAllThemes() {
    for (const name in themes) {
        if (Object.hasOwnProperty.call(themes, name)) {
            const url = themes[name];
            const themeJson = await getThemeJson(url);
            if (themeJson) {
                await fs.writeFile(path.join(jsonOutDir, name + '.json'), JSON.stringify(themeJson, null, 2));
                console.log(`Successfully synced theme: ${name}`);
            }
        }
    }
}
