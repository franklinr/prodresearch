(function(b,f){var c,d;
var e=function(h){c.slideUp(function(){f(this).remove()
});
a(false);
return false
};
var a=function(k){document.domain="wiley.com";
var i=f(parent.document.getElementsByTagName("frameset")[0]),l,j,h;
if(i.length){l=i.attr("rows");
j=parseInt(l.split(",")[0]);
h=k?j+c.outerHeight():j-c.outerHeight();
i.attr("rows",l.replace(j,h))
}};
var g=function(){c=f("#cookieBanner");
if(c.length){var h=f('<a href="#" class="closeBanner" title="close">Close Banner</a>');
h.bind("click",e);
c.append(h);
a(true)
}};
b.cookies={dismiss:e,init:g};
return b
}(window.wol=window.wol||{},jQuery));
$(function(){wol.cookies.init()
});