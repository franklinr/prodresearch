let mobileBreakpoint=768;let tabletBreakpoint=1025;let mobileDevice={Android:function(){return navigator.userAgent.match(/Android/i);},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i);},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i);},Opera:function(){return navigator.userAgent.match(/Opera Mini/i);},Windows:function(){return navigator.userAgent.match(/IEMobile/i);},any:function(){return(mobileDevice.Android()||mobileDevice.BlackBerry()||mobileDevice.iOS()||mobileDevice.Opera()||mobileDevice.Windows());}};function addClass(elementId,className){let element=document.getElementById(elementId);if(element!==null)
element.classList.add(className);}
function removeClass(elementId,className){let element=document.getElementById(elementId);if(element!==null)
element.classList.remove(className);}
function isVisible(element){return(element!==null&&element.offsetWidth>0&&element.offsetHeight>0);}
function gotoPage(page){window.location.href=window.location.origin+page;};function isMobile(){return(window.innerWidth<mobileBreakpoint);};function isDesktop(){return(window.innerWidth>=tabletBreakpoint);};function isTablet(){return(!isMobile()&&!isDesktop());};function isIE(){return(document.all&&!window.atob)||(window.navigator.msPointerEnabled!==undefined);}
function isSafari(){return /constructor/i.test(window.HTMLElement);}
function isChrome(){return!!window.chrome;}
function isFirefox(){return!!window.sidebar;}
function isOpera(){return!!window.opera||/opera|opr/i.test(navigator.userAgent);}
function stickClass(action){try{$('.stick-it').stickIt(action);}
catch(err){console.log("Caught Exception in applying stick-it class: "+err.message);}};function retry(element,callbackFunction){if(!$(element).size())
window.requestAnimationFrame(retry(element,callbackFunction));else
callbackFunction();};function inPbEditorMode(){return $('#pb-editor').length>0;}
function inJournalScope(){return $('meta[name="pbContext"]').attr('content').indexOf('journal:journal:')>0;}
function inMicrositeScope(){return $('meta[name="pbContext"]').attr('content').indexOf('Microsite')>0;}
function inPortalHome(){return $('meta[name="pbContext"]').attr('content').indexOf('page:string:Home Page')>0;}
function inSearchPage(){return $('meta[name="pbContext"]').attr('content').indexOf('page:string:Search Result')>0;}
function inArticlePage(){return $('meta[name="pbContext"]').attr('content').indexOf('page:string:Article/Chapter View')>0;}
function inBrowsePublications(){return $('meta[name="pbContext"]').attr('content').indexOf('page:string:Show Publications')>0;}
function inGlobalScope(){return(inPortalHome()||inSearchPage()||inBrowsePublications());}
function inJournalHome(){return $('meta[name="pbContext"]').attr('content').indexOf('page:string:Journal Home')>0;}
function inArticlePage(){return $('meta[name="pbContext"]').attr('content').indexOf('page:string:Article')>0;}
function inDenialPage(){return $('meta[name="pbContext"]').attr('content').indexOf('subPage:string:Access Denial')>0;}
function isMailAddress(address){return address.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);}
function hasUserIdentity(){return $('.sage-login-widget .id-person-activated').length>0;}
function hasPersonIdentity(){return $('.sage-login-widget .id-person-activated').length>0;}
function hasInstitutionIdentity(){return $('.sage-login-widget .id-institution-activated').length>0;}
function hasSocietyIdentity(){return $('.sage-login-widget .id-society-activated').length>0;}
function hasArticleAccess(){if($('.accessDenialWidget .articleMeta span.accessIcon').length===0)
return $('.PDFTool.pdf-no-access').length===0;else
return $('.accessDenialWidget .articleMeta span.accessIcon>img.openAccess, .accessDenialWidget .articleMeta span.accessIcon>img.freeAccess, .accessDenialWidget .articleMeta span.accessIcon>img.fullAccess').length>0;}
function changeText(selector,sourceText,replaceText,isHTML){if(isHTML===undefined)isHTML=false;if(sourceText&&replaceText){try{if(isHTML){let oldText=$(selector)[0].innerHTML;if(oldText.indexOf(sourceText)!==-1)
$(selector)[0].innerHTML=oldText.replace(sourceText,replaceText);}
else{let oldText=$(selector).text();if(oldText.indexOf(sourceText)!==-1)
$(selector).text(oldText.replace(sourceText,replaceText));}}catch(e){}}};function getMonth(m){let month;switch(m){case "1":case "01":case "Jan":month="January";break;case "2":case "03":case "Feb":month="February";break;case "3":case "03":case "Mar":month="March";break;case "4":case "04":case "Apr":month="April";break;case "5":case "05":case "May":month="May";break;case "6":case "06":case "Jun":month="June";break;case "7":case "07":case "Jul":month="July";break;case "8":case "08":case "Aug":month="August";break;case "9":case "09":case "Sep":month="September";break;case "10":case "Oct":month="October";break;case "11":case "Nov":month="November";break;case "12":case "Dec":month="December";break;default:month=m;}
return month;}
let focusableElementsString="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";let focusExceptions="a.addthis_button_compact";function trapArrowKeys(obj,evt){if(evt.which==37||evt.which==38||evt.which==39||evt.which==40){let o=obj.find('*');let focusableItems=o.filter(focusableElementsString).filter(':visible');let unfocusableItems=focusableItems.filter(focusExceptions);let focusedItem=$(':focus');let numberOfFocusableItems=focusableItems.length-unfocusableItems.length;let focusedItemIndex=focusableItems.index(focusedItem);if(evt.which==38){if(focusedItemIndex==0){focusableItems.get(numberOfFocusableItems-1).focus();evt.preventDefault();}}else if(evt.which==40){if(focusedItemIndex==numberOfFocusableItems-1){focusableItems.get(0).focus();evt.preventDefault();}}}}
function trapEscapeKey(obj,escItemSelector,evt){if(evt.which==27){let o=obj.find('*');let cancelElement=o.filter(escItemSelector);cancelElement.click();evt.preventDefault();}};function trapTabKey(obj,evt){if(evt.which==9){let o=obj.find('*');let focusableItems=o.filter(focusableElementsString).filter(':visible');let unfocusableItems=focusableItems.filter(focusExceptions);let focusedItem=$(':focus');let numberOfFocusableItems=focusableItems.length-unfocusableItems.length;let focusedItemIndex=focusableItems.index(focusedItem);if(evt.shiftKey){if(focusedItemIndex==0){focusableItems.get(numberOfFocusableItems-1).focus();evt.preventDefault();}}else{if(focusedItemIndex==numberOfFocusableItems-1){focusableItems.get(0).focus();evt.preventDefault();}}}};function trapKeys(dialogSelector,escItemSelector){$(dialogSelector).off('keydown');$(dialogSelector).each(function(index){let $dlg=$(this);$dlg.keydown(function(event){trapTabKey($(this),event);trapEscapeKey($(this),escItemSelector,event);})});}
function getCurrentScript(){if(document.currentScript)
return document.currentScript;}
function hasContent(scriptElem,content){return($(scriptElem).text().indexOf(content)!==-1);}
function getScriptByContent(content){let scripts=document.getElementsByTagName("script");for(let i=0;i<scripts.length;++i)
if($(scripts[i]).text().indexOf(content)!==-1)
return scripts[i];return null;}
function isOverflown(element){return element.scrollHeight>element.clientHeight||element.scrollWidth>element.clientWidth;}
function toggleTextElipsis(textSelector,parentSelector){$(textSelector).each(function(){let $text=$(this);if(parentSelector===null){if(isOverflown(this)){$text.addClass('elidedText');}}
else{let $container=$($(this).closest(parentSelector)[0]);if($text.height()-$container.height()>1&&$container.height()>0){$container.addClass('elidedText');}}});}
function simulateScroll(){window.scrollTo(window.scrollX,window.scrollY+1);window.scrollTo(window.scrollX,window.scrollY-1);}
function closePanel(closePanelString){if(closePanelString){try{document.getElementById(closePanelString).style.display='none';}catch(e){}}}
function closeSlidePanel(closePanelString){if(closePanelString){if(closePanelString==="portalMobileMenus")
$(".burgerContainer").removeClass("burgerActive");let panelLeft=document.getElementById(closePanelString).style.left;document.getElementById(closePanelString).style.left="-100%";return(panelLeft==="0px"||panelLeft==="");}}
function panelToggleRaw(panelIdString,closePanel1String,closePanel2String){if(panelIdString){let panelId=document.getElementById(panelIdString);let panelDisplay=window.getComputedStyle(panelId,null).getPropertyValue('display');if(panelDisplay==='none'||panelDisplay===''){panelId.style.display='block';}else{panelId.style.display='none';}}
closePanel(closePanel1String);closePanel(closePanel2String);}
function panelToggle(panelIdString,closePanel1String,closePanel2String){try{panelToggleRaw(panelIdString,closePanel1String,closePanel2String);}catch(e){}}
function panelToggleFixed(panelIdStrings,panelClassString){let panelIds=panelIdStrings.split(',');let panelIdString;for(i=0;i<panelIds.length;i++){try{panelToggleRaw(panelIds[i]);panelIdString=panelIds[i];break;}catch(x){}}
if(panelIdString){let $panelId=$('#'+panelIdString);if($panelId){let panelDisplay=window.getComputedStyle($panelId[0],null).getPropertyValue('display');if(panelDisplay==='none'||panelDisplay===''){$panelId.find("."+panelClassString).removeClass("fixedPanel");}else{$panelId.find("."+panelClassString).addClass("fixedPanel");}}}else{console.log('No panel found to attach class '+panelClassString);}}
function panelSlide(panelIdString){try{if(panelIdString){let panelId=document.getElementById(panelIdString);let panelLeft=window.getComputedStyle(panelId,null).getPropertyValue('left');if(panelLeft==="0px"||panelLeft===""){closeSlidePanel(panelIdString);$('html').css({"overflow-y":"auto","position":"relative"});if(panelIdString==="portalMobileMenus")
$(".burgerContainer").removeClass("burgerActive");return false;}else{panelId.style.left="0";$('html').css({"overflow-y":"hidden","position":"fixed"});if(panelIdString==="portalMobileMenus")
$(".burgerContainer").addClass("burgerActive");return true;}}}catch(e){}}
function closeMobileMenu(closeMenuIdString){if(closeMenuIdString)
$(closeMenuIdString).css({"bottom":"-1000px"});if(window.innerWidth<mobileBreakpoint){$('html').css({"overflow-y":"auto","position":"relative"});}}
function mobileMenuSlide(menuIdString,closeMenuIdString){closeMobileMenu(closeMenuIdString);let menuBottom=$(menuIdString).css("bottom");if(menuBottom==="-1000px"||menuBottom===""){let menuHeight=$(menuIdString).height();let menuPaddingBottom=47;let menuOffset=menuHeight+menuPaddingBottom;$(menuIdString).css({"bottom":menuPaddingBottom+"px"});if(window.innerWidth<mobileBreakpoint){$('html').css({"overflow-y":"hidden","position":"fixed"});}}else{closeMobileMenu(menuIdString);}}
function getQueryVariable(variable)
{let vars=window.location.search.substring(1).split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return(false);}
function queryGraphQL(queryQL,callback){let rv="";try{fetch('/graphql',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',},body:JSON.stringify({query:queryQL})}).then(function(r){return r.json();}).then(function(data){return callback(data);}).catch(function(error){console.log('GraphQL error: '+error);});}catch(err){console.log("Caught Exception in querying GraphQL: "+err.message);}}
function changeSelection(element,option){option=option||1;let selEl=document.getElementById(element);selEl.options[option].selected=true;$(selEl).trigger("change");}
let calledOnce=[];function onlyOnce(options,callback){if(calledOnce.indexOf(String(callback))===-1){calledOnce.push(String(callback));callback(options);}}
function removeArrayItem(array,item){let index=$.inArray($(item)[0],array);if(index!==-1)
array.splice(index,1);}
function showPopup(selector,autoHide,debug){autoHide=autoHide||true;debug=debug||false;$(selector).show("fast");if(!debug){$(window).mouseup(function(e){$(selector).hide("slow");setTimeout(function(){$(selector).remove();},2000);});$(window).keydown(function(e){if(e.which===27){$(selector).hide("slow");setTimeout(function(){$(selector).remove();},2000);}});if(autoHide){setTimeout(function(){$(selector).hide("slow");},5000);setTimeout(function(){$(selector).remove();},7000);}}}
function toggleNotification(selector,message){$(selector).append('<div tabindex="-1" class="popup-message" aria-live="polite"><p>'+message+'</p></div>');showPopup('.popup-message');}
function toggleNotifications(selector,messageArray){let finalMessage="";for(i in messageArray){$(messageArray[i].item).append('<div class="popup-message-arrow" style="display:none"></div>');finalMessage+=messageArray[i].text+'<br />';}
$(selector).after('<div tabindex="-1" class="popup-message" aria-live="polite"><p>'+finalMessage+'</p></div>');showPopup('.popup-message, .popup-message-arrow');}
function tagBrowser(){if(isSafari())$('html').addClass('safari_only');else if(isOpera())$('html').addClass('opera_only');else if(isChrome())$('html').addClass('chrome_only');else if(isFirefox())$('html').addClass('firefox_only');else if(isIE())$('html').addClass('ie_only');}
function hintExplainAcs(hasAccessCallback,page){$.ajax({url:(page||document.location.origin+document.location.pathname)+'?explainacs',type:'post',data:null,success:function(result){console.debug('explainacs request successful');},error:function(xhr,status,error){console.warn('explainacs request failed: '+error);}}).done(function(data){let chosen=data.getElementsByTagName("chosenReply");hasAccessCallback(chosen.length&&chosen[0].childNodes.length);});}
function offset(el){let rect=el.getBoundingClientRect(),scrollLeft=window.pageXOffset||document.documentElement.scrollLeft,scrollTop=window.pageYOffset||document.documentElement.scrollTop;return{top:rect.top+scrollTop,left:rect.left+scrollLeft,bottom:rect.bottom+scrollTop,right:rect.right+scrollLeft}}
function srSpeak(text,priority){var el=document.createElement("div");var id="speak-"+Date.now();el.setAttribute("id",id);el.setAttribute("aria-live",priority||"polite");el.classList.add("sr-only");document.body.appendChild(el);window.setTimeout(function(){document.getElementById(id).innerHTML=text;},100);window.setTimeout(function(){document.body.removeChild(document.getElementById(id));},1000);}
function includeHTML(){$('[include-html]').each(function(){let $div=$(this);$div.load($div.attr('include-html'));console.debug('Insticator Ads enabled');});}
function gaBlocked(){var ehi_ga=window[window['GoogleAnalyticsObject']||'ga'];return(typeof ehi_ga!='function'||ehi_ga.loaded!=true||!ehi_ga.create);}