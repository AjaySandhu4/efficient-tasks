import { module, test } from 'qunit';
import { setupTest } from 'efficient-tasks/tests/helpers';

module('Unit | Model | course', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('course', {});
    assert.ok(model);
  });
});
