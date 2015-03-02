(function($){
	$.fn.cube = function(config){
		var defaults = {
			width: 300,
			height: 400
		}
		var o = $.extend(defaults, config);

		this.each(function(i){
			var container = $(this),
				cube_w = o.width,
				cube_h = o.height,
				cube = container.find('> .cube')
				cube_face = {
					gruop: cube.find('> .face'),
					top: cube.find('> .top'),
					bottom: cube.find('> .bottom'),
					front: cube.find('> .front'),
					back: cube.find('> .back'),
					right: cube.find('> .right'),
					left: cube.find('> .left')
				}

			container.css({
				width: cube_w,
				height: cube_h,
				perspective: 1000
			});

			cube.css({
				width: cube_w,
				height: cube_h,
				transform: 'translateZ('+(-cube_w/2)+'px)',
				transformStyle: 'preserve-3d',
				transitionProperty: 'transform',
				transformOrigin: '50% 50%',
			});

			cube_face.gruop.css({
				transformOrigin: '50% 50%',
				position: 'absolute'
			});

			cube_face.top.css({
				width: cube_w,
				height: cube_w,
				top: -(cube_w - cube_h) / 2,
				transform: 'rotateX(90deg) translateZ('+(cube_h/2)+'px)'
			});

			cube_face.bottom.css({
				width: cube_w,
				height: cube_w,
				top: -(cube_w - cube_h) / 2,
				transform: 'rotateX(-90deg) translateZ('+(cube_h/2)+'px)'
			});

			cube_face.front.css({
				width: cube_w,
				height: cube_h,
				transform: 'translateZ('+(cube_w/2)+'px)'
			});

			cube_face.back.css({
				width: cube_w,
				height: cube_h,
				transform: 'rotateX(-180deg) translateZ('+(cube_w/2)+'px)'
			});

			cube_face.right.css({
				width: cube_w,
				height: cube_h,
				transform: 'rotateY(90deg) translateZ('+(cube_w/2)+'px)'
			});

			cube_face.left.css({
				width: cube_w,
				height: cube_h,
				transform: 'rotateY(-90deg) translateZ('+(cube_w/2)+'px)'
			});
		});
	};
})(jQuery);

$(function(){
	$('.example1').cube({
		width: 300,
		height: 150
	});

	$('.example2').cube({
		width: 100,
		height: 200
	});
});
