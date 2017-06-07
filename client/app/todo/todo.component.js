'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const xeditable = require('angular-xeditable');
const angularFilter = require('angular-filter');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor($http, socket, $filter) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;

    this.newTodo = {};
    this.newTodo.due = new Date();
    this.datePickerOpen = {};

    this.showDone = false;
    this.doneFilter = false;
  }

  $onInit() {
    this.getTodos();
  }

  getTodos() {
    this.$http.get('/api/todos')
      .then(response => {
        this.todos = response.data
        this.getGroups();
        this.socket.syncUpdates('todo', this.todos);
      });
  }

  sortTodos(exp, reverse) {
    this.todos = this.$filter('orderBy')(this.todos, exp, reverse);
  }

  addTodo() {
    if(this.newTodo) {
      this.newTodo.done = false;
      this.$http.post('/api/todos', this.newTodo);
      this.newTodo = {};
      this.newTodo.due = new Date();
      this.getTodos();
    }
  }

  updateTodo(todo) {
    if(todo.done) {
      todo.doneDate = new Date();
    } else {
      todo.doneDate = '';
    }
    this.$http.put(`/api/todos/${todo._id}`, todo);
    this.getTodos();
  }

  deleteTodo(todo) {
    this.$http.delete(`/api/todos/${todo._id}`);
  }

  getGroups() {
    this.groups = [];
    for (let todo of this.$filter('unique')(this.todos, 'group')) {
      this.groups.push(todo.group);
    }
  }

  toggleDatePicker($event, target) {
    $event.stopPropagation();
    this.datePickerOpen[target] = !this.datePickerOpen[target];
  }

  toggleDoneFilter() {
    if(this.showDone) {
      this.doneFilter = undefined;
    } else {
      this.doneFilter = false;
    }
  }

}

export default angular.module('meantodoApp.todo', [uiRouter, 'xeditable', angularFilter])
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
