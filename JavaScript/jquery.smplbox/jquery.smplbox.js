/*
 * jQuery Smplbox
 * ver: 0.3.1
 * Author: Yoshito Kogawa
 */
(function($){
	"use strict";

	// オプションが指定されなかったときの設定
	var defaults = {
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
	}

	// プラグインの名前
	var plugin_name = 'smplbox';

	$.fn.smplbox = function(options){
		// 参照要素がなかったら処理を止める
		if(this.length == 0) return this;

		// 参照要素が複数だったらループで回す
		if(this.length > 1){
			this.each(function(){$(this).smplbox(options)});
			return this;
		}

		// 使用する変数の宣言
		var modal = {},
			self = this,
			image, width, height;

		var init = function(){
			// デフォルトのオプションと指定されたオプションをマージして代入する
			modal.settings = $.extend({}, defaults, options);

			// モーダルのHTMLを作成
			var film_html = '<div id="'+modal.settings.film_id+'" class="'+modal.settings.close_class+'"></div>';
			var body_html = '<div id="'+modal.settings.body_id+'">';
				body_html += '<div id="'+modal.settings.header_id+'"></div>';
				body_html += '<div id="'+modal.settings.body_inner_id+'"></div>';
				body_html += '<div id="smplboxCtrlArea"><div id="smplboxPrev" class="smplboxCtrl"></div><div id="smplboxNext" class="smplboxCtrl"></div><div class="'+modal.settings.close_class+'"></div></div>';
				body_html += '</div>';
			if(!document.getElementById(modal.settings.film_id) && modal.settings.film) $('body').append(film_html);
			if(!document.getElementById(modal.settings.body_id)) $('body').append(body_html);

			// モーダルのHTMLをキャッシュ
			modal.film = $('#'+modal.settings.film_id);
			modal.body = $('#'+modal.settings.body_id);
			modal.body_inner = $('#'+modal.settings.body_inner_id);
			modal.header = $('#'+modal.settings.header_id);
			modal.group = $('.'+modal.settings.group_class);
			modal.close = $('.'+modal.settings.close_class);

			(function(){
				// この関数の中だけで使用する変数を宣言
				var data, path, title, number;

				// プリロード
				if(modal.settings.preload == true){
					image = new Image();
					image.src = self[0].getAttribute('href');
				}

				self.on('click.'+plugin_name, function(e){
					// ブラウザの初期動作を止める
					e.preventDefault();

					// 必要な情報を取得
					data = _getData(this);

					// 表示
					self.show(data.path, data.title, data.number);

					// 非表示
					modal.close.one('click.'+plugin_name, function(){
						self.hide();
					});
				});
			}());
		}

		var _getData = function(elm){
			return {
				path: elm.getAttribute('href'),
				title: elm.getAttribute('title'),
				number: self.index($(elm)),
			};
		}

		self.show = function(path, title, number){
			image = new Image();
			image.src = path;
			image.onload = function(){
				// コンテンツの挿入
				modal.body_inner.html($(image));

				// 表示位置調整
				self.posSet();

				// フィルムの表示
				modal.film.fadeIn(modal.settings.film_show_duration, modal.settings.film_show_easing);

				// 本文の表示
				modal.body.fadeIn(modal.settings.body_show_duration, modal.settings.body_show_easing);

			};

			// ヘッダーの表示・非表示
			if(modal.settings.header === true){
				modal.header.show().html(title);
			}else{
				modal.header.hide();
			}

			// グループがある場合の処理
			if(modal.settings.group === true){
				console.log(modal.group);
			}
		}

		self.hide = function(){
			// フィルムの表示
			modal.film.fadeOut(modal.settings.film_hide_duration, modal.settings.film_hide_easing);

			// 本文の表示
			modal.body.fadeOut(modal.settings.body_hide_duration, modal.settings.body_hide_easing);

		}

		self.move = function(){
			// console.log('hoge')
		}

		self.posSet = function(){
			width = modal.body.outerWidth();
			height = modal.body.outerHeight();
			modal.body.css({
				position: modal.settings.position,
				top: $(window).height() / 2 - height / 2,
				left: $(window).width() / 2 - width / 2,
			});
		}

		init();

		return(this);
	};
})(jQuery);
