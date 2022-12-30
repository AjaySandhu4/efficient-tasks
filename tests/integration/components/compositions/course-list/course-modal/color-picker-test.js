import { module, test } from 'qunit';
import { setupRenderingTest } from 'efficient-tasks/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | compositions/course-list/course-modal/color-picker',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<Compositions::CourseList::CourseModal::ColorPicker />`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      await render(hbs`
      <Compositions::CourseList::CourseModal::ColorPicker>
        template block text
      </Compositions::CourseList::CourseModal::ColorPicker>
    `);

      assert.dom(this.element).hasText('template block text');
    });
  }
);
