import { TypeItem } from './extension';
import fs from 'fs';
import { emberRelatedFiles } from 'ember-related-files';

export async function findRelatedFiles(rootPath: string, relativeFilePath: string):Promise<Array<TypeItem>> {
  
  let filesPaths = emberRelatedFiles(relativeFilePath).then((files) => {
    let _fs = files.map((item) => new TypeItem(item, rootPath)).filter((item) => fs.existsSync(item.rootPath));
    return _fs;
  });

  return filesPaths;
}
