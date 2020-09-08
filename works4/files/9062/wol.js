if(!$("html").hasClass("js_en")){$("html").addClass("js_en")
}var proxied=((location.hostname.indexOf("onlinelibrary.wiley.com")!=-1)&&(location.hostname.substring(location.hostname.indexOf("onlinelibrary.wiley.com")+23)==""))?false:true;
var wol=this.wol||{};
$(function(){$.ol={};
$(".publicationTypes #allTypes,.subjectsAndAccess #allTopics, #allAsist").searchSelectAll();
$(document).globalMessaging();
if($("#accordion").length>0){$("#accordion").accordion({header:"h2"})
}$(".contextTrigger").contextFilter();
$("#additionalInformation").slider();
$("#login #loggedIn .profile>li").profileMenu();
$("#issueTocGroups, #titles, #publications, .articles, .books, .contentAlerts").selectAll();
$(".emrw-table").mrwTables();
$(".jumpList").jumpList();
$("#loginEmail, #loginPassword").loginLabels();
if($("#pdf").length){$(window).resize(function(){$("#pdf").children("iframe").height(($(window).height()-$("#pdfHeader").height())-2)
});
$(window).triggerHandler("resize")
}if(!$("#mailUpdates").attr("checked")){$("#mailUpdates").parents("fieldset").next().slideUp()
}$("#mailUpdates").click(function(){if($(this).attr("checked")){$(this).parents("fieldset").next().slideDown()
}else{$(this).parents("fieldset").next().slideUp()
}});
$(".issuesInYear").issueTree();
$("#browseBySubject").subjectTree();
$("#globalMenu ul li:nth-child(3)").addResourceMenu();
$.ol.cleanAJAXResponse=function(g){if(g.indexOf("<body>")>-1){return/<body[^>]*>([\S\s]*?)<\/body>/.exec(g,"ig")[1]
}else{return g
}};
if(!$("#mailPromotionRequested").attr("checked")){$("#mailPromotionRequested").parents("fieldset").next().hide()
}$("#mailPromotionRequested").click(function(){if($(this).attr("checked")){$(this).parents("fieldset").next("fieldset").slideDown()
}else{$(this).parents("fieldset").next("fieldset").slideUp()
}return true
});
$.ol.textSlider=function(g,h){$(g).each(function(){var j=$(this),i=j.height();
if(i>=200){j.css({height:"20em",overflow:"hidden",position:"relative",marginBottom:"0.5em"});
$("<a/>",{text:h[0]}).toggle(function(){$(this).text(h[1]);
j.height(i);
return false
},function(){$(this).text(h[0]);
j.height("20em");
return false
}).insertAfter(j).wrap('<p id="showContent">')
}})
};
$.ol.textSlider("#bookHome #homepageContent",["More about this book summary","Less about this book summary"]);
$.ol.textSlider("#bookHomeSeries #homepageContent",["More about this book series","Less about this book series"]);
if($("#mrwHome").length>0){$.ol.textSlider("#mrwHome #homepageContent:has(~ #rightColumn, ~ #leftColumn)",["More about this book","Less about this book"])
}($.ol.keyStrokeCollector=function(){$(document).keydown(function(h){var g={ctrl:(h.ctrlKey)?true:false,shift:(h.shiftKey)?true:false,alt:(h.altKey)?true:false,key:h.keyCode};
$(this).data("keyDown",g)
});
$(document).keyup(function(g){$(this).removeData("keyDown")
})
})();
$(".decisionTree").dynamicSelectGroup();
if($("#searchByCitation").length){$("#scope").append('<option value="byCitation">By Citation</option>');
$("#scope").change(function(){if($(this).find("option:selected").text()=="By Citation"){$("#searchByCitation").slideDown(function(){$("#searchText, #searchSiteSubmit").attr("disabled","disabled")
})
}else{$("#searchByCitation").slideUp(function(){$("#searchText, #searchSiteSubmit").removeAttr("disabled")
})
}});
$("#searchByCitation p.error").length&&$("#scope").val("byCitation").triggerHandler("change")
}$("#resourcesMenu").parents("li").hover(function(){$("#resourcesMenu").toggle()
});
$("#resourcesMenu ul").bgiframe({top:20});
$("#issueToc .figZoom img").load(function(){$(this).css("visibility","visible");
if($(this).height()>300){$(this).height(300)
}if($(this).width()>300){$(this).css("float","none")
}}).each(function(){if(this.complete||(jQuery.browser.msie&&parseInt(jQuery.browser.version)==6)){$(this).triggerHandler("load")
}});
$("#fulltext .firstPageContainer img").load(function(){$(this).removeAttr("height").removeAttr("width");
if($(this).width()>752){$(this).width(752)
}}).each(function(){if(this.complete||(jQuery.browser.msie&&parseInt(jQuery.browser.version)==6)){$(this).triggerHandler("load")
}});
$("#fulltext a.movingMolecule").each(function(){$(this).click(function(){window.open($(this).attr("href"),$(this).index(),"width=1024,height=790,scrollbars=yes");
return false
})
});
if($("meta[name='citation_journal_title']").length||($("#pdf").length&&$("#productTitle").length)){var c=($("#pdf").length)?$("#productTitle").attr("href").split("(ISSN)")[1]:$("meta[name='citation_issn']").attr("content");
var a=($("#pdf").length)?window.location.href.split("/doi/")[1].split("/pdf")[0]:$("meta[name='citation_doi']").attr("content");
$.getJSON("http://www.deepdyve.com/rental-link?docId="+a+"&fieldName=journal_doi&journal="+c+"&affiliateId=wiley&format=jsonp&callback=?",function(h){if(h.status==="ok"){var j=$('<p><a class="rentalLink">Rent this article at DeepDyve</a></p>');
var i=$('<div id="deepDyve" class="topLeftRoundCornerNew"><h2>Rent this article through DeepDyve</h2><p>View a read-only copy of this article through our partner DeepDyve, the largest online rental service for scientific and scholarly content. DeepDyve will safeguard user privacy and your information will not be sold to a third party.</p><p>Read more about our pilot program making a portfolio of Biotechnology journals available through DeepDyve.</p><p><a href="http://eu.wiley.com/WileyCDA/PressRelease/pressReleaseId-84017.html">Press Release</a></p></div>');
j.find("a").attr("href",h.url);
i.insertAfter("#accessDenied .access .login");
j.clone(true).insertAfter("#deepDyve p:first");
var g=$('<li><span style="color: red; padding-right: 0.4em; font-weight: bold;">NEW!</span> </li>');
j.find("a").clone(true).appendTo(g);
g.appendTo("#accessDeniedOptions")
}})
}$("#downloadStatisticalData form").live("submit",function(){var g=$(this).find("#tAndCs"),h=$(this).find("label[for='tAndCs']");
if(!g.is(":checked")){if($(this).find(".error").length==0){$('<label class="error" for="tAndCs">Please agree to the terms and conditions.</label>').insertAfter(h)
}return false
}});
$("#usageData").loadDataTable();
$("#usageReports .announcement").unEscapeHtml(["strong"]);
$(".societyEAlerts").tabToggle();
if(window.s){$("body").delegate(".moduleFragment a","click",function(){var h=$("#productTitle").text(),g=$(this).text().replace(/\s+/g," ");
g=toUnicode(g);
wol.analytics.trackLink($(this),{linkTrackVars:"events",linkTrackEvents:"event8",events:"event8",eVars:{eVar3:h,eVar7:g}})
})
}$("#currentHoldings .success, #currentHoldings .error ").requestCSV();
$("#payPerViewPaymentDetails").processPaymentDetail();
var d=$("#promosAndTools .titleTools");
if(d.length){var e=(document.location.protocol==="https:")?"https://":"http://",f=e+"s7.addthis.com/js/250/addthis_widget.js#async=1";
window.addthis_config={services_compact:"digg,diigo,citeulike,googlereader,www.mendeley.com,stumbleupon,facebook,twitter,delicious,connotea",services_custom:{name:"mendeley",url:"http://www.mendeley.com?url={{url}}&title={{title}}",icon:"http://www.mendeley.com/favicon.ico"},data_track_clickback:false};
window.addthis_share={title:document.title.replace(/\-/g,"")};
$.getScript(f,function(){if(window.addthis){addthis.addEventListener("addthis.menu.share",function(){$("#at15s,#at16lb").css({display:"none",zIndex:"1"})
});
d.socialBookmarks();
addthis.init()
}})
}var b=window.institutions||[];
$("#institutionalAndAthensLogin #institutionName").autocomplete({source:b,minLength:2})
});
function toUnicode(a){var e="";
for(var b=0;
b<a.length;
b++){var d=a.charAt(b);
var c=a.charCodeAt(b);
if(c>"0xfff"){e+="\\u"+c.toString(16)
}else{if(c>"0xff"){e+="\\u0"+c.toString(16)
}else{if(c>"0x7f"){e+="\\u00"+c.toString(16)
}else{if(c<32){switch(d){case"\b":e+="\\b";
break;
case"\n":e+="\\n";
break;
case"\t":e+="\\t";
break;
case"\f":e+="\\f";
break;
case"\r":e+="\\r";
break;
default:if(c>"0xf"){e+="\\u00"+c.toString(16)
}else{e+="\\u000"+c.toString(16)
}break
}}else{switch(d){case"'":e+="\\'";
break;
case'"':e+='\\"';
break;
case"\\":e+="\\\\";
break;
case"/":e+="\\/";
break;
default:e+=d;
break
}}}}}}return e
}function RightslinkPopUp(a){window.open(a,"Rightslink","location=no,toolbar=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=650,height=550")
};