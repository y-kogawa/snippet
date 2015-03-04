/*
 * Break Point Event
 * ver: 0.2.0
 */
(function($){
	$.fn.breakPointEvent = function(config){
		var defaults = {
			break_point: ['(min-width: 1025px)', '(min-width: 701px) and (max-width: 1024px)', '(max-width: 700px)'],
			event_func: [
				function(media_query){
					// console.log('<div>break1: ' + media_query.matches + '</div>');

				},
				function(media_query){
					// console.log('<div>break2: ' + media_query.matches + '</div>');

				},
				function(media_query){
					// console.log('<div>break3: ' + media_query.matches + '</div>');

				}
			],
		};
		opt = $.extend(defaults, config);

		// window.matchMediaが使える場合
		if(window.matchMedia && window.matchMedia('all').addListener){
			for(var i=0;i<opt.break_point.length;i++){
				window.matchMedia(opt.break_point[i]).addListener(opt.event_func[i]);

				if(window.matchMedia(opt.break_point[i]).matches){
					opt.event_func[i].call(false, { matches: true });

				}

			}
		}
	};
})(jQuery);
