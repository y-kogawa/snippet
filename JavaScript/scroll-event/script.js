/*
 * Scroll Event ver 0.2.0
 * Author: Yoshito Kogawa
 */
(function($){
	// 使用する変数を登録
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
		browser = {
			std: navigator.userAgent,
			ua: navigator.userAgent.toLowerCase(),
			ver: navigator.appVersion.toLowerCase()
		},
		win = {
			elm: $(window),
			w: $(window).width(),
			h: $(window).height()
		},
		scrl = {
			top: false,
			_top: false,
			vector: false,
			overlap: true
		},
		wheel = {
			vector: false
		},
		scene = {
			elm: false,
			event: [],
			pos_top: [],
			pos_bottom: [],
			current: false,
			_current: -1
		},
		content = {
			elm: false,
			event: [],
			pos_top: [],
			pos_bottom: [],
			current: false,
			_current: -1
		};

	// 閲覧ブラウザの取得
	var _getBrowser = function(){
		var name = 'unknownBrowser';
		if (browser.ua.indexOf("msie") != -1){
			if (browser.ver.indexOf("msie 6.") != -1){
				name = 'ie6';
			}else if (browser.ver.indexOf("msie 7.") != -1){
				name = 'ie7';
			}else if (browser.ver.indexOf("msie 8.") != -1){
				name = 'ie8';
			}else if (browser.ver.indexOf("msie 9.") != -1){
				name = 'ie9';
			}else if (browser.ver.indexOf("msie 10.") != -1){
				name = 'ie10';
			}else{
				name = 'ie';
		    }
		}else if(browser.ua.indexOf('trident/7') != -1){
			name = 'ie11';
		}else if (browser.ua.indexOf('chrome') != -1){
			name = 'chrome';
		}else if (browser.ua.indexOf('safari') != -1){
			name = 'safari';
		}else if (browser.ua.indexOf('opera') != -1){
			name = 'opera';
		}else if (browser.ua.indexOf('firefox') != -1){
			name = 'firefox';
		}
		return name;
	};

	// 閲覧ブラウザのOSを取得
	var _getOS = function(){
		var name = 'unknownOs';
		if (browser.std.indexOf('Win') > 0) {
			name = 'win';
		} else if (browser.std.indexOf('Mac') > 0){
			name = 'mac';
		} else if (browser.std.indexOf('iPhone') > 0){
			name = 'iphone';
		} else if (browser.std.indexOf('iPad') > 0){
			name = 'ipad';
		} else if (browser.std.indexOf('iPod') > 0){
			name = 'ipod';
		} else if (browser.std.indexOf('Android') > 0){
			name = 'android';
		}
		return name;
	};

	var _getScroll = function(vector){
		if(vector == 'Y'){
			return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
		}else if(vector == 'X'){
			return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft
		}

	};

	var _getNowTime = function(){
		var today = new Date();
		var nowTime = [('0'+today.getHours()).slice(-2),
						('0'+today.getMinutes()).slice(-2),
						('0'+today.getSeconds()).slice(-2),
						('0'+today.getMilliseconds()).slice(-2)].join(':');
		return nowTime;
	};

	var scrollEvent = function(){
		scrl.top = $(window).scrollTop();
		$('#scrollTop').find('.output').text(scrl.top);
		$('#scrollVector').find('.output').text(scrl.vector);
		$('#wheelVector').find('.output').text(wheel.vector);

		if(scrl.top > scrl._top){
			scrl.vector = 'down';

		}else if(scrl.top < scrl._top){
			scrl.vector = 'up';

		}

		// シーンのカレントを取得
		sceneEvent._setCurrent();
		$('#currentPos').find('.output').text(scene.current + ' / Reload: ' + _getNowTime());

		// シーンのカレントが変わった瞬間だけ実行
		if(scene.current != scene._current){
			$('#currentPosEx').find('.output').text(scene.current + ' / Reload: ' + _getNowTime());
			sceneEvent.run();
		}
		scene._current = scene.current;

		// コンテンツのイベント実行
		contentEvent.run();

		scrl._top = scrl.top;
	};

	// シーンの切り替わり
	var sceneEvent = {
		_init: function(){
			scene.elm = $('#scenes').find('.scene');
			scene.max = scene.elm.length;

			for(var i=0;i<scene.max;i++){
				var _self = $(scene.elm[i]);

				// 各シーンのイベントを取得
				scene.event.push(_self.data('scene-event'));

				// 各シーンのトップ位置を取得
				scene.pos_top.push(_self.offset().top);

				// 各シーンのボトム位置を取得
				scene.pos_bottom.push(_self.offset().top + _self.outerHeight());

			}

		},

		_setCurrent: function(){
			for(var i=0;i<scene.max;i++){
				// スクロールが最後に到達したら最後の要素をカレントとする
				if(scrl.top >= scene.pos_bottom[scene.max - 1] - win.h){
					scene.current = scene.max - 1;

				// 各シーンのトップ以上、ボトム以下の位置にスクロールがあったら、その位置をカレントとする
				}else if(scrl.top >= scene.pos_top[i] && scrl.top < scene.pos_bottom[i]){
					scene.current = i;

				}
			}
			return scene.current;
		},

		run: function(){
			$('#event').find('.output').text(scene.event[scene.current] + ' / Reload: ' + _getNowTime());
		},
	};

	// コンテントイベント
	var contentEvent = {
		_init: function(){
			content.elm = $('[data-content-in-event]');
			content.max = content.elm.length;

			for(var i=0;i<content.max;i++){
				var _self = $(content.elm[i]);

				// 各シーンのイベントを取得
				content.event.push(_self.data('content-in-event'));

				// 各シーンのトップ位置を取得
				content.pos_top.push(_self.offset().top);

				// 各シーンのボトム位置を取得
				content.pos_bottom.push(_self.offset().top + _self.outerHeight());

			}

			console.log(content);
		},

		run: function(){
			var _sefl;
			for(var i=0;i<content.max;i++){
				_self = $(content.elm[i]);
				if(scrl.top >= content.pos_top[i] - win.h && scrl.top < content.pos_bottom[i] && !_self.data('event_exe')){
					_self.data('event_exe', 1);
					content.current = i;
					$('#contentEvent').find('.output').text(content.event[content.current] + ' / Reload: ' + _getNowTime());

				}else if(scrl.top <= content.pos_top[i] - win.h && _self.data('event_exe')){
					_self.data('event_exe', 0);

				}
			}

		},
	};

	$('html').addClass(_getBrowser() + ' ' + _getOS());
	$(function(){
		sceneEvent._init();
		contentEvent._init();

		;(function(){
			var target_browser = (scrl.overlap && (_getBrowser() == 'chrome' && _getOS() == 'win')),
				scrl_increment = 50, scrl_x, scrl_y, scrl_pos
			;

			var onWheel = function(e){
				if(!e) e = window.event; //for legacy IE
				var delta_y = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);

				// 下にスクロール
				if (delta_y < 0){
					wheel.vector = 'down';
					if(target_browser){
						e.preventDefault();

						// スクロール位置の算出
						scrl_x = window.scrollX; // IEも対象にするなら_getScroll('X')を使用する
						scrl_y = window.scrollY; // IEも対象にするなら_getScroll('Y')を使用する
						scrl_y = scrl_y + scrl_increment;

						window.scroll(scrl_x, scrl_y);

					}

				// 上にスクロール
				} else if (delta_y > 0){
					wheel.vector = 'up';
					if(target_browser){
						e.preventDefault();

						// スクロール位置の算出
						scrl_x = window.scrollX; // IEも対象にするなら_getScroll('X')を使用する
						scrl_y = window.scrollY; // IEも対象にするなら_getScroll('Y')を使用する
						scrl_y = scrl_y - scrl_increment;

						window.scroll(scrl_x, scrl_y);

					}
				}

				if(_getBrowser() != 'ie8') scrollEvent();
			};

			try{
				document.addEventListener(mousewheelevent, onWheel, false);

			}catch(e){
				//for legacy IE
				document.attachEvent('onmousewheel', onWheel);

			}

		})(); // wheel event

		window.onscroll = function(){
			scrollEvent();

		}; // end window.onscroll

	});

})(jQuery);
