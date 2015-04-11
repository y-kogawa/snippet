/*! jQuery requestAnimationFrame - v0.1.3pre - 2014-02-07
* https://github.com/gnarf37/jquery-requestAnimationFrame
* Copyright (c) 2014 Corey Frang; Licensed MIT */
(function(e){function o(){t&&(i(o),e.fx.tick())}var t,n=0,r=["webkit","moz"],i=window.requestAnimationFrame,s=window.cancelAnimationFrame;for(;n<r.length&&!i;n++)i=window[r[n]+"RequestAnimationFrame"],s=s||window[r[n]+"CancelAnimationFrame"]||window[r[n]+"CancelRequestAnimationFrame"];i?(window.requestAnimationFrame=i,window.cancelAnimationFrame=s,e.fx.timer=function(n){n()&&e.timers.push(n)&&!t&&(t=!0,o())},e.fx.stop=function(){t=!1}):(window.requestAnimationFrame=function(e,t){var r=(new Date).getTime(),i=Math.max(0,16-(r-n)),s=window.setTimeout(function(){e(r+i)},i);return n=r+i,s},window.cancelAnimationFrame=function(e){clearTimeout(e)})})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
*/
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	}
});

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

		console.log(_getBrowser() + ': ' + delta_y);
		if (delta_y < 0){
			scrl.direction = 'down';

		} else if (delta_y > 0){
			scrl.direction = 'up';

		}

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
