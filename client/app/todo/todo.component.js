'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const xeditable = require('angular-xeditable');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor($http, socket) {
    this.$http = $http;
    this.socket = socket;
    this.doneFilter = false;
  }

  $onInit() {
    this.showList();
  }

  showList() {
    this.$http.get('/api/todos')
      .then(response => {
        this.todos = response.data;
        this.socket.syncUpdates('todo', this.todos);
      });
  }

  addTodo() {
    if(this.todo) {
      this.todo.done = false;
      this.$http.post('/api/todos', this.todo);
      this.todo = {};
    }
  }

  updateTodo(todo) {
    this.$http.put(`/api/todos/${todo._id}`, todo);
    this.showList();
  }

  deleteTodo(todo) {
    this.$http.delete(`/api/todos/${todo._id}`);
  }

  switchDoneFilter(flag) {
    this.doneFilter = flag;
  }

}

export default angular.module('meantodoApp.todo', [uiRouter, 'xeditable'])
  .config(routes)
  .component('todo', {
    template: require('./todo.pug'),
    controller: TodoComponent,
    controllerAs: 'todoCtrl'
  })
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })
  .name;
