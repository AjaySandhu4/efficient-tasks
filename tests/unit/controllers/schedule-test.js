import { module, test } from 'qunit';
import { setupTest } from 'efficient-tasks/tests/helpers';

module('Unit | Controller | schedule', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:schedule');
    assert.ok(controller);
  });
});