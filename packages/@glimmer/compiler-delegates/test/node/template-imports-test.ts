import { getTemplateImports, stripTemplateImports } from '@glimmer/compiler-delegates';
import { stripIndents } from 'common-tags';

const { module, test } = QUnit;

module('Template Imports Test', function() {
  test('returns empty object when there are no imports defined', function (assert) {
    assert.deepEqual(getTemplateImports(''), {});
    assert.deepEqual(getTemplateImports('{{test}}'), {});
    assert.deepEqual(getTemplateImports('---\n---'), {});
  });

  test('throws an error if anything besides an import is used', function (assert) {
    assert.throws(() => {
      getTemplateImports(`---
      import A from 'some-lib';

      A.OtherThing = 42;
      ---`);
    });
  });

  test('throws an error if unsupported imports are used', function (assert) {
    assert.throws(() => {
      getTemplateImports(`---
      import A from 'some-lib';
      ---`);
    }, /Default.*disallowed/);

    assert.throws(() => {
      getTemplateImports(`---
      import * as A from 'some-lib';
      ---`);
    }, /star.*disallowed/);
  });

  test('can handle named imports', function (assert) {
    assert.deepEqual(getTemplateImports(`---
    import {A} from 'some-lib';
    ---`), {
      A: {
        importedName: 'A',
        moduleName: 'some-lib'
      }
    });
  });

  test('can handle named imports with different local names', function (assert) {
    assert.deepEqual(getTemplateImports(`---
    import {A as LocalA} from 'some-lib';
    ---`), {
      LocalA: {
        importedName: 'A',
        moduleName: 'some-lib'
      }
    });
  });

  test('can handle multiple imports', function (assert) {
    assert.deepEqual(getTemplateImports(`---
    import {A as LocalA} from 'some-lib';
    import {B} from 'other-lib';
    ---`), {
      LocalA: {
        importedName: 'A',
        moduleName: 'some-lib'
      },
      B: {
        importedName: 'B',
        moduleName: 'other-lib'
      }
    });
  });

  test('can strip imports from the template source', function (assert) {
    assert.equal(stripTemplateImports('{{name}}'), '{{name}}');
    assert.equal(stripTemplateImports(stripIndents`---
    ---
    <h1>{{name}}</h1>`), '<h1>{{name}}</h1>');

    assert.equal(stripTemplateImports(stripIndents`---
    import {A, B} from 'some-lib';
    import { C } from 'other-lib';
    ---
    <h1>{{name}}</h1>`), '<h1>{{name}}</h1>');
  });
});
