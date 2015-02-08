<?php
require_once "Mobile_Detect.php";
$detect = new Mobile_Detect;
?>
<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title>isSmartPhone｜PHP</title>
</head>
<body>

<h1>Mobile Detect Demo</h1>
<p>
	配布元：<a href="http://mobiledetect.net/" target="_blank">http://mobiledetect.net/</a>
</p>

<?php

//タブレットの場合
if($detect->isTablet()){

	//処理
	echo "あなたの端末はタブレットです。";

//スマホの場合
}elseif($detect->isMobile()){

	//処理
	echo "あなたの端末はスマホです。";

//デスクトップの場合
}else{

	//処理
	echo "あなたの端末はデスクトップです。";

}
?>
</body>
</html>