/*
 * Break Point Event
 * ver: 0.1.1
 */
(function($){
	$.fn.breakPointEvent = function(config){
		var defaults = {
			break_point: ['(min-width: 1025px)', '(min-width: 701px) and (max-width: 1024px)', '(max-width: 700px)'],
			un_matchMedia: [1025, 701, 320],	// min-width
			event_func: [
				function(media_query){
					var enabled = media_query.matches;
					$('.this').prepend('<div>break1: ' + enabled + '</div>');

				},
				function(media_query){
					var enabled = media_query.matches;
					$('.this').prepend('<div>break2: ' + enabled + '</div>');

				},
				function(media_query){
					var enabled = media_query.matches;
					$('.this').prepend('<div>break3: ' + enabled + '</div>');

				}
			]
		};
		opt = $.extend(defaults, config);

		var enabled = (window.matchMedia && window.matchMedia('all').addListener);
		// window.matchMediaが使える場合
		if(enabled){
			for(var i=0;i<opt.break_point.length;i++){
				window.matchMedia(opt.break_point[i]).addListener(opt.event_func[i]);

				if(window.matchMedia(opt.break_point[i]).matches){
					opt.event_func[i].call(false, {matches: true});

				}

			}

		// window.matchMediaが使えない場合
		}else{
			var timer, timeout = 0, bp, _bp;
			var mediaShift = function(){
				for(var i=0;i<opt.un_matchMedia.length;i++){
					if(parseInt($('html').css('min-width')) == opt.un_matchMedia[i]){
						bp = i;
						if(bp != _bp) {
							if(_bp != undefined) opt.event_func[_bp].call(false, {matches: false});
							opt.event_func[bp].call(false, {matches: true});
						}
						_bp = bp;

					}
				}
			}
			mediaShift();

			$(window).on('resize', function(){
				clearTimeout(timer);
				timer = setTimeout(function(){
					mediaShift();

				}, 200);

			});
		}
	};
})(jQuery);
