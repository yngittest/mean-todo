'use strict';

describe('Component: TodoComponent', function() {
  // load the controller's module
  beforeEach(module('meantodoApp.todo'));

  var TodoComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TodoComponent = $componentController('todo', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
