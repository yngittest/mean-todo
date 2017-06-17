'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
const xeditable = require('angular-xeditable');
const filter = require('angular-filter');
const moment = require('moment');

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
  }

  $onInit() {
    this.getTodos();
  }

  getTodos() {
    this.$http.get('/api/todos')
      .then(response => {
        this.todos = response.data;
        this.uncompletedTodos = this.$filter('filter')(response.data, {done:false});
        this.completedTodos = this.$filter('filter')(response.data, {done:true});
        this.getGroups(this.uncompletedTodos);
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
      if(todo.repeat === 1) {
        this.$http.post('/api/todos', this.repeatTodo(todo));
      }
    } else {
      todo.doneDate = '';
    }
    this.$http.put(`/api/todos/${todo._id}`, todo);
    this.getTodos();
  }

  deleteTodo(todo) {
    this.$http.delete(`/api/todos/${todo._id}`);
  }

  getGroups(todos) {
    this.groups = [];
    for(let todo of this.$filter('unique')(todos, 'group')) {
      this.groups.push(todo.group);
    }
  }

  toggleDatePicker($event, target) {
    $event.stopPropagation();
    this.datePickerOpen[target] = !this.datePickerOpen[target];
  }

  initializeDate() {
    let dt = moment();
    dt.minutes(Math.ceil(dt.minutes() / 5) * 5);
    dt.seconds(0);
    return dt.toDate();
  }

  delay(todo, duration, type) {
    let dt = moment(todo.due);
    dt.add(duration, type);
    todo.due = dt.toDate();
    if(todo._id) {
      this.updateTodo(todo);
    }
  }

  repeatSetting(todo) {
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
      let that = this;
      modalInstance.result.then(function(resultTodo) {
        that.updateTodo(resultTodo);
      }, function() {
        console.log('modal dismissed');
      });
    }
  }

  repeatTodo(todo) {
    let newDue;
    if(todo.repeatType === 'DueDate') {
      newDue = moment(todo.due);
    } else {
      newDue = moment(todo.doneDate);
      newDue.minutes(Math.ceil(newDue.minutes() / 5) * 5);
      newDue.seconds(0);
    }
    newDue.add(todo.repeatInterval, todo.repeatUnit);

    return {
      done: false,
      name: todo.name,
      group: todo.group,
      due: newDue.toDate(),
      repeat: todo.repeat,
      repeatType: todo.repeatType,
      repeatInterval: todo.repeatInterval,
      repeatUnit: todo.repeatUnit
    };
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
  .controller('ModalInstanceCtrl', function($uibModalInstance, targetTodo) {
    this.todo = targetTodo;

    const n = 30;
    this.intervals = new Array(n);
    for (var i = 0; i < n; i++) {
      this.intervals[i] = i + 1;
    }

    this.ok = function() {
      $uibModalInstance.close(this.todo);
    };

    this.cancel = function() {
      $uibModalInstance.dismiss();
    };
  })
  .name;
