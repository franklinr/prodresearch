$(function(){$("#fulltext .graphicalAbstract .figZoom, #graphicalAbstract .figZoom").click(function(){$.fancybox.staticUseSetup();
$.fancybox.showActivity();
var d=$(this);
var c=d.attr("href");
var b=new Image();
$(b).load(function(){$.fancybox.hideActivity();
$.fancybox({padding:10,margin:0,scrolling:"no",content:this,titleShow:false,autoScale:false,onComplete:function(){}})
}).attr("src",c);
return false
});
$("#fulltext .figZoom, #fulltext .figures .figure").click(function(){$.fancybox.staticUseSetup();
$.fancybox.showActivity();
var f=$(this),d=$(this).attr("href"),c=new Image(),e=$(this).parents(".figure").find(".caption .downloadToPowerpoint a").attr("href"),b=$("<div />");
$(c).load(function(){$.fancybox.hideActivity();
$(c).css("margin","10px").appendTo(b);
var h=f.parent().find(".caption").clone();
h.find(".downloadToPowerpoint").remove();
h.find("a").click(function(){$.fancybox.close()
});
h.css({"padding-top":"10px","padding-left":"10px","padding-right":"10px"}).appendTo(b);
b.width($(c).attr("width")+20);
if(e){var g=$("<div id='figureNavigation'><a class='powerPoint' href='"+e+"'>Download figure to PowerPoint</a></div>");
g.appendTo(b)
}$.fancybox({padding:0,margin:0,content:b,titleShow:false,autoScale:false,onComplete:function(){}})
}).attr("src",d);
return false
});
if($("#totalViews span").text()!=0){$('<a href="metrics">view chart</a>').appendTo("#totalViews")
}$("#mrwFulltext .fig-thumbnail-href").filter(function(){return $(this).attr("href").indexOf("tables#")==-1
}).click(function(){$.fancybox.staticUseSetup();
$.fancybox.showActivity();
var d=$(this);
var c=$(this).attr("href");
var b=new Image();
$(b).load(function(){$.fancybox.hideActivity();
var h=$("<div />").css("padding","10px");
var f=$("<div />");
$(b).appendTo(f);
if(d.parent("td").length){var e=$("<p />").css({"padding-top":"10px","margin-bottom":"0"});
var g=(d.parent().nextAll("td").length==1)?d.parent().next().html():d.text();
e.html(g).appendTo(f)
}h.width($(b).attr("width")+20);
f.appendTo(h);
$.fancybox({padding:0,margin:0,content:h,titleShow:false,autoScale:false,onComplete:function(){h.width((h.parent().height()<h.parent().attr("scrollHeight"))?h.width()-20:h.width())
}})
}).attr("src",c);
return false
});
$(".articleAbstract > .figZoom").fancybox({titleShow:false,cyclic:false,autoScale:false});
$(".imageTable img").css("cursor","pointer").click(function(){$.fancybox.staticUseSetup();
$.fancybox.showActivity();
var b=$(this);
$.fancybox({titleShow:false,cyclic:false,autoScale:false,content:b.clone()});
return false
});
$(".footnoteLink, .referenceLink").click(function(){if($(this).attr("href").indexOf("/doi/")===-1){$.fancybox.staticUseSetup();
var e=$("<ul id='overlayList' />"),c=$(this).attr("rel"),d=$(this),b=12;
$.each(c.split("#"),function(f,k){if(k.indexOf("#")==-1&&f!=0){var g=k.replace(".","\\."),j=$("#"+g).clone(),i=$("<a />"),h;
i.attr("href","#"+k);
i.click(function(){$.fancybox.close()
});
h=j.find(".text");
h.wrap(i);
b+=$("#"+g).height();
j.appendTo(e)
}});
$.fancybox({content:e,width:762,height:b,autoDimensions:false,autoScale:false,centerOnScroll:true});
return false
}});
$("#viewPrivacyPolicy, #viewTermsAndConditions").fancybox({titleShow:false,width:800,autoDimensions:false,autoScale:false,cyclic:false});
$(".payPerViewForm .fieldAssistance > a").fancybox({titleShow:false,width:480,height:410,autoDimensions:false,autoScale:false,cyclic:false});
$("li.email > a").fancybox({titleShow:false,width:620,height:410,autoDimensions:false,autoScale:false,cyclic:false});
$("li.citation > a").fancybox({titleShow:false,width:480,height:200,autoDimensions:false,autoScale:false,cyclic:false,onComplete:function(){$("#exportCitation #citationFormat").bind("change",function(){var b=$(this).parents("form");
if($(this).val()==="REFWORKS"){b.attr("target","_blank");
$('<p class="fieldAssistance">This option will open up a new window.</p>').insertAfter(this)
}else{b.removeAttr("target").find(".fieldAssistance").remove()
}})
}});
$("a[href='downloadstats']").fancybox({titleShow:false,width:480,height:200,autoDimensions:false,autoScale:false,cyclic:false});
$("input[name='exportCitations']").click(function(h){var f=$(this),d=f.closest("form"),g=d.find(".access input[type=checkbox]:checked"),b=d.attr("action"),c="Please select a result to export citation.";
if(g.length>0){$.fancybox({href:b,titleShow:false,autoDimensions:true,autoScale:false,cyclic:false,ajax:{dataType:"html",type:"POST",data:d.serialize()+"&"+f.attr("name")+"="+f.attr("value"),dataFilter:function(i,e){return $.ol.cleanAJAXResponse(i).split('<div id="exportCitation">').join('<div id="exportCitation" style="width:480px">')
}},onComplete:function(){$("#exportCitation #citationFormat").bind("change",function(){var e=$(this).parents("form");
if($(this).val()==="REFWORKS"){e.attr("target","_blank");
$('<p class="fieldAssistance">This option will open up a new window.</p>').insertAfter(this);
$.fancybox.resize()
}else{e.removeAttr("target").find(".fieldAssistance").remove()
}})
}})
}else{$.fancybox({titleShow:false,autoDimensions:true,autoScale:false,cyclic:false,content:c})
}return false
});
$(".crossmark-link").fancybox({titleShow:false,width:550,height:550,autoDimensions:false,autoScale:false,cyclic:false,type:"iframe",href:$(this).attr("href")});
$("#accessDeniedOptions .institution-list, #athens .institution-list").fancybox({width:1068,height:550,autoDimensions:false,autoScale:true,type:"iframe"});
var a=$('.menuGroup a[href$="agu/alertmanager/load"]');
a.fancybox({titleShow:false,width:640,height:550,autoDimensions:false,autoScale:false,cyclic:false,type:"ajax",href:a.attr("href")+"?type=ajax",onComplete:function(){var b=$("#personalChoiceAlerts"),d=b.find(".societyAlertHeading"),c=b.find(".submit");
$("#fancybox-inner .contentAlerts").selectAll();
$("#fancybox-inner .societyEAlerts").tabToggle();
c.bind("click",function(g){var f=$(".alertResponse");
f.hide();
g.preventDefault();
$.ajax({type:"POST",url:b.attr("action")+"?type=ajax",data:b.serialize(),success:function(e){if(!f.length){f=$('<p class="alertResponse error"/>');
f.insertAfter(c)
}f.text(e).show()
},error:function(){if(!f.length){f=$('<p class="alertResponse error"/>');
f.insertAfter(c)
}f.text("There has been a problem saving your AGU E-Alerts.").show()
}})
})
}})
});