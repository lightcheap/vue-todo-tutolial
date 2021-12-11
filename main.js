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
        todos: [],
        options: [
            { value: -1, label: 'すべて'},
            { value: 0,  label: '作業中'},
            { value: 1,  label: '完了'}
        ],
        // 選択しているoptions の value を記憶するためのデータ
        // 初期値を「-1」つまり「すべて」
        current: -1
    },
    /** ここにはライフサイクルメソッドを置けない */
    methods : {
        // 使用するメソッド
        // doAdd... フォームの入力値を取得して新しいTodoの処理を追加。
        doAdd: function(event, value) {
            // ref で名前を付けておいた要素を参照
            let comment = this.$refs.comment
            // 入力がなければ何もしないでreturn
            if (!comment.value.length) {
                return
            }

            /**
             * { 新しいID，コメント, 作業状態 }
             * というオブジェクトを現在の todos リストへ push
             * 作業状態「state」はデフォルト「作業中＝０」で作成
             */
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            })
            // フォーム要素を空にする
            comment.value = ''
        },
        // 状態変更の処理
        doChangeState: function(item) {
            item.state = item.state ? 0 : 1
        },
        // 削除の処理
        doRemove: function(item) {
            let index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        }

    },
    /* ↓todos のデータ内容が変わると、自動的にストレージに保存する処理*/
    watch: {
        // オプションを使う場合はオブジェクト形式にする
        todos: {
            // 引数はウォッチしているプロパティの変更後の値
            handler: function(todos) {
                todoStorage.save(todos)
            },
            // deepオプションでネストしているデータも監視できる
            deep: true
        }
    },
    /**
     * currentデータの選択値によって表示させるTodoリストの内容を振り分けるため
     * 「算出プロパティ」という機能を使用。
     * 算出プロパティはデータから別の新しいデータを作成する関数型のデータです。
     * 算出プロパティは元になったデータに変更があるまで、結果をキャッシュする性質がある
     */
    computed: {
        labels() {
            return this.options.reduce(function(a, b) {
                return Object.assign(a, { [b.value]: b.label })
            }, {})
            // キーから見つけやすいように、次のように加工したデータを作成
            // {0: '作業中', 1: '完了', -1: 'すべて'}
        },
        computedTodos: function() {
            // データがcurrent が -1 ならすべて
            // それ以外ならcurrentとstateが一致するものだけに絞り込む
            return this.todos.filter(function(el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        }
    },

    /* 保存されたリストを取得する。タイミングはインスタンス作成時
       → createdメソッド */
    created() {
        // インスタンス作成時に自動的にfetch()する
        this.todos = todoStorage.fetch()
    },
});
