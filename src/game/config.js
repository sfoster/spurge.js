define(["lib/lang", "lib/Config"], function(lang, Config){
	console.log("game config");

	var conf = new Config({
		REFRESH_RATE: 30,
		assetsDir: lang.modulePath("lib/lang", "../assets"),
		mapWidth: 640,
		mapHeight: 480
	});
	return conf;
})