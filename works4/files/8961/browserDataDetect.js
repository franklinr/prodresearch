(function()
{
	// ActiveX parts compiled from http://www.builtfromsource.com/category/code/
	var r;
	function conv(v)
	{
		v = parseInt(v);
		if (! isNaN(v))
			r = Math.max(r, v);
	}

	var ax = window.ActiveXObject;
	var nav = window.navigator || {};
	var nm = nav.mimeTypes || {};
	var np = nav.plugins || [];
	function navOK(m)
	{
		return nm[m] && nm[m].enabledPlugin;
	}

	// Compiled from http://www.adobe.com/products/flashplayer/download/detection_kit/
	function flash(a,b)
	{
		function convResult(v)
		{
			v = parseInt(v);
			if (isNaN(v) || (v < a)) 
				return "";
			else
				return "&FL=FL" + Math.min(v, b);
		}

		if (navOK("application/x-shockwave-flash") && (np["Shockwave Flash 2.0"] || np["Shockwave Flash"])) {
			var swVer2 = np["Shockwave Flash 2.0"] ? " 2.0" : "";
			var desc = np["Shockwave Flash" + swVer2].description;
			return convResult(desc.split(" ")[2].replace(/\..*/, ""));
		}

		if (ax) {
			try {
				var axo = new ax("ShockwaveFlash.ShockwaveFlash.7");
				return convResult(axo.GetVariable("$version").split(" ")[1].replace(/,.*/, ""));
			} catch (e) {}

			try {
				new ax("ShockwaveFlash.ShockwaveFlash.6");
				return convResult(6);
			} catch (e) {}

			try {
				var axo = new ax("ShockwaveFlash.ShockwaveFlash.3");
				return convResult(axo.GetVariable("$version").split(" ")[1].replace(/,.*/, ""));
			} catch (e) {}

			try {
				new ax("ShockwaveFlash.ShockwaveFlash.3");
				return convResult(3);
			} catch (e) {}
		}

		return "";
	}

	function realPlayer(a,b)
	{
		r = 0;
		if (navOK("audio/x-pn-realaudio-plugin")) {
			for (i=0; i < np.length; i++ ) {
				var plugin = np[i];
				if (plugin.name.indexOf("RealPlayer") > -1) {
					conv(plugin.description);
					conv(a);
				}
			}
		}

		if (ax) {
			var controls = [
				'rmocx.RealPlayer G2 Control',
				'rmocx.RealPlayer G2 Control.1',
				'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
				'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
				'RealPlayer'];
			for (var i = 0; i < controls.length; i++) {
				try {
					var rp = new ax(controls[i]);
					if (rp)
						conv(rp.GetVersionInfo());
				} catch (e) {}
			}
		}

		if (r < a)
			return "";
		else
			return "&RV=RV" + Math.min(r, b);
	}

	function mediaPlayer(a,b)
	{
		r = 0;
		if (navOK("application/x-mplayer2")) {
			for (i=0; i < np.length; i++ ) {
				var plugin = np[i];
				if (plugin.name.indexOf("Windows Media Player") > -1)
					conv(6);
			}
		}

		if (ax) {
			try {
				var control = new ax('WMPlayer.OCX');
				conv(7);
			} catch (e) {}
		}

		if (r < a)
			return "";
		else
			return "&WM=WM" + Math.min(r, b);
	}

	function os()
	{
		var u = nav.userAgent.toLowerCase();
		var p = nav.platform.toLowerCase();
		if (p.indexOf("mac") != -1)
			return "MAC";
		if (u.indexOf("android") != -1)
			return "ANDROID";
		if (p.indexOf("linux") != -1)
			return "LINUX";
		if ((u.indexOf("windows phone os") != -1) || (u.indexOf("wp7") != -1))
			return "WINPHONE7";
		if (nav.platform.indexOf("iPad") != -1)
			return "IPAD";			
		if (nav.platform.indexOf("iPod") != -1)
			return "IPOD";			
		if (nav.platform.indexOf("iPhone") != -1)
			return "IPHONE";			
		if (p.indexOf("win") != -1) {
			if (u.indexOf("windows nt 6.1") != -1)
				return "WIN7";
			if (u.indexOf("windows nt 6.0") != -1)
				return "WINVISTA";
			if ((u.indexOf("nt") != -1) && (u.indexOf("5.1") != -1))
				return "WINXP";
			if ((u.indexOf("win 9x 4.90") != -1) || (u.indexOf("windows me") != -1))
				return "WINME";
			if (u.indexOf("98") != -1)
				return "WIN98";
			if (u.indexOf("nt 5.0") != -1)
				return "WIN2000";
			if (u.indexOf("nt") != -1)
				return "WINNT";
		}	
		return "OTHER";
	}

	function resolution()
		{
			var s = window.screen || {};
			r = {
				w800h600:	"RS1",
				w1024h768:	"RS2",
				w1280h1024:	"RS3",
				w1600h1200:	"RS4",
				w1920h1440:	"RS5",
				w640h480:	"RS6",
				w720h480:	"RS7",
				w720h576:	"RS8",
				w848h480:	"RS9",
				w1152h864:	"RS10",
				w1280h720:	"RS11",
				w1280h768:	"RS12",
				w1280h960:	"RS13",
				w1280h800:	"RS14",
				w1280h854:	"RS15",
				w1280h900:	"RS16",
				w1400h1050:	"RS17",
				w1440h900:	"RS18",
				w1680h1050:	"RS19",
				w1920h1080:	"RS20",
				w1920h1200:	"RS21",
				w2048h1536:	"RS22",
				w2560h1600:	"RS23",
				w3200h2400:	"RS24",
				w3840h2400:	"RS25",
				w768h1024:	"RS26",
				w1360h768:	"RS27",
				w1366h768:	"RS27",
				w1600h900:	"RS28"
				}["w" + window.screen.width + "h" + window.screen.height];
			return "&RES=" + (r ? r : "OTHER") + "&RESW=" + window.screen.width + "&RESH=" + window.screen.height;
		}
		var common = resolution(); 

	var lang = (nav.language || nav.userLanguage || "").toLowerCase().substr(0,2);

	var url = "OS=" + os() +
		flash(3,11) +
		realPlayer(6,6) +
		mediaPlayer(6,7) +
		"&JE=" + (((typeof(nav.javaEnabled) != "undefined") && nav.javaEnabled()) ? 1 : 0) +
		(lang ? ("&UL=" + lang) : "") + common;

	if (window.CM8DispatcherApps && (window.CM8DispatcherApps.length > 0))
			url = window.CM8DispatcherApps.shift() + url;
		if (window.CM8DispatcherAjax)
			window.CM8DispatcherAjax(url);
		else
			document.write("<scr"+"ipt type='text/javascript' src='" + url + "'></scr"+"ipt>");
})();
