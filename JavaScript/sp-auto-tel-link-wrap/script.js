$(function(){
	if(!isSmartPhone()) return false;

	$('[data-tel]').each(function(){
		var tel_num = $(this).attr('data-tel');
		$(this).wrap('<a href="tel:'+tel_num+'" />');
	});
});
