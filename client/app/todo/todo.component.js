'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const xeditable = require('angular-xeditable');
const filter = require('angular-filter');

import routes from './todo.routes';

export class TodoComponent {
  /*@ngInject*/
  constructor($http, socket, $filter, $uibModal) {
    this.$http = $http;
    this.socket = socket;
    this.$filter = $filter;
    this.$uibModal = $uibModal;

    this.newTodo = {};
    this.newTodo.due = this.initializeDate();

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
      this.newTodo.due = this.initializeDate();
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

  delayDue(todo) {
    let modalInstance = this.$uibModal.open({
      templateUrl: 'repeatSetting.pug',
      controller: 'ModalInstanceCtrl',
      controllerAs: 'modalCtrl',
      size: 'sm',
      resolve: {
        targetTodo: function() {
          return todo;
        }
      }
    });
    if(todo._id) {
      let self = this;
      modalInstance.result.then(function(delayedTodo) {
        self.updateTodo(delayedTodo);
      });
    }
  }

  initializeDate() {
    let dt = new Date();
    dt.setMinutes(Math.ceil(dt.getMinutes() / 5) * 5);
    dt.setSeconds(0);
    return dt;
  }

  delay(todo, type) {
    let dt = new Date(todo.due);
    if(type === 'min') {
      dt.setMinutes(dt.getMinutes() + 10);
    }else if(type === 'hour') {
      dt.setHours(dt.getHours() + 1);
    }else if(type === 'day') {
      dt.setDate(dt.getDate() + 1);
    }
    todo.due = dt;
    if(todo._id) {
      this.updateTodo(todo);
    }
  }

}

export default angular.module('meantodoApp.todo', [uiRouter, 'xeditable', filter])
  .config(routes)
  .component('todo', {
    template: require('./todo.pug'),
    controller: TodoComponent,
    controllerAs: 'todoCtrl'
  })
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })
  .controller('ModalInstanceCtrl', function ($uibModalInstance, targetTodo) {
    this.todo = targetTodo;

    this.addMinutes = function(minutes) {
      let dt = new Date(this.todo.due);
      dt.setMinutes(dt.getMinutes() + minutes);
      this.todo.due = dt;
    };
    this.addHours = function(hours) {
      let dt = new Date(this.todo.due);
      dt.setHours(dt.getHours() + hours);
      this.todo.due = dt;
    };
    this.addDays = function(days) {
      let dt = new Date(this.todo.due);
      dt.setDate(dt.getDate() + days);
      this.todo.due = dt;
    };

    this.ok = function () {
      $uibModalInstance.close(this.todo);
    };

    this.cancel = function () {
      $uibModalInstance.dismiss();
    };
  })
  .name;
