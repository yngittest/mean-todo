'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor($http, socket) {
    this.$http = $http;
    this.socket = socket;
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
      this.$http.post('/api/todos', this.todo);
      this.todo = {};
    }
  }

  updateTodo() {
    if(this.todo) {
      this.$http.put(`/api/todos/${this.todo._id}`, this.todo);
      this.todo = {};
      this.showList();
    }
  }

  editTodo(_id) {
    this.$http.get(`/api/todos/${_id}`)
      .then(response => {
        this.todo = response.data;
      });
  }

  deleteTodo(_id) {
    this.$http.delete(`/api/todos/${_id}`);
  }

}

export default angular.module('meantodoApp.todo', [uiRouter])
  .config(routes)
  .component('todo', {
    template: require('./todo.pug'),
    controller: TodoComponent,
    controllerAs: 'todoCtrl'
  })
  .name;
