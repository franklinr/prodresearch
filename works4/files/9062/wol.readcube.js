(function(f,b){var g=b(".readcubePdfLink"),e=b(".pdfOverlay"),a=location.href,d=b(".enhancedPdf");
var c=function(l){b.fancybox.staticUseSetup();
b.fancybox.showActivity();
var k=l.jquery?l:b(l),n=k.text().match(/\(.+\)/)[0]||"",o=k.attr("href")||"",m=o+"/enhanced",p='<h3 class="choosePdfFormat">Choose a format:</h3><ul class="pdfOptions"><li class="pdfType"><a class="standardPdf">Standard PDF</a></li><li class="pdfType"><a class="enhancedPdf" target="_blank">Enhanced PDF</a><ul class="enhancedPdfBenefits"><li class="benefit">Supporting information and active references</li><li class="benefit">Save, organize, annotate, search, and share</li></ul><a href="http://readcube.com" target="_blank" class="readcubeRef">Learn more</a></li></ul>';
if(!e.length){e=b('<div class="pdfOverlay" />').append(p)
}e.find(".standardPdf").text("Standard PDF "+n).attr("href",o);
e.find(".enhancedPdf").attr("href",m).click(function(){b.fancybox.close()
});
b.fancybox({content:e,width:340,height:210,autoDimensions:false,autoScale:false})
};
var h=function(){if(g.length){b("body").delegate(".readcubePdfLink","click",function(k){k.preventDefault();
c(this)
})
}};
var j=function(){if(d.length){b('<a href="'+a+'/enhanced" target="_blank" class="pdfLink" title="Try the enhanced PDF version of this title">Enhanced PDF available</a>').appendTo(d)
}};
var i=function(){h();
j()
};
f.readcube={init:i};
return f
}(window.wol=window.wol||{},jQuery));
$(function(){wol.readcube.init()
});