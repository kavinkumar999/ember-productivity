# Ember Productivity

This extension enhances your workflow with easy switching between related Ember files and layouts in [Visual Studio Code](https://code.visualstudio.com/). It also includes a collection of Ember JS and Handlebars snippets to streamline your development process.


## Switch Related Files

![Switch Related Files](https://raw.githubusercontent.com/kavinkumar999/ember-productivity/main/images/switch-files.gif)

### Default Keybindings for Ember Productivity Addon

The Ember Productivity Addon includes keybindings to easily switch between related files:

- **Mac:** `Cmd + R`
- **Win/Linux:** `Ctrl + R`

### File Switches

- **Route → Controller → Template**
- **Component → Template**

## Supported Layouts

- **Classic**
- **Pods**

## Supported Languages (File Extensions)

* JavaScript (.js)
* TypeScript (.ts)
* Handlebars (.hbs)

## Handlebars Snippets CheatSheet

Below is a list of available Handlebars snippets and their triggers. The **⇥** represents the `TAB` key.

![code-snippets](https://raw.githubusercontent.com/kavinkumar999/ember-productivity/main/images/snippets.gif)

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
| `each`          | `{{#each ${1:list} as \|${2:item}\|}} ${3} {{/each}}` |
| `eachx`         | `{{#each ${1:list} as \|${2:item} ${3:index}\|}} ${4} {{/each}}` |
| `eachin`        | `{{#each-in ${1:object} as \|${2:key} ${3:value}\|}} ${4} {{/each-in}}` |
| `eachinel`      | `{{#each-in ${1:object} as \|${2:key} ${3:value}\|}} ${4} {{else}} ${5} {{/each-in}}` |
| `comp`          | `<${1:component} @${2:arg1}="${3:value1}" @${4:arg2}="${5:value2}"> ${6} </${1:component}>` |
| `yield`         | `{{yield ${1:defaultContent}}}`                   |
| `concat`        | `{{concat ${1:string1} ${2:string2}}}`            |

## JavaScript / TypeScript Ember file CheatSheet
# Ember Snippets

### Ember Computed Properties

#### Ember Computed Property (Modern)

**Trigger**: `ecomputed`

```javascript
get ${1:computedPropertyName}() {
  return ${2:// Computed property implementation};
}
```

#### Ember Computed Property (Classic)

**Trigger**: `ecomputed-classic`

```javascript
${1:computedPropertyName}: computed('${2:dependentKey}', function() {
  return ${3:// Computed property implementation};
})
```

### Ember Components

#### Ember Component (Octane)

**Trigger**: `ecomponent`

```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ${1:ComponentName} extends Component {
  @action
  ${2:handleAction}() {
    ${3:// Action implementation}
  }
}
```

#### Ember Component (Classic)

**Trigger**: `ecomponent-classic`

```javascript
import Component from '@ember/component';

export default Component.extend({
  ${1:// component properties and methods}
  actions: {
    ${2:actionName}() {
      ${3:// Action implementation}
    }
  }
});
```

#### Ember Component (Octane with TypeScript)

**Trigger**: `ecomponent-ts`

```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';

interface ${1:ComponentName}Args {
  ${2:// Define component arguments}
}

export default class ${1:ComponentName} extends Component<${1:ComponentName}Args> {
  @action
  ${3:handleAction}(): void {
    ${4:// Action implementation}
  }
}
```

### Ember Routes

#### Ember Route (Octane)

**Trigger**: `eroute`

```javascript
import Route from '@ember/routing/route';

export default class ${1:RouteName} extends Route {
  async model(params) {
    ${2:// Fetch and return the model}
  }
}
```

#### Ember Route (Classic)

**Trigger**: `eroute-classic`

```javascript
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    ${1:// Fetch and return the model}
  }
});
```

### Ember Controllers

#### Ember Controller (Octane)

**Trigger**: `econtroller`

```javascript
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ${1:ControllerName} extends Controller {
  @tracked ${2:property} = ${3:initialValue};

  @action
  ${4:handleAction}() {
    ${5:// Action implementation}
  }
}
```

#### Ember Controller (Classic)

**Trigger**: `econtroller-classic`

```javascript
import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  ${1:property}: null,

  ${2:computedProperty}: computed('${3:dependentKey}', function() {
    ${4:// Computed property implementation}
  }),

  actions: {
    ${5:actionName}() {
      ${6:// Action implementation}
    }
  }
});
```

### Ember Services

#### Ember Service (Octane)

**Trigger**: `eservice`

```javascript
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ${1:ServiceName} extends Service {
  @tracked ${2:property} = ${3:initialValue};

  ${4:methodName}() {
    ${5:// Method implementation}
  }
}
```

#### Ember Service (Classic)

**Trigger**: `eservice-classic`

```javascript
import Service from '@ember/service';

export default Service.extend({
  ${1:property}: null,

  ${2:methodName}() {
    ${3:// Method implementation}
  }
});
```

### Ember Helpers

#### Ember Helper (Octane)

**Trigger**: `ehelper`

```javascript
import { helper } from '@ember/component/helper';

function ${1:helperName}([${2:param1}, ${3:param2}], hash) {
  ${4:// Helper implementation}
}

export default helper(${1:helperName});
```

#### Ember Helper (Classic)

**Trigger**: `ehelper-classic`

```javascript
import { helper } from '@ember/component/helper';

export function ${1:helperName}([${2:param1}, ${3:param2}], hash) {
  ${4:// Helper implementation}
}

export default helper(${1:helperName});
```

### Ember Actions

#### Ember Action (Octane)

**Trigger**: `eaction`

```javascript
@action
${1:actionName}(${2:event}) {
  ${3:// Action implementation}
}
```

#### Ember Action (Classic)

**Trigger**: `eaction-classic`

```javascript
actions: {
  ${1:actionName}(${2:event}) {
    ${3:// Action implementation}
  }
}
```

### Ember Tests

#### Ember Test (Octane)

**Trigger**: `etest`

```javascript
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('${1:ModuleName}', function(hooks) {
  setupTest(hooks);

  test('${2:it does something}', async function(assert) {
    ${3:// Test implementation}
    assert.ok(true);
  });
});
```

### Ember Models

#### Ember Model (Octane)

**Trigger**: `emodel`

```javascript
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ${1:ModelName} extends Model {
  @attr('string') ${2:attribute1};
  @attr('number') ${3:attribute2};
  @belongsTo('${4:otherModel}') ${5:relationship1};
  @hasMany('${6:anotherModel}') ${7:relationship2};
}
```

#### Ember Model (Classic)

**Trigger**: `emodel-classic`

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  ${1:attribute1}: DS.attr('string'),
  ${2:attribute2}: DS.attr('number'),
  ${3:relationship1}: DS.belongsTo('${4:otherModel}'),
  ${5:relationship2}: DS.hasMany('${6:anotherModel}')
});
```