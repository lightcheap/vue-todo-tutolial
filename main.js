/** データはDB等ではなく、ローカルストレージに保存するようにするので、
* ローカルストレージAPIを使用。
*/
let STORAGE_KEY = 'todos-vuejs-demo'
let todoStorage = {
    fetch: function() {
        let todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length

        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}


// コンストラクタ関数を使ってルートインスタンスを作成。
const app = new Vue({
    el: '#app',
    data: {
        // 使用するデータ
    },
    methods : {
        // 使用するメソッド
    }
});
