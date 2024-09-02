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

export function findRelatedFiles(dir: string, file: string, basePath: string): Array<TypeItem> {
  const cacheKey = `${dir}/${file}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  let relatedFiles: Array<RelatedFiles> = [];

  if (findModule(dir) === 'components') {
    relatedFiles = relatedFiles.concat(
      findRelatedFilesInPodsOrFlat(dir, file),
      findRelatedFilesInClassic(dir, file),
    );
  } else {
    relatedFiles = isPods(file) ? findRelatedFilesInPodsOrFlat(dir, file) : findRelatedFilesInClassic(dir, file);
  }

  let items = relatedFiles.map(
    (item) => new TypeItem(item, item.path, basePath)
  );

  cache[cacheKey] = items;
  return items;

}

function findRelatedFilesInPodsOrFlat(dir: string, file: string): Array<RelatedFiles> {
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

function findRelatedFilesInClassic(dir: string, file: string): Array<RelatedFiles> {
  const module = findModule(dir);
  const prefix = prefixName(file);
  if (!module) {
    return [];
  }

  const searchingFiles = MODULES_FOR_SEARCH[module];
  const relatedFiles: Array<RelatedFiles> = [];

  searchingFiles.forEach(_module => {
    const _dir = findModuleDirectory(dir, module, _module);

    if (fs.existsSync(_dir)) {
      relatedFiles.push(
        ...fs
          .readdirSync(_dir, "utf-8")
          .filter((item) => prefixName(path.basename(item)) === prefix && fs.statSync(path.join(_dir, item)).isFile())
          .map((_file) => ({
            label: _module,
            file: _file,
            path: path.join(_dir, _file),
          }))
      );
    }
  });

  return relatedFiles;
}

function findModule(dir: string): string | null {
  const paths = dir.split(path.sep);
  return Object.keys(MODULES_FOR_SEARCH).find(module => paths.includes(module)) || null;
}

function findModuleDirectory(dir: string, module: string, _module: string): string {
  if (module === 'components' && _module === 'templates') {
    return dir.replace(module, _module + "/components");
  } else if (module === 'templates' && _module === 'components') {
    return dir.replace("/" + module, '');
  } else {
    return dir.replace(module, _module);
  }
}

function isFilesRelated(file: string): boolean {
  const relatedFiles = ['route.js', 'template.hbs', 'controller.js', 'component.js'];
  return relatedFiles.includes(file);
}

function prefixName(file = ''): string {
  return file.split('.')[0] || '';
}

function isPods(file: string): boolean {
  return POD_GROUP_FILES.includes(file);
}