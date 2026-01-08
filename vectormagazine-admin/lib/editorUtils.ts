
/**
 * Helper to safely extract default export or the module itself
 * Used for handling mixed CommonJS/ESM imports in Editor.js plugins
 */
export const safeImport = (module: any, name: string) => {
    if (!module) {
        console.error(`Failed to import ${name}`);
        return undefined;
    }
    // If it has a default export, use it
    if (module.default) return module.default;
    // If the module itself is a function/class, use it (CommonJS)
    if (typeof module === 'function' || typeof module === 'object') return module;

    console.warn(`Unsure how to handle import for ${name}`, module);
    return module;
};
