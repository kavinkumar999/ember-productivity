# Ember Productivity

This extension provides a collection of Ember JS and Handlebars snippets for the [Visual Studio Code][code] editor. It also supports easy switching between related Ember files and layouts.

## Switch Related Files

### Default Keybindings for Ember Productivity Addon

The Ember Productivity Addon includes keybindings to easily switch between related files:

- **Mac:** `Cmd + Alt + R`
- **Win/Linux:** `Ctrl + Alt + R`
  
### File Switches

- **Route → Controller → Template**
- **Component → Template**
  
## Supported Layou

- **Classic**
- **Pods**

## Supported Languages (File Extensions)

* JavaScript (.js)
* TypeScript (.ts)
* Handlebars (.hbs)

## Handlebars Snippets

Below is a list of all available Handlebars snippets and their triggers. The **⇥** represents the `TAB` key.

### Handlebars Helpers

| Trigger         | Content                                            |
| --------------- | -------------------------------------------------- |
| `get`           | `{{get ${1:object} "${2:property}"}}`             |
| `act`           | `{{action "${1:actionName}"}}`                     |
| `act1`          | `{{action "${1:name}" ${2:param}}}`               |
| `log`           | `{{log ${1:var}}}`                                |
| `linkto`        | `<LinkTo @route="${1:route}"> ${2} </LinkTo>`     |
| `inif`          | `{{if ${1:condition} "${2:true-output}" "${3:false-output}"}}` |
| `inun`          | `{{unless ${1:condition} "${2:true-output}" "${3:false-output}"}}` |
| `if`            | `{{#if ${1:condition}}} ${2} {{/if}}`             |
| `un`            | `{{#unless ${1:condition}}} ${2} {{/unless}}`     |
| `ifel`          | `{{#if ${1:condition}}} ${2} {{else}} ${3} {{/if}}` |
| `unel`          | `{{#unless ${1:condition}}} ${2} {{else}} ${3} {{/unless}}` |
| `ifelif`        | `{{#if ${1:condition1}}} ${2} {{else if ${3:condition2}}} ${4} {{/if}}` |
| `each`          | `{{#each ${1:list} as |${2:item}|}} ${3} {{/each}}` |
| `eachx`         | `{{#each ${1:list} as |${2:item} ${3:index}|}} ${4} {{/each}}` |
| `eachin`        | `{{#each-in ${1:object} as |${2:key} ${3:value}|}} ${4} {{/each-in}}` |
| `eachinel`      | `{{#each-in ${1:object} as |${2:key} ${3:value}|}} ${4} {{else}} ${5} {{/each-in}}` |
| `comp`          | `<${1:component} @${2:arg1}="${3:value1}" @${4:arg2}="${5:value2}"> ${6} </${1:component}>` |
| `yield`         | `{{yield ${1:defaultContent}}}`                   |
| `concat`        | `{{concat ${1:string1} ${2:string2}}}`            |

## JavaScript (ES6) Snippets

Below is a list of all available JavaScript snippets and their triggers. The **⇥** represents the `TAB` key.

### Functions

| Trigger         | Content                                             |
| --------------- | --------------------------------------------------- |
| `func`          | `function ${1:functionName}() { ${2} }`           |
| `func1`         | `function ${1:functionName}(${2:param}) { ${3} }` |
| `func2`         | `function ${1:functionName}(${2:param1}, ${3:param2}) { ${4} }` |
| `func3`         | `function ${1:functionName}(${2:param1}, ${3:param2}, ${4:param3}) { ${5} }` |

### Computed Properties

| Trigger         | Content                                             |
| --------------- | --------------------------------------------------- |
| `cu`            | `${1:computedPropertyName}: computed('${2:propertyToBeWatched}', function() { return ${3}; })` |
| `cugs`          | `${1:computedPropertyName}: computed('${2:propertyToBeWatched}', { get() { ${3} }, set(key, value) { ${4} } })` |

### Imports

| Trigger         | Content                                             |
| --------------- | --------------------------------------------------- |
| `imp rsvp`      | `import { ${1:module} } from '@ember/rsvp';`       |
| `imp utils`     | `import { ${1:module} } from '@ember/utils';`      |
| `imp service`   | `import { service } from '@ember/service';`        |
| `imp object`    | `import { ${1:module} } from '@ember/object';`     |
| `imp comp`      | `import { ${1:module} } from '@ember/object/computed';` |

### Class Methods

| Trigger         | Content                                             |
| --------------- | --------------------------------------------------- |
| `efunc`         | `${1:methodName}() { ${2} }`                       |
| `efunc1`        | `${1:methodName}(${2:param}) { ${3} }`             |
| `efunc2`        | `${1:methodName}(${2:param1}, ${3:param2}) { ${4} }` |
| `efunc3`        | `${1:methodName}(${2:param1}, ${3:param2}, ${4:param3}) { ${5} }` |

### Ember Components & Classes

| Trigger         | Content                                             |
| --------------- | --------------------------------------------------- |
| `comp-g`        | `import Component from '@glimmer/component'; export default class ${1:ComponentName} extends Component { ${2} }` |
| `comp`          | `import Component from '@ember/component'; export default Component.extend({ ${1} });` |
| `route-g`       | `import Route from '@ember/routing/route'; export default class ${1:RouteName} extends Route { model() { ${2} } }` |
| `route`         | `import Route from '@ember/routing/route'; export default Route.extend({ model() { ${1} } });` |
| `service-g`     | `import Service from '@ember/service'; export default class ${1:ServiceName} extends Service { ${2} }` |
| `service`       | `import Service from '@ember/service'; export default Service.extend({ ${1} });` |
| `controller-g`  | `import Controller from '@ember/controller'; export default class ${1:ControllerName} extends Controller { ${2} }` |
| `controller`    | `import Controller from '@ember/controller'; export default Controller.extend({ ${1} });` |
| `comp-ts`       | `import Component from '@glimmer/component'; interface ${1:ComponentName}Args { // Define your component arguments here } export default class ${1:ComponentName} extends Component<${1:ComponentName}Args> { // Component logic here }` |

## Contribute

Contributions are welcome! Feel free to submit more snippets or modify existing ones.

[code]: https://code.visualstudio.com/
