<?php
require_once("twitteroauth/autoloader.php");
use Abraham\TwitterOAuth\TwitterOAuth;

$consumer_key = "vMR70YfDRJESwwsf6Hveg";
$consumer_secret = "KocZJ03OqiBggVbBbdOX8i45fvoSBzD7CuRS1egY";
$access_token = "43264227-fPI4zdSOQjhqBdUyQmWMoBkk9Qf6TjuXPjbkcOo38";
$access_token_secret = "JddQxg51OQZG1UBy8bwbK9whCtLSWKu6RZhJlpms";

$connection = new TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);
$content = $connection->get("account/verify_credentials");
$user = 'MIYAVI_OFFICIAL';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
<?php
$timeline = $connection->get('statuses/mentions_timeline', array('count' => 50));

?>
<pre>
<?php
foreach ($timeline as $i => $tweet) {
    echo "$i: $tweet->text" . PHP_EOL;
}
?>
</pre>

</body>
</html>