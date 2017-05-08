'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor($resource) {
    this.Todo = $resource(
      '/api/todos/:_id',
      { _id: '@_id'},
      { update: { method:   'PUT' } }
    );
    this.todos = this.Todo.query();
  }

  oninsert() {
    this.Todo.save(
      this.todo,
      function() {
        this.todos = this.Todo.query();
        this.todo = {};
      }
    );
  }
}

TodoComponent.$inject = ['$resource'];

export default angular.module('meantodoApp.todo', [uiRouter])
  .config(routes)
  .component('todo', {
    template: require('./todo.pug'),
    controller: TodoComponent,
    controllerAs: 'todoCtrl'
  })
  .name;
