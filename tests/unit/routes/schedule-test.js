import { module, test } from 'qunit';
import { setupTest } from 'efficient-tasks/tests/helpers';

module('Unit | Route | schedule', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:schedule');
    assert.ok(route);
  });
});
