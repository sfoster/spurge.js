define(["lib/lang", "lib/Config"], function(lang, Config){
	// nothing different or special right now
	console.log("test config");

	var conf = new Config({
		REFRESH_RATE: 30,
		assetsDir: lang.modulePath("lib/lang", "../assets"),
		mapWidth: 640,
		mapHeight: 480
	});
	return conf;
})