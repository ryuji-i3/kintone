(function(){
    "use strict";

        window.addEventListener('DOMContentLoaded', function() {

        // ドラッグイベント作成
        var names = document.querySelectorAll('.user-name-area');
        Array.prototype.forEach.call(names, function(name) {
            name.addEventListener('dragstart', dragStart, false);
            name.addEventListener('dragend',   dragEnd,   false);
        });
        
        // ゴースト画像を作成
        var dragIcon = document.createElement('img');
        dragIcon.src = 'img/human.png';

        // ドラッグスタート時
        function dragStart(e) {
            // ゴースト画像を設定
            dragIcon.width = 100;
            e.dataTransfer.setDragImage(dragIcon, 150, 50);
            this.style.opacity = '0.3';
            // effectAllowedをmoveに設定　dropEffect側もmoveに設定する必要あり
            e.dataTransfer.effectAllowed = 'move';
            // dropイベント時に次のデータを渡す
            // ユーザー名<span class="user-rank-hide">ランク</span>
            e.dataTransfer.setData('text/plain', this.innerHTML);
        }
        // ドラッグエンド時
        function dragEnd(e) {
            this.style.opacity = '1';
        }
    });
})();
