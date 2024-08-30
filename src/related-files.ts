import path from 'path';
import fs from 'fs';

const POD_GROUP_FILES = ['route.js', 'route.ts', 'controller.js', 'controller.ts', 'template.hbs', 'component.js', 'component.ts'];

interface ModuleSearch {
  [key: string]: Array<string>
};

const MODULES_FOR_SEARCH: ModuleSearch = {
  "templates": ["routes", "controllers", "components"],
  "controllers": ["routes", "templates"],
  "routes": ["controllers", "templates"],
  "components": ["templates"]
};

const cache: { [key: string]: Array<{ label: string; path: string }> } = {};

/**
 * Retrieves related files from the cache or computes them if not cached.
 * @param dir Directory to search in
 * @param fileName Name of the current file
 * @returns Array of related files
 */
export function getRelatedFiles(dir: string, fileName: string): Array<{ label: string; path: string }> {
  const cacheKey = `${dir}:${fileName}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const isPodsFile = POD_GROUP_FILES.includes(fileName);
  const relatedFiles = isPodsFile ? findRelatedFilesInPods(dir, fileName) : findRelatedFilesInClassic(dir, fileName);

  cache[cacheKey] = relatedFiles;
  return relatedFiles;
}

/**
 * Finds related files within the Pods structure.
 * @param dir Directory to search in
 * @param fileName Name of the current file
 * @returns Array of related files
 */
function findRelatedFilesInPods(dir: string, fileName: string): Array<{ label: string; path: string }> {
  const fileArgPrefix = getPrefixName(fileName);

  return fs.readdirSync(dir, 'utf-8')
    .filter(file => {
      const baseName = path.basename(file);
      const filePrefix = getPrefixName(baseName);
      return (isFilesRelated(baseName) || fileArgPrefix === filePrefix) && fileName !== baseName;
    })
    .map(file => ({
      label: file,
      path: path.join(dir, file),
    }));
}

/**
 * Finds related files within the Classic structure.
 * @param dir Directory to search in
 * @param fileName Name of the current file
 * @returns Array of related files
 */
function findRelatedFilesInClassic(dir: string, fileName: string): Array<{ label: string; path: string }> {
  const module = getModule(dir);
  const prefix = getPrefixName(fileName);
  if (!module) {
    return [];
  }

  const searchingFiles = MODULES_FOR_SEARCH[module];
  const relatedFiles: Array<{ label: string; path: string }> = [];

  searchingFiles.forEach(_module => {
    const moduleDir = getModuleDirectory(dir, module, _module);

    if (fs.existsSync(moduleDir)) {
      relatedFiles.push(
        ...fs.readdirSync(moduleDir, 'utf-8')
          .filter(file => getPrefixName(path.basename(file)) === prefix)
          .map(file => ({
            label: _module,
            path: path.join(moduleDir, file)
          }))
      );
    }
  });

  return relatedFiles;
}

/**
 * Determines the module type (e.g., routes, controllers, templates) based on the directory.
 * @param dir Directory path
 * @returns Module type or null if not found
 */
function getModule(dir: string): string | null {
  const paths = dir.split(path.sep);
  return Object.keys(MODULES_FOR_SEARCH).find(module => paths.includes(module)) || null;
}

/**
 * Constructs the directory path for a module based on its type and the current directory.
 * @param dir Current directory path
 * @param module Current module type
 * @param _module Target module type
 * @returns Constructed directory path
 */
function getModuleDirectory(dir: string, module: string, _module: string): string {
  if (module === 'components' && _module === 'templates') {
    return dir.replace(module, _module + "/components");
  } else if (module === 'templates' && _module === 'components') {
    return dir.replace("/" + module, '');
  } else {
    return dir.replace(module, _module);
  }
}

/**
 * Checks if a file is considered related based on its name.
 * @param file File name
 * @returns Boolean indicating if the file is related
 */
export function isFilesRelated(file: string): boolean {
  const relatedFiles = ['route.js', 'template.hbs', 'controller.js', 'component.js'];
  return relatedFiles.includes(file);
}

/**
 * Extracts the prefix of a file name (e.g., the name before the first dot).
 * @param fileName File name
 * @returns Extracted prefix or an empty string if none found
 */
export function getPrefixName(fileName = ''): string {
  return fileName.split('.')[0] || '';
}
