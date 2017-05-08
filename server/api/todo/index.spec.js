'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var todoCtrlStub = {
  index: 'todoCtrl.index',
  show: 'todoCtrl.show',
  create: 'todoCtrl.create',
  upsert: 'todoCtrl.upsert',
  patch: 'todoCtrl.patch',
  destroy: 'todoCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var todoIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './todo.controller': todoCtrlStub
});

describe('Todo API Router:', function() {
  it('should return an express router instance', function() {
    todoIndex.should.equal(routerStub);
  });

  describe('GET /api/todos', function() {
    it('should route to todo.controller.index', function() {
      routerStub.get
        .withArgs('/', 'todoCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/todos/:id', function() {
    it('should route to todo.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'todoCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/todos', function() {
    it('should route to todo.controller.create', function() {
      routerStub.post
        .withArgs('/', 'todoCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/todos/:id', function() {
    it('should route to todo.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'todoCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/todos/:id', function() {
    it('should route to todo.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'todoCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/todos/:id', function() {
    it('should route to todo.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'todoCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
