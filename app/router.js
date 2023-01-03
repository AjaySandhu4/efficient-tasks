import EmberRouter from '@ember/routing/router';
import config from 'efficient-tasks/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('schedules', function () {
    this.route('schedule', { path: '/:id' });
  });
});
