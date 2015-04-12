;$(function(){
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
		browser = {
			std: navigator.userAgent,
			ua: navigator.userAgent.toLowerCase(),
			ver: navigator.appVersion.toLowerCase(),
			h: $(window).height()
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

	var scrl = {
			top: 0,
			_top: 0,
			container: $('#container'),
			container_h: $('#container').outerHeight(),
			direction: false,
			duration: 500,
			easing: 'easeOutCubic',
			step: 150
		};

	var smoothScrl = function(step){
		if(scrl.direction == 'down'){
			scrl.top += step;
		}else if(scrl.direction == 'up'){
			scrl.top += step;
		}

		if(scrl.top > 0){
			scrl.top = 0;
		}else if(scrl.top < -(scrl.container_h - browser.h)){
			scrl.top = -(scrl.container_h - browser.h);
		}
		// console.log(scrl.top);

		scrl.container.stop().animate({
			top: scrl.top
		}, scrl.duration, scrl.easing);
	};

	$(window).resize(function(){
		browser.h = $(window).height();
		scrl.container_h = scrl.container.outerHeight();

		if(scrl.top < -(scrl.container_h - browser.h)){
			scrl.top = -(scrl.container_h - browser.h);
			scrl.container.stop().css({
				top: scrl.top
			});
		}
	});

	var onWheel = function(e){
		if(!e) e = window.event; //for legacy IE
		var delta_y = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);

		// console.log(_getBrowser() + ': ' + delta_y);
		if (delta_y < 0){
			scrl.direction = 'down';

		} else if (delta_y > 0){
			scrl.direction = 'up';

		}

		// Firefoxではスクロール量が少ないため割り増し
		if(_getBrowser() == 'firefox'){
			delta_y *= 20;
		}

		smoothScrl(delta_y);
	};

	try{
		document.addEventListener(mousewheelevent, onWheel, false);

	}catch(e){
		//for legacy IE
		document.attachEvent('onmousewheel', onWheel);

	}

});
