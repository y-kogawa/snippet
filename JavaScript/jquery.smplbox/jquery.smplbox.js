/*
 * jQuery Smplbox
 * ver: 0.3.1
 * Author: Yoshito Kogawa
 */
(function($){
	"use strict";
	$.fn.smplbox = function(config){
		var opt = $.extend({
			film_id: 'smplboxOverlap',
			body_id: 'smplbox',
			body_inner_id: 'smplboxContent',
			header: true,
			header_id: 'smplboxHeader',
			close_class: 'smplboxClose',
			film_show_duration: 500,
			film_show_easing: 'swing',
			body_show_duration: 500,
			body_show_easing: 'swing',
			film_hide_duration: 200,
			film_hide_easing: 'swing',
			body_hide_duration: 200,
			body_hide_easing: 'swing',
			film: true,
			position: 'absolute',
			group: false,
			group_class: 'group',
			preload: true,
		}, config);

		var _self = $(this);

		var film_html = '<div id="'+opt.film_id+'" class="'+opt.close_class+'"></div>';
		var body_html = '<div id="'+opt.body_id+'">';
			body_html += '<div id="'+opt.header_id+'"></div>';
			body_html += '<div id="'+opt.body_inner_id+'"></div>';
			body_html += '<div id="smplboxCtrlArea"><div id="smplboxPrev" class="smplboxCtrl"></div><div id="smplboxNext" class="smplboxCtrl"></div><div class="'+opt.close_class+'"></div></div>';
			body_html += '</div>';

		// 必要な要素を作成
		if(!document.getElementById(opt.film_id) && opt.film) $('body').append(film_html);
		if(!document.getElementById(opt.body_id)) $('body').append(body_html);

		var image, width, height;
		var ctrl = {
			film: $('#'+opt.film_id),
			body: $('#'+opt.body_id),
			body_inner: $('#'+opt.body_inner_id),
			header: $('#'+opt.header_id),
			group: $('.'+opt.group_class),
			show: function(path, title, number){
				image = new Image();
				image.src = path;
				image.onload = function(){
					// コンテンツの挿入
					ctrl.body_inner.html($(image));

					// 表示位置調整
					ctrl.posSet();

					// フィルムの表示
					ctrl.film.fadeIn(opt.film_show_duration, opt.film_show_easing);

					// 本文の表示
					ctrl.body.fadeIn(opt.body_show_duration, opt.body_show_easing);

				};

				// ヘッダーの表示・非表示
				if(opt.header === true){
					ctrl.header.show().html(title);
				}else{
					ctrl.header.hide();
				}

				// グループがある場合の処理
				if(opt.group === true){
					console.log(ctrl.group);
				}
			},
			hide: function(){
				// フィルムの表示
				ctrl.film.fadeOut(opt.film_hide_duration, opt.film_hide_easing);

				// 本文の表示
				ctrl.body.fadeOut(opt.body_hide_duration, opt.body_hide_easing);

			},
			posSet: function(){
				width = ctrl.body.outerWidth();
				height = ctrl.body.outerHeight();
				ctrl.body.css({
					position: opt.position,
					top: $(window).height() / 2 - height / 2,
					left: $(window).width() / 2 - width / 2,
				});
			},
			_getData: function(elm){
				return {
					path: elm.getAttribute('href'),
					title: elm.getAttribute('title'),
					number: _self.index($(elm)),
				};
			}
		};

		(function(){
			var path, title, number, image, data;
			for(var i=0;i<_self.length;i++){
				// プリロード
				if(opt.preload === true){
					image = new Image();
					image.src = _self[i].getAttribute('href');
				}

				$(_self[i]).click(function(e){
					e.preventDefault();

					// 必要な情報を取得
					data = ctrl._getData(this);

					// 表示
					ctrl.show(data.path, data.title, data.number);

					// 非表示
					$('.'+opt.close_class).one('click', function(){
						ctrl.hide();
					});
				});
			}
		})();

		$(window).resize(function(){
			ctrl.posSet();
		});

		return(this);
	};
})(jQuery);
