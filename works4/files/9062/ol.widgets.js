(function(a){a.widget("ol.dynamicSelectGroup",{_create:function(){this.element.wrap("<fieldset />");
this.element.parents("fieldset").parent().wrapInner('<form action="'+this.element.find("a:first").attr("href").split("?")[0]+'" class="simple" method="get" />');
this.element.parents("form").unwrap().append('<input type="submit" value="Download" class="submit"/>')
},_init:function(){this._build();
var b=this.element.parents("form").find("p.error");
if(b.length){this.element.parents("fieldset").append(a("<label/>").addClass("error").attr("for","productType").html(b.detach().html()))
}},_build:function(h,b){var g=this,i=h;
this.element.parents("fieldset").children("label.error").remove();
if(!h){this.element.find("~select").remove();
h=this.element
}else{var d=h.parents("ul").length;
this.element.find("~select").eq(d).find("~select").remove();
h=h.find(">li>ul").filter(function(j){return a(this).siblings("span").text()===a(b).find("option:selected").text()
})
}this.element.parent().children("input[type=hidden]").remove();
h.length&&(i=h);
var e={};
a.each(i.find("a:first").attr("href").split("?")[1].split("&"),function(){if(!g.element.parent().children("#"+this.split("=")[0]).length){e[this.split("=")[0]]=this.split("=")[1]
}});
while(h.length){var c=h.attr("class"),f=c.indexOf(" ")>0?c.split(" ")[1]:c;
delete e[f];
var b=a("<select />").hide().attr({id:f,name:f}).bind("change",{listEl:h},function(j){g._build(j.data.listEl,this)
}).appendTo(this.element.parent());
a(a.map(h.find(">li"),function(j){return a("<option />").attr("value",g._getValueFromQS(j,f)).text(a(j).children("span, a").text())
})).appendTo(b.fadeIn("slow"));
h=h.find(">li:first>ul:first")
}a.each(e,function(k,j){a("<input />").attr({type:"hidden",id:k,name:k}).val(j).appendTo(g.element.parent())
})
},_getValueFromQS:function(c,b){qs=a(c).find("a:first").attr("href").split("?")[1].split("&");
return a.grep(qs,function(d,e){return d.split("=")[0]===b
})[0].split("=")[1]
},destroy:function(){this.element.parent().find("select").remove();
this.element.show();
a.Widget.prototype.destroy.apply(this,arguments)
}});
a.widget("ol.globalMessaging",{_create:function(){var b=this,c=b.options;
b=a.extend(b,{offset:0,showing:false,available:false,timer:0,isIe6:(a.browser.msie&&a.browser.version==6)});
b.messageElement=(a("#globalMessaging").length?a("#globalMessaging"):a("<div/>").attr("id","globalMessaging").append("<ul/>")).css({top:0,left:0,position:b.isIe6?"absolute":"fixed"}).append(a('<a id="handle" href="#">'+c.openedText+"</a>").click(function(){b.showing?b.hide():b.show(true);
return false
})).bgIframe();
if(b.messageElement.parent().length>0){b.available=true;
b.messageElement.detach().prependTo("body");
b._setOffset();
b.canShow=((b.messageElement.find("li").length>1)||((b.messageElement.find("li").length==1)&&((b.messageElement.find("li.maintenanceMessage").length==0)||(b.messageElement.find("li.maintenanceMessage").length>0)&&(a.cookie("maintenanceMessageViewed")!="true"))));
!b.canShow&&b.hide(true)
}a(window).bind("resize",function(){b.available&&((b.showing&&b._setOffset())||(b._setOffset()&&b.hide(true)))
});
if(b.isIe6){a(window).bind("scroll",function(){b.available&&((b.showing&&b.messageElement.css({top:a(window).scrollTop()}))||(!b.showing&&b.messageElement.css({top:a(window).scrollTop()+b._getOffset()})))
})
}},_init:function(){this.show()
},_getOffset:function(){return parseInt("-"+this.offset,10)
},_setOffset:function(){return this.offset=parseInt(this.messageElement.children("ul").outerHeight(),10)
},addMessage:function(d,c){var b=this;
b.hide(true);
b.messageElement.children("ul").append(a("<li>"+d+"</li>").attr("class",c));
b.messageElement.prependTo("#rightBorder");
b.available=true;
b._setOffset();
b.canShow=((b.messageElement.find("li").length>1)||((b.messageElement.find("li").length==1)&&(b.messageElement.find("li.maintenanceMessage").length>0)&&(a.cookie("maintenanceMessageViewed")!="true")));
if(b.canShow){b.show()
}else{b.hide(true)
}},show:function(d){var b=this,c=b.options;
if(this.available&&!b.showing&&(d||b.canShow)){b.messageElement.children("ul").css("visibility","visible");
b.messageElement.animate({left:0,top:b.isIe6?a(window).scrollTop():0},c.animSpeed,function(){b.messageElement.children("a").html(c.openedText);
if(!d){b.timer=setTimeout(function(){b.hide()
},c.delay)
}b.showing=true
});
(a.cookie("maintenanceMessageViewed")!="true")&&a.cookie("maintenanceMessageViewed","true",{path:"/"})
}},hide:function(d){var b=this,c=b.options;
if(this.available&&(b.showing||d)){clearTimeout(b.timer);
b.messageElement.clearQueue().animate({top:b.isIe6?a(window).scrollTop()+b._getOffset():b._getOffset()},d?0:c.animSpeed,function(){b.messageElement.children("a").html(c.closedText);
b.showing=false
})
}}});
a.extend(a.ol.globalMessaging.prototype,{options:{animSpeed:"fast",delay:5000,openedText:"Hide messages",closedText:"Show messages"}})
})(jQuery);