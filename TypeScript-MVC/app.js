var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.listeners = {};
    }
    EventDispatcher.prototype.addEventListener = function (type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    };
    EventDispatcher.prototype.removeEventListener = function (type, callback) {
        for (var i = 0; i < this.listeners[type]; i++) {
            if (this.listeners[type][i] == callback) {
                this.listeners[type].splice(i, 1);
            }
        }
    };
    EventDispatcher.prototype.clearEventListener = function () {
        this.listeners = {};
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        if (this.listeners[event.type]) {
            for (var listener in this.listeners[event.type]) {
                this.listeners[event.type][listener].apply(this.listeners, arguments);
            }
        }
    };
    return EventDispatcher;
})();
var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel() {
        _super.call(this);
    }
    TodoModel.prototype.addNew = function (value) {
        console.log('Model: addNew value = ' + value);
        this.dispatchEvent({ type: 'added', task: value });
    };
    TodoModel.prototype.deleteDone = function () {
        console.log('Model: addNew');
        this.dispatchEvent({ type: 'deleteDone' });
    };
    TodoModel.prototype.deleteTask = function (index) {
        console.log('Model: deleteTask index = ' + index);
        this.dispatchEvent({ type: 'deletedTask', index: index });
    };
    TodoModel.prototype.getTaskCount = function (taskNode) {
        console.log('Model: getDoneCount taskNode = ' + taskNode);
        var count = 0;
        for (var i = 0; i < taskNode.length; i++) {
            count += taskNode[i].childNodes[0].checked ? 1 : 0;
        }
        this.dispatchEvent({ type: 'getDoneCount', doneCount: count, taskCount: taskNode.length });
    };
    return TodoModel;
})(EventDispatcher);
var TodoView = (function () {
    function TodoView(model, controller) {
        this.model = model;
        this.controller = controller;
        var self = this;
        this.newTaskBody = document.getElementById('newTaskBody');
        this.tasks = document.getElementById('tasks');
        this.taskItems = document.getElementsByTagName('li');
        this.addButton = document.getElementById('add');
        this.addButton.onclick = function () {
            controller.addNew(self.newTaskBody.value);
            controller.getTaskCount(self.taskItems);
        };
        model.addEventListener('added', function (event) {
            self.addNew(event.task);
        });
        this.delButton = document.getElementById('deleteDone');
        this.delButton.onclick = function () {
            controller.deleteDone();
            controller.getTaskCount(self.taskItems);
        };
        model.addEventListener('deleteDone', function (event) {
            self.deleteDone();
        });
        this.delLink = document.getElementsByTagName('a');
        this.model.addEventListener('deletedTask', function (event) {
            self.deleteTask(event.index);
        });
        this.doneCount = document.getElementById('doneCount');
        this.taskCount = document.getElementById('taskCount');
        this.doneCount.innerHTML = '0';
        this.taskCount.innerHTML = '0';
        this.model.addEventListener('getDoneCount', function (event) {
            self.renderCounter(event.doneCount, event.taskCount);
        });
    }
    TodoView.prototype.addNew = function (value) {
        console.log('View: addNew value = ' + value);
        var self = this;
        var li = document.createElement('li');
        var doneCheckbox = document.createElement('input');
        doneCheckbox.type = 'checkbox';
        doneCheckbox.onclick = function () {
            self.controller.getTaskCount(self.taskItems);
        };
        var taskBody = document.createElement('span');
        taskBody.innerHTML = value;
        var delLink = document.createElement('a');
        delLink.innerHTML = '[x]';
        delLink.href = '#';
        delLink.onclick = function () {
            var index = self.getIndex(this.parentNode);
            self.controller.deleteTask(index);
            self.controller.getTaskCount(self.taskItems);
        };
        li.appendChild(doneCheckbox);
        li.appendChild(taskBody);
        li.appendChild(delLink);
        this.tasks.appendChild(li);
        this.newTaskBody.value = '';
    };
    TodoView.prototype.deleteTask = function (index) {
        console.log('View: deleteTask index = ' + index);
        this.tasks.removeChild(this.tasks.children[index]);
    };
    TodoView.prototype.deleteDone = function () {
        console.log('View: deleteDone');
        var taskList = document.getElementsByTagName('li');
        for (var i = taskList.length - 1; 0 <= i; i--) {
            if (taskList[i].children[0].checked) {
                this.tasks.removeChild(this.tasks.children[i]);
            }
        }
    };
    TodoView.prototype.getIndex = function (node) {
        console.log('View: getIndex node = ' + node);
        var children = node.parentNode.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (node == children[i])
                break;
        }
        return i - 1;
    };
    TodoView.prototype.renderCounter = function (doneCount, taskCount) {
        this.doneCount.innerHTML = doneCount.toString();
        this.taskCount.innerHTML = taskCount.toString();
    };
    return TodoView;
})();
var TodoController = (function () {
    function TodoController(model) {
        this.model = model;
    }
    TodoController.prototype.addNew = function (value) {
        console.log('Controller: addNew value = ' + value);
        this.model.addNew(value);
    };
    TodoController.prototype.deleteDone = function () {
        console.log('Controller: deleteDone');
        this.model.deleteDone();
    };
    TodoController.prototype.deleteTask = function (index) {
        console.log('Controller: deleteTask index = ' + index);
        this.model.deleteTask(index);
    };
    TodoController.prototype.getTaskCount = function (taskNode) {
        console.log('Controller: getDoneCount taskNode = ' + taskNode);
        this.model.getTaskCount(taskNode);
    };
    return TodoController;
})();
var App = (function () {
    function App() {
        var model = new TodoModel();
        var controller = new TodoController(model);
        var view = new TodoView(model, controller);
    }
    return App;
})();
window.onload = function () {
    'use strict';
    var app = new App();
};
//# sourceMappingURL=app.js.map