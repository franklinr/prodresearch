(function(l,j){var p=j(".shibbolethWidget"),y=j("#institutionName"),o=j("#institutionIdpUrl"),s=j("#selectInst"),r=p.find(".prevLogins"),k=p.find(".error"),b=r.find(".instName").length,x={};
var i=function(){s.removeClass("disabled").removeAttr("disabled");
y.removeClass("error ui-autocomplete-loading")
};
var a=function(){s.addClass("disabled").attr("disabled","disabled")
};
var e=function(z){if(z==="autocompleteselect"){k.remove()
}};
var d=function(A,z){x[A]=z
};
var m=function(z){return x[z]
};
var v=function(A,B){var z=[];
j.each(B,function(C,D){z.push({label:C,value:D})
});
d(A,z);
return z
};
var u=function(A,z){i();
z(A)
};
var f=function(C,z){var B=C.term.toLowerCase(),A=m(B);
if(A){u(A,z)
}else{j.ajax({url:"/widget/getinstitutiondetails",dataType:"json",data:{institutionname:C.term},success:function(E){var D=(E)?v(B,E):[];
u(D,z)
},error:function(E,F,D){return false
}})
}};
var c=function(z,A){y.val(A.item.label);
o.val(A.item.value);
e(z.type);
i();
return false
};
var h=function(){a();
y.autocomplete({source:f,minLength:3,select:c,focus:c,open:function(z,A){if(!j(".shibboleth-autocomplete").length){j(".ui-autocomplete").addClass("shibboleth-autocomplete")
}j(".ui-autocomplete").css("z-index",101)
}});
y.bind("blur keyup",function(){if(!y.val()){a()
}else{i()
}});
y.data("autocomplete")._resizeMenu=function(){this.menu.element.width(this.element.outerWidth()-2);
this.menu.element.css("top",parseInt(this.menu.element.css("top"),0))
};
y.data("autocomplete")._renderItem=function(B,D){var A=this.term.split(" ").join("|"),C=new RegExp("("+A+")","gi"),z=D.label.replace(C,"<b>$1</b>");
return j("<li></li>").data("item.autocomplete",D).append("<a>"+z+"</a>").appendTo(B)
}
};
var q=function(z){var A=j("#selectPrevInst");
z.prev(".rdo").attr("checked","checked");
A.trigger("click")
};
var g=function(A,z){var B=z.parent();
if(j.trim(A).toLowerCase()==="true"){B.fadeOut(900,function(){b--;
if(b===0){r.remove()
}j(this).remove()
})
}else{z.removeClass("waiting")
}};
var w=function(z){j.ajax({url:"/delinstitutionname",dataType:"text",charset:"utf-8",data:{institutionname:z.val()},beforeSend:function(){z.addClass("waiting")
},success:function(A){g(A,z)
},error:function(B,C,A){return false
}})
};
var n=function(){r.delegate(".instLabel","click",function(){q(j(this))
}).delegate(".instName .actionBtn","click",function(A){A.preventDefault();
var z=j(this);
if(!z.hasClass("waiting")){w(z)
}})
};
var t=function(){if(y.length){h()
}s.val("Log in");
if(b){n()
}};
l.shibboleth={init:t};
return l
}(window.wol=window.wol||{},jQuery));
$(function(){wol.shibboleth.init()
});