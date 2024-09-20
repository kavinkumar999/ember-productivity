import { TypeItem } from './extension';
import fs from 'fs';

export const regexTypes = [
  // Pod Components
  { module: 'pod-component-component', exp: /(.+?)(app\/(?:.+)|addon|lib\/(?:.+)\/addon\/(?:.+))\/(component)\.(js|ts)$/ },
  { module: 'pod-component-template', exp: /(.+?)(app\/(?:.+)|addon|lib\/(?:.+)\/addon\/(?:.+))\/(template)\.(hbs)$/ },
  { module: 'pod-component-style', exp: /(.+?)(app\/(?:.+)|addon|lib\/(?:.+)\/addon\/(?:.+))\/style\.(css|sass|scss)$/ },
  { module: 'pod-component-unit', exp: /(.+?)(tests\/unit\/(.+?)\/component-test\.(js|ts))$/ },
  { module: 'pod-component-integration', exp: /(.+?)(tests\/integration\/(.+?)\/component-test\.(js|ts))$/ },

  { module: 'pod-route-route', exp: /(.*?)(app\/(?:.+)|addon|lib\/(?:.+)\/addon\/(?:.+))\/(route)\.(js|ts)$/ },
  { module: 'pod-controller-controller', exp: /(.*?)(app\/(?:.+)|addon|lib\/(?:.+)\/addon\/(?:.+))\/(controller)\.(js|ts)$/ },

  // Classic Components
  { module: 'classic-component-component', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/components\/(.+?)\.(js|ts)$/ },
  { module: 'classic-component-template', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/templates\/components\/(.+?)\.(hbs)$/ },
  { module: 'classic-component-style', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/styles\/components\/(.+?)\.(css|sass|scss)$/ },
  { module: 'classic-component-unit', exp: /(.+?)(tests\/unit\/components\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-component-integration', exp: /(.+?)(tests\/integration\/components\/(.+?)-test\.(js|ts))$/ },

  { module: 'classic-route-route', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/routes\/(.+?)\.(js|ts)$/ },
  { module: 'classic-route-unit', exp: /(.+?)(tests\/unit\/routes\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-route-integration', exp: /(.+?)(tests\/integration\/routes\/(.+?)-test\.(js|ts))$/ },

  { module: 'classic-controller-controller', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/controllers\/(.+?)\.(js|ts)$/ },
  { module: 'classic-controller-unit', exp: /(.+?)(tests\/unit\/controllers)\/(.+?)-test\.(js|ts)$/ },
  { module: 'classic-controller-integration', exp: /(.+?)(tests\/integration\/controllers\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-controller-template', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/templates\/(.+?)\.(hbs)$/ },

  { module: 'classic-model-model', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/models\/(.+?)\.(js|ts)$/ },
  { module: 'classic-model-unit', exp: /(.+?)(tests\/unit\/models\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-model-integration', exp: /(.+?)(tests\/integration\/models\/(.+?)-test\.(js|ts))$/ },

  { module: 'classic-helper-helper', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/helpers\/(.+?)\.(js|ts)$/ },
  { module: 'classic-helper-unit', exp: /(.+?)(tests\/unit\/helpers\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-helper-integration', exp: /(.+?)(tests\/integration\/helpers\/(.+?)-test\.(js|ts))$/ },

  { module: 'classic-mixin-mixin', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/mixins\/(.+?)\.(js|ts)$/ },
  { module: 'classic-mixin-unit', exp: /(.+?)(tests\/unit\/mixins\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-mixin-integration', exp: /(.+?)(tests\/integration\/mixins\/(.+?)-test\.(js|ts))$/ },

  { module: 'classic-service-service', exp: /(.+?)(app|addon|lib\/(?:.+)\/addon)\/services\/(.+?)\.(js|ts)$/ },
  { module: 'classic-service-unit', exp: /(.+?)(tests\/unit\/services\/(.+?)-test\.(js|ts))$/ },
  { module: 'classic-service-integration', exp: /(.+?)(tests\/integration\/services\/(.+?)-test\.(js|ts))$/ }
];

const groups = [
  ['pod-controller-controller-js', 'pod-route-route-js', 'pod-controller-unit-js', 'pod-controller-integration-js', 'pod-route-unit-js', 'pod-route-integration-js', 'pod-component-component-js', 'pod-component-template-hbs', 'pod-component-style-css', 'pod-component-style-sass', 'pod-component-style-scss', 'pod-component-unit-js', 'pod-component-integration-js'],
  ['classic-component-component-js', 'classic-component-template-hbs', 'classic-component-style-css', 'classic-component-style-sass', 'classic-component-style-scss', 'classic-component-unit-js', 'classic-component-integration-js'],
  ['classic-controller-controller-js', 'classic-controller-template-hbs', 'classic-route-route-js', 'classic-controller-unit-js', 'classic-controller-integration-js', 'classic-route-unit-js', 'classic-route-integration-js'],
  ['classic-helper-helper-js', 'classic-helper-unit-js', 'classic-helper-integration-js'],
  ['classic-service-service-js', 'classic-service-unit-js', 'classic-service-integration-js']
].map(group => {
  const typescript = group.filter(i => i.endsWith('-js')).map(jsItem => jsItem.replace('-js', '-ts'));
  return group.concat(typescript);
});

interface Type {
  appRoot: string,
  hostType: string,
  path: string,
  name: string,
  key: string
}

function detectType (relativeFilePath: string): Type | undefined {
  return regexTypes
    .map((type) => {
      const m = relativeFilePath.match(type.exp);

      if (m) {
        let appRoot = m[1];
        let hostType = m[2];
        let name = m[3];
        let ext = m[4];
        if (hostType.startsWith('tests')) {
          hostType = 'app';
        }

        return { appRoot, hostType, path: relativeFilePath, name, key: `${type.module}-${ext}` };
      }
    })
    .find((type) => Boolean(type));
}

function getRelatedKeys (key: string): string[] {
  let relatedGroup: string[] =  groups.find((group) => group.indexOf(key) !== -1) || [];
  relatedGroup = relatedGroup?.filter((_key) => _key !== key);

  return relatedGroup;
}

function typeKeyToLabel (typeKey: string): string {
  switch (typeKey) {
    case 'pod-component-component':
    case 'classic-component-component':
      return 'Component';

    case 'pod-component-style':
      return 'Stylesheet';

    case 'pod-route-route':
    case 'classic-route-route':
      return 'Route';

      case 'pod-controller-controller':
      case 'classic-controller-controller':
      return 'Controller';

    case 'classic-mixin-mixin':
      return 'Mixin';

    case 'classic-model-model':
      return 'Model';

    case 'classic-helper-helper':
      return 'Helper';

    case 'classic-service-service':
      return 'Service';

    case 'pod-component-template':
    case 'classic-component-template':
    case 'pod-template-template':
    case 'classic-template-template':
    case 'classic-controller-template':
    case 'pod-controller-template':
      return 'Template';

    case 'classic-component-unit':
    case 'pod-component-unit':
    case 'classic-controller-unit':
    case 'classic-model-unit':
    case 'classic-helper-unit':
    case 'classic-mixin-unit':
    case 'classic-service-unit':
      return 'Unit Test';

    case 'classic-component-integration':
    case 'pod-component-integration':
    case 'classic-controller-integration':
    case 'classic-model-integration':
    case 'classic-helper-integration':
    case 'classic-mixin-integration':
    case 'classic-service-integration':
      return 'Integration Test';
  }

  return typeKey;
}

function getPath (sourceType: Type, typeKey: string): string {
  const { appRoot, hostType, name } = sourceType;
  const [ispod, type, subtype, ext] = typeKey.split('-');

  if (ispod === 'pod') {
    switch (subtype) {
      case 'integration':
      case 'unit':
        return `${appRoot}${hostType}/tests/${subtype}/${type}s/${name}/${type}-test.${ext}`;
      default:
        return `${appRoot}${hostType}/${subtype || type}.${ext}`;
    }
  } else {
    switch (subtype) {
      case 'integration':
      case 'unit':
        return `${appRoot}/tests/${subtype}/${type}s/${name}-test.${ext}`;
      case 'style':
        return `${appRoot}${hostType}/styles/${type}s/${name}.${ext}`;
      case 'template':
        if (type === 'controller') {
          return `${appRoot}${hostType}/templates/${name}.${ext}`;
        } else {
          return `${appRoot}${hostType}/templates/${type}s/${name}.${ext}`;
        }
      default:
        return `${appRoot}${hostType}/${type}s/${name}.${ext}`;
    }
  }
}
export function findRelatedFiles(rootPath: string, relativeFilePath: string): Array<TypeItem> {
  
  let type = detectType(relativeFilePath);
  if (!type) { return []; }

  let relatedKeys =  getRelatedKeys(type.key);

  return relatedKeys.map((key) => {
    let _key = key.split('-').slice(0, 3).join('-');
    return {
      label: typeKeyToLabel(_key),
      path: getPath(type, key)
    };
  }).map((item) => new TypeItem(item, rootPath)).filter((item) => fs.existsSync(item.rootPath));

}
