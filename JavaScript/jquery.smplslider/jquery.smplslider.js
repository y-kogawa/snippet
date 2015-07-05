/*
 * jQuery Smplslider
 * ver: 0.1
 * Author: Yoshito Kogawa
 */
(function($){
	"use strict";

	// windoオブジェクトにconsoleオブジェクトが無い場合
	if (!('console' in window)) {
		// windowオブジェクトにconsoleオブジェクトを作成
		window.console = {};

		// 作ったconsoleオブジェクトに更に引数をそのまま返すlogオブジェクトを作成
		window.console.log = function(str){return str;};
	}
	var userAgent = window.navigator.userAgent.toLowerCase();
	var appVersion = window.navigator.appVersion.toLowerCase();

	// オプションが指定されなかったときの設定
	var defaults = {
		current              : 0,
		width                : 900,	// スライダーの幅
		slideShow            : true,	// スライドショーを実行するか
		slideShowDelay: 5000,// スライドショーが始まるまでの待ち時間
		hoverStop            : false,	// スライダーにカーソルが重なったときにスライドショーを停止するか
		interval             : 1000,	// スライドショーの待ち時間
		fadeIn               : false,	// 初回表示のときにフェードインするか
		fadeInDuration       : 1500,	// 初回表示のフェードインにかける時間
		fadeInEasing         : 'swing',   // フェードインアニメーションのイージング
		loop: true,	// スライドがループするか
		orientation          : 'vertical',    // horizontal か vertical
		slideContainer       : '.smplslider-slide-container',
		slides               : '.smplslider-slides',
		slide                : '.smplslider-slide',
		slideWidth           : 900,	// スライドの幅
		slideHeight          : 400,	// スライドの高さ
		slideDuration        : 500,	// スライドのアニメーションにかける時間
		slideEasing          : 'swing',   // スライドアニメーションのイージング
		thumbnailContainer   : '.smplslider-thumbnail-container',
		thumbnails           : '.smplslider-thumbnail-list',
		thumbnail            : '.smplslider-thumbnail-box',
		thumbnailMask        : '.smplslider-thumbnail-mask',
		thumbnailPosition    : 'right',	// サムネイルを表示する位置（スライドから見た相対位置）
		thumbnailWidth       : 160,	// サムネイルの幅
		thumbnailHeight      : 57,	// サムネイルの高さ
		thumbnailMaskDuration: 500,	// サムネイルのマスクが消えるまでの時間
		thumbnailMaskEasing  : 'linear'	// サムネイルのマスクが消えるアニメーションのイージング
	};

	// プラグインの名前
	var plugin_name = 'smplslider';

	$.fn.smplslider = function(options){
		// 参照要素がなかったら処理を止める
		if(this.length === 0){
			return this;
		}

		// 参照要素が複数だったらループで回す
		if(this.length > 1){
			this.each(function(){$(this).smplbox(options);});
			return this;
		}

		// 使用する変数の宣言
		var slider = {},
			self   = this,
			styles = {},
			timer,
			hover,
			firstSlideshow = true,
			slideContainer,
			slides,
			slide,
			thumbnailContainer,
			thumbnails,
			thumbnail,
			thumbnailMask
			;

		var init = function(){
			// デフォルトのオプションと指定されたオプションをマージして代入する
			slider.settings    = $.extend({}, defaults, options);

			// 操作するDOMをキャッシュ
			slideContainer     = self.find(slider.settings.slideContainer);
			slides             = self.find(slider.settings.slides);
			slide              = self.find(slider.settings.slide);
			thumbnailContainer = self.find(slider.settings.thumbnailContainer);
			thumbnail          = self.find(slider.settings.thumbnail);
			thumbnailMask      = self.find(slider.settings.thumbnailMask);

			// クラスの付与
			if(slider.settings.orientation == 'horizontal'){
				self.addClass('smplslider-horizontal');
			}else if(slider.settings.orientation == 'vertical'){
				self.addClass('smplslider-vertical');
			}

			if(slider.settings.thumbnailPosition == 'bottom'){
				self.addClass('smplslider-thumbnail-bottom');
			}else if(slider.settings.thumbnailPosition == 'right'){
				self.addClass('smplslider-thumbnail-right');
			}
			slide.eq(slider.settings.current).addClass('smplslider-slide-current');

			// サイズの設定
			self.sizeSet();

			// 初期位置の設定
			self.posSet(slider.settings.current);

			// フェードイン
			if(slider.settings.fadeIn){
				self.stop().fadeTo(slider.settings.fadeInDuration, 1, slider.settings.fadeInEasing);
			}

			// スライドショー実行
			if(slider.settings.slideShow){
				self.slideShow();
				// ホバーしたらスライドショー停止
				self.hover(function(){
					hover = 1;
					if(slider.settings.hoverStop){
						self.slideShowStop();
					}

				// ホバーが解除されたらスライドショー再開
				}, function(){
					hover = 0;
					if(slider.settings.hoverStop){
						self.slideShow();
					}
				});
			}

			// サムネイル
			if(thumbnail.length){
				thumbnail.eq(slider.settings.current).addClass('smplslider-thumbnail-current');
				thumbnail.hover(function(){
					slider.settings.current = thumbnail.index(this);
					self.move();
				});

				if(thumbnailMask.length){
					thumbnailMask.eq(slider.settings.current).hide();
				}
			}
		};

		self.moveStyles = function(goto){
			// スライドの方向にあわせてスタイルの設定
			if(slider.settings.orientation == 'horizontal'){
				styles = {
					left: -slider.settings.width * goto
				};
			}else if(slider.settings.orientation == 'vertical'){
				styles = {
					top: -slider.settings.slideHeight * goto
				};
			}
		}

		self.posSet = function(goto){
			if(!goto){
				goto = slider.settings.current;
			}

			// スライドの方向にあわせてスタイルの設定
			self.moveStyles(goto);

			// スタイルのセット
			slides.stop().css(styles);

		}

		self.move = function(goto){
			self.slideShowStop();
			if(!goto){
				goto = slider.settings.current;
			}

			if(goto >= slide.length){
				if(!slider.settings.loop){
					return false;
				}
				goto = slider.settings.current = 0;
			}

			// カレントクラス付与
			slide.removeClass('smplslider-slide-current');
			slide.eq(goto).addClass('smplslider-slide-current');
			thumbnail.removeClass('smplslider-thumbnail-current');
			thumbnail.eq(goto).addClass('smplslider-thumbnail-current');

			// サムネイルのマスク操作
			if(thumbnailMask.length && appVersion.indexOf("msie 8.") < 0){
				thumbnailMask.stop()
					.fadeTo(slider.settings.thumbnailMaskDuration,
							1,
							slider.settings.thumbnailMaskEasing);

				thumbnailMask.eq(goto).stop()
					.fadeTo(slider.settings.thumbnailMaskDuration,
							0,
							slider.settings.thumbnailMaskEasing);
			}else{
				thumbnailMask.stop().show();
				thumbnailMask.eq(goto).hide();
			}

			// スライドの方向にあわせてスタイルの設定
			self.moveStyles(goto);

			// スライドアニメーション実行
			slides.stop().animate(
				styles,
				slider.settings.slideDuration,
				slider.settings.slideEasing,
				function(){
					// スライドショーが有効かつカーソルがサムネイルに載っていないときに実行
					if(slider.settings.slideShow && !hover){
						self.slideShow();
					}
				});
		};

		self.slideShow = function(interval){
			if(!interval){
				interval = slider.settings.interval;
			}

			// 最初のスライドショーまでの時間を
			if(firstSlideshow){
				interval = slider.settings.slideShowDelay;
			}

			timer = setTimeout(function(){
				firstSlideshow = false;
				slider.settings.current++;
				self.move();
			}, interval);
		};

		self.slideShowStop = function(){
			clearTimeout(timer);
		};

		self.sizeSet = function(){
			self.css({
				width: slider.settings.width
			});

			if(slider.settings.orientation == 'horizontal'){
				slides.css({
					width: slider.settings.slideWidth * slide.length
				});
			}

			slideContainer.css({
				width: slider.settings.slideWidth,
				height: slider.settings.slideHeight
			});

			slide.css({
				width: slider.settings.slideWidth,
				height: slider.settings.slideHeight
			});

			thumbnail.css({
				width: slider.settings.thumbnailWidth,
				height: slider.settings.thumbnailHeight
			});
		};

		init();

		return(this);
	};
})(jQuery);
