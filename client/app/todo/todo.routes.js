'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('todo', {
      url: '/todo',
      template: '<todo></todo>'
    });
}
