var app = angular.module('todoApp', []);

app.controller('TodoController', function ($scope) {
    // 初始化 ToDo 列表
    $scope.todos = JSON.parse(localStorage.getItem('list')) || [];
    
    // 新增 ToDo
    $scope.addTodo = function () {
        if (!$scope.newTodo || !$scope.newTodo.text) {
            alert('Please enter some text');
            return;
        }

        let newTodo = {
            text: $scope.newTodo.text,
            month: $scope.newTodo.month || '',
            date: $scope.newTodo.date || '',
            done: false
        };

        $scope.todos.push(newTodo);
        localStorage.setItem('list', JSON.stringify($scope.todos));

        // 清空輸入框
        $scope.newTodo.text = '';
        $scope.newTodo.month = '';
        $scope.newTodo.date = '';
    };

    // 切換完成狀態
    $scope.toggleComplete = function (todo) {
        todo.done = !todo.done;
    };

    // 刪除 ToDo
    $scope.deleteTodo = function (todo) {
        $scope.todos = $scope.todos.filter(function (item) {
            return item !== todo;
        });
        localStorage.setItem('list', JSON.stringify($scope.todos));
    };

    // 排序 ToDos
    $scope.sortTodos = function () {
        $scope.todos = mergeSort($scope.todos);
        localStorage.setItem('list', JSON.stringify($scope.todos));
    };

    function mergeTime(arr1, arr2) {
        let result = [];
        let i = 0;
        let j = 0;

        while (i < arr1.length && j < arr2.length) {
            if (Number(arr1[i].month) > Number(arr2[j].month)) {
                result.push(arr2[j]);
                j++;
            } else if (Number(arr1[i].month) < Number(arr2[j].month)) {
                result.push(arr1[i]);
                i++;
            } else if (Number(arr1[i].month) === Number(arr2[j].month)) {
                if (Number(arr1[i].date) > Number(arr2[j].date)) {
                    result.push(arr2[j]);
                    j++;
                } else {
                    result.push(arr1[i]);
                    i++;
                }
            }
        }

        while (i < arr1.length) {
            result.push(arr1[i]);
            i++;
        }

        while (j < arr2.length) {
            result.push(arr2[j]);
            j++;
        }

        return result;
    }

    function mergeSort(arr) {
        if (arr.length === 1) {
            return arr;
        } else {
            let middle = Math.floor(arr.length / 2);
            let right = arr.slice(0, middle);
            let left = arr.slice(middle, arr.length);
            return mergeTime(mergeSort(right), mergeSort(left));
        }
    }
});
