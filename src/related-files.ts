import path from 'path';
import fs from 'fs';
import { TypeItem, RelatedFiles } from './extension';

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

const cache: { [key: string]: Array<TypeItem> } = {};


/**
 * Retrieves related files from the cache or computes them if not cached.
 * @param dir Directory to search in
 * @param file Name of the current file
 * @returns Array of related files
 */
export function findRelatedFiles(dir: string, file: string, basePath: string): Array<TypeItem> {
  const cacheKey = `${dir}/${file}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const relatedFiles = isPods(file) ? findRelatedFilesInPods(dir, file) : findRelatedFilesInClassic(dir, file);
  let items = relatedFiles.map(
    (item) => new TypeItem(item, item.path, basePath)
  );

  cache[cacheKey] = items;
  return items;

}

/**
 * Finds related files within the Pods structure.
 * @param dir Directory to search in
 * @param file Name of the current file
 * @returns Array of related files
 */
function findRelatedFilesInPods(dir: string, file: string): Array<RelatedFiles> {
  const fileArgPrefix = prefixName(file);

  return fs.readdirSync(dir, 'utf-8')
    .filter((item) => {
      const baseName = path.basename(item);
      const filePrefix = prefixName(baseName);
      return (isFilesRelated(baseName) || fileArgPrefix === filePrefix) && file !== baseName;
    })
    .map((file) => ({
      label: file,
      file: file,
      path: path.join(dir, file),
    }));
}

/**
 * Finds related files within the Classic structure.
 * @param dir Directory to search in
 * @param file Name of the current file
 * @returns Array of related files
 */
function findRelatedFilesInClassic(dir: string, file: string): Array<RelatedFiles> {
  const module = findModule(dir);
  const prefix = prefixName(file);
  if (!module) {
    return [];
  }

  const searchingFiles = MODULES_FOR_SEARCH[module];
  const relatedFiles: Array<RelatedFiles> = [];

  searchingFiles.forEach(_module => {
    const moduleDir = findModuleDirectory(dir, module, _module);

    if (fs.existsSync(moduleDir)) {
      relatedFiles.push(
        ...fs
          .readdirSync(moduleDir, "utf-8")
          .filter((item) => prefixName(path.basename(item)) === prefix)
          .map((_file) => ({
            label: _module,
            file: _file,
            path: path.join(moduleDir, _file),
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
function findModule(dir: string): string | null {
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
function findModuleDirectory(dir: string, module: string, _module: string): string {
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
 * @param file File name
 * @returns Extracted prefix or an empty string if none found
 */
export function prefixName(file = ''): string {
  return file.split('.')[0] || '';
}

function isPods(file: string): boolean {
  return POD_GROUP_FILES.includes(file);
}