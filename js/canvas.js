(function() {
	"use strict";

	window.addEventListener('DOMContentLoaded', function() {

        // 「筋斗雲を呼ぶ」ボタン押下時　イベント発火
        var callKintoneButton = document.getElementById("call_button");
        callKintoneButton.onclick = function() {
            // 「筋斗雲を呼ぶ」ボタンを削除　筋斗雲を呼べるのは最初の一回だけとする　
            document.getElementById("call_button").remove();
            // canvas作成
            var canvas = document.createElement('canvas');
            canvas.id = 'canvas_area';
            // メニューの下側にcanvas追加
            var canvasArea = document.getElementById("kintone");
            canvasArea.innerHTML = null;
            canvasArea.appendChild(canvas);

            // アニメーション処理準備
            var ctx = document.getElementById("canvas_area").getContext("2d");
            //　アニメーションカウンターを設定
            var animationCounter = 0;
            //　アニメーションフラグを設定
            var isAnimationFlag = false;

            // 筋斗雲を呼ぶアニメーション作成
            var timer_first = setInterval(function(){
                // 背景色で塗りつぶし、残像を残す
                // globalAlphaの数値が高いほど、塗りつぶされる値が濃くなるため、残像は薄くなる
                ctx.globalAlpha = 0.05;
                ctx.fillStyle="#3E83C8";
                ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
                // 雲の描写設定
                ctx.globalAlpha = 1;
                ctx.fillStyle="#FFBE00";
                ctx.beginPath();
                // 雲を作成 左から右へ移動し、少しずづ拡大していくように設定
                //  arc(x,y,radius, startAngle, endAngle, anticlockwise)
                ctx.arc(animationCounter,    20, 3　+ 0.02 * animationCounter, 180, Math.PI,   false);
                ctx.arc(animationCounter-3,  17, 3　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.arc(animationCounter-3,  23, 3　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.arc(animationCounter-8,  17, 5　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.arc(animationCounter-8,  23, 5　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.arc(animationCounter-13, 17, 3　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.arc(animationCounter-13, 23, 3　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.arc(animationCounter-15, 20, 3　+ 0.02 * animationCounter, 0,   Math.PI*2, false);
                ctx.fill();
                
                animationCounter++;

                if(animationCounter>430){
                    // 雲が過ぎ去ったころに、処理を停止し、残像を削除
                    clearInterval(timer_first);
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                    // 二回目のアニメーションを実行
                    animationCounter = 350;
                    var timer_second = setInterval(function(){
                        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                        ctx.fillStyle="#FFBE00";
                        ctx.beginPath();
                        // 雲を作成　右から左へ移動していくように設定
                        ctx.arc(animationCounter,     ctx.canvas.height-10, 30, 0, Math.PI*2, false);
                        ctx.arc(animationCounter+70,  ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                        ctx.arc(animationCounter+30,  ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                        ctx.arc(animationCounter+110, ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                        ctx.arc(animationCounter+150, ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                        ctx.arc(animationCounter+180, ctx.canvas.height-10, 30, 0, Math.PI*2, false);
                        ctx.fill();
                        animationCounter--;
                        if(animationCounter<65){
                            clearInterval(timer_second);
                            isAnimationFlag = true;
                            animationCounter = 0;
                            // アニメーション終了時　canvasの下部に、説明文を作成する
                            var explain = document.createElement('div');
                            explain.id = 'explain_area';
                            explain.className = 'alert-warning';
                            explain.innerHTML = '筋斗雲に乗せてみよう！名前をドラッグして筋斗雲の上にドロップしてみよう！' + '<br>' + '※こころが綺麗な人が乗れます！';
                            var explainArea = document.getElementById("canvas_area");
                            explainArea.parentNode.appendChild(explain);
                        }
                    // 処理間隔の単位はミリ秒
                    },10);
                }
            },10);

            // ドラッグandドロップイベント作成
            canvas.addEventListener('dragenter', dragEnter, false);
            canvas.addEventListener('dragleave', dragLeave, false);
            canvas.addEventListener('dragover',  dragOver,  false);
            canvas.addEventListener('drop',      dropEnd,   false);

            // ドラッグ操作時
            function dragOver(e) {
                if (e.preventDefault) {
                    e.preventDefault(); 
                }
                // dropEffectをmoveに設定　effectAllowed側もmoveに設定する必要あり
                e.dataTransfer.dropEffect = 'move';
                return false;
            }
            function dragEnter(e) {
                this.classList.add('canvas-area-drag-over-style');
            }
            function dragLeave(e) {
                this.classList.remove('canvas-area-drag-over-style');
            }
            function dropEnd(e) {
                this.classList.remove('canvas-area-drag-over-style');
                // drop時にブラウザがリダイレクトしないように設定
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                // アニメーション中はドロップイベント不可
                if (!isAnimationFlag) {
                    return false;
                }
                // ドロップした文字列を取得　userDataは　ユーザー名<span class="user-rank-hide">ランク</span>
                var userData = e.dataTransfer.getData('text/plain');
                // 取得した文字列から、ランクを取得
                var userRank = userData.substr(-8,1);
                // 取得した文字列から、ユーザー名を取得
                var userName = "";
                for(var i=0; i<userData.length; i++) {
                    if (userData.charAt(i) == '<') {
                        break;
                    }
                    userName += userData.charAt(i);
                }
                // ランクによって筋斗雲に乗れるか、フラグを設定
                var isRideFlag = "";
                if (userRank === 'S') {
                    isRideFlag = true;
                }　else if (userRank === 'A' || userRank === 'B' || userRank === 'C') {
                    isRideFlag = false;
                // 対象データでない場合　警告メッセージを表示 ドロップイベント不可
                } else {
                    alert("下の選択欄から選んでね！");
                    return false;
                }

                // 筋斗雲に乗るアニメーション作成
                var timer_ride = setInterval(function(){
                    isAnimationFlag = false;
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                    // 雲はctx.clearRectで削除されてしまうため、位置を固定し毎回作成
                    ctx.fillStyle="#FFBE00";
                    ctx.beginPath();
                    //  arc(x,y,radius, startAngle, endAngle, anticlockwise)
                    ctx.arc(65,  ctx.canvas.height-10, 30, 0, Math.PI*2, false);
                    ctx.arc(135, ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                    ctx.arc(95,  ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                    ctx.arc(175, ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                    ctx.arc(215, ctx.canvas.height-15, 40, 0, Math.PI*2, false);
                    ctx.arc(245, ctx.canvas.height-10, 30, 0, Math.PI*2, false);
                    ctx.fill();

                    // canvasエリアの左上に選択したユーザー名を表示
                    ctx.beginPath();
                    ctx.font = "12px 'ＭＳ Ｐゴシック'";
                    ctx.fillStyle = "#FFBE00";
                    ctx.fillText(userName,10,20);
                    
                    // 人型を作成
                    ctx.beginPath();
                    ctx.fillStyle="#FFF";
                    ctx.arc(155, animationCounter, 10, 0,   Math.PI*2, false);
                    ctx.fillRect(151, animationCounter, 8, 30);
                    ctx.fill();
                        
                    // 左腕
                    ctx.beginPath();
                    ctx.arc(145, animationCounter+15, 7, 35*Math.PI/180, 215*Math.PI/180, true);
                    ctx.closePath();
                    ctx.fill();

                    // 右腕
                    ctx.beginPath();
                    ctx.arc(165, animationCounter+15, 7, 145*Math.PI/180, 325*Math.PI/180, false);
                    ctx.closePath();
                    ctx.fill();

                    // 左足
                    ctx.beginPath();
                    ctx.arc(150, animationCounter+35, 7, 125*Math.PI/180, 305*Math.PI/180, false);
                    ctx.closePath();
                    ctx.fill();

                    // 右足
                    ctx.beginPath();
                    ctx.arc(160, animationCounter+35, 7, 55*Math.PI/180, 235*Math.PI/180, true);
                    ctx.closePath();
                    ctx.fill();
               
                    animationCounter++;

                    if (isRideFlag === true) {
                        if(animationCounter>100){
                            clearInterval(timer_ride);
                            // アニメーションカウンターリセット
                            animationCounter = 0;
                            isAnimationFlag = true;
                            alert(userName + " さんは心が綺麗ですね！");
                        }
                    } else {
                        if(animationCounter>180){
                            clearInterval(timer_ride);
                            // アニメーションカウンターリセット
                            animationCounter = 0;
                            isAnimationFlag = true;
                            alert(userName　+ " さんは修業が足りないみたいです！");
                        }
                    }
                },30);
            }
        };
    });
})();
