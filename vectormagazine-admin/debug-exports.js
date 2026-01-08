
try {
    const fontSize = require('editorjs-font-size');
    console.log('FontSize Export:', fontSize);
} catch (e) {
    console.error('FontSize Error:', e.message);
}

try {
    const color = require('editorjs-text-color-plugin');
    console.log('Color Export:', color);
} catch (e) {
    console.error('Color Error:', e.message);
}
