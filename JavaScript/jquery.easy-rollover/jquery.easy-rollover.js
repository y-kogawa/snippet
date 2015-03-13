/*
 * jQuery Easy Rollover
 * ver: 0.1
 * Author: Yoshito Kogawa
 */
(function($){
	$.fn.easyRollover = function(config){
		var defaults = {
			suffix: '_out.',
			suffix_replace: '_over.'
		};
		opt = $.extend(defaults, config);

		var src, src_replace, _self, image;
		for(var i=0;i<this.length;i++){
			_self = $(this[i]);

			src = this[i].getAttribute('src');
			if(src.indexOf(opt.suffix) > -1){
				src_replace = src.replace(opt.suffix, opt.suffix_replace);
				image = new Image();
				image.src = src_replace;
				_self.hover(function(){
					this.setAttribute('src', src.replace(opt.suffix, opt.suffix_replace));

				}, function(){
					this.setAttribute('src', src.replace(opt.suffix_replace, opt.suffix));

				});
			}

		}
	};
})(jQuery);
