var app = angular.module('todoApp', []);

app.controller('TodoController', function ($scope) {
    $scope.selectedTodo = null;
    $scope.maxDate = 31; // 預設最大值
    $scope.newTodo = { month: null, date: null };

    // 初始化 ToDo 列表
    $scope.todos = JSON.parse(localStorage.getItem('list')) || [];
    
    // 新增 ToDo
    $scope.addTodo = function () {
        if (!$scope.newTodo || !$scope.newTodo.text) {
            alert('Please enter some text');
            return;
        }

        if($scope.newTodo.month && !/^(0?[1-9]|1[0-2])$/.test($scope.newTodo.month)) {
            return alert('請輸入正確月份!')
        }

        if($scope.newTodo.date > $scope.maxDate || !$scope.newTodo.date ){
            return alert('請輸入正確日期!')
        }

        let newTodo = {
            id: Date.now(),
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
        localStorage.setItem('list', JSON.stringify($scope.todos));
    };

    // 開啟彈窗
    $scope.openEditModal = function(todo) {
        console.log('openEditModal todo', todo);
        $scope.selectedTodo = angular.copy(todo); // 避免直接修改原始數據
        $scope.updateMaxDate();
        $('#editModal').modal('show'); // 使用 jQuery 觸發 Bootstrap Modal
    };

    // 刪除 ToDo
    $scope.deleteTodo = function (todo) {
        $scope.todos = $scope.todos.filter(function (item) {
            return item !== todo;
        });
        localStorage.setItem('list', JSON.stringify($scope.todos));
    };

    // 保存編輯
    $scope.saveEdit = function () {
        console.log('selectedTodo', $scope.selectedTodo);
        if($scope.selectedTodo.date > $scope.maxDate || !$scope.selectedTodo.date){
            return alert('請輸入正確日期!')
        }
        // console.log(list);
        // localStorage.setItem('list', JSON.stringify($scope.todos));

        if ($scope.selectedTodo) {
            let index = $scope.todos.findIndex(t => t.id === $scope.selectedTodo.id);
            console.log(123, index);
            if (index !== -1) {
                $scope.todos[index] = angular.copy($scope.selectedTodo);
            }
            localStorage.setItem('list', JSON.stringify($scope.todos));
        }
        $('#editModal').modal('hide');
    };

    // 取消編輯
    $scope.cancelEdit = function (todo) {
        todo.isEditing = false;
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

    $scope.updateMaxDate = function () {
        const month = $scope.newTodo.month;
        
        // 使用對應關係來設定最大天數
        const daysInMonth = {
            1: 31, 3: 31, 5: 31, 7: 31, 8: 31, 10: 31, 12: 31, // 31 天的月份
            4: 30, 6: 30, 9: 30, 11: 30, // 30 天的月份 
            2: 29 // 2 月最多 29 天
        };
    
        $scope.maxDate = daysInMonth[month] || 31; // 預設為 31（避免錯誤輸入）
    };
});
