if(!(_satellite.readCookie("randomizeUser"))){
	_satellite.setCookie("randomizeUser",Math.random());
}
if(_satellite.readCookie("randomizeUser") > 0.87){
	var head= document.getElementsByTagName('head')[0];
   var script= document.createElement('script');
   script.type= 'text/javascript';
   script.src= 'https://cdn.optimizely.com/js/8610241905.js';
   head.appendChild(script);
}
