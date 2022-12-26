import { module, test } from 'qunit';
import { setupRenderingTest } from 'efficient-tasks/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | compositions/tasks-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Compositions::TasksTable />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Compositions::TasksTable>
        template block text
      </Compositions::TasksTable>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
