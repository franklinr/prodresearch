function dfpEnabled(){if(inJournalScope())
return journalAdParams.serviceName.indexOf('DFP')>=0;else if(inMicrositeScope())
return micrositeDfpEnabled();else if(inGlobalScope())
return globalAdParams!==null;else
return false;}
function pushWhenReady(tagId){if(dfpSlotsReady){googletag.cmd.push(function(){googletag.display(tagId);});console.debug('googletag.cmd.push(function() { googletag.display('+tagId+');})')}else{setTimeout(pushWhenReady,500,tagId);}}
function slotRendered(event){var slot=event.slot;if(slot.getSlotElementId()==='div-gpt-ad-123456789-2'){moveRelatedJournals();}}
function showDfpAd(index){let tagId='';if(dfpEnabled()){if(inJournalScope()){if(docereeEnabled&&(index==0||index==2)){console.debug(index+': Doceree Ads');tagId='div-doceree-ad'+index.toString();}
else{console.debug(index+': Journal DFP');tagId='div-gpt-ad-123456789-'+index.toString();}}
else if(inMicrositeScope()){console.debug(index+': Microsite DFP');tagId='div-gpt-ad-'+dfpData.dfp_code+'-'+index.toString();}
else if(inPortalHome()){console.debug(index+': Portal DFP');tagId='div-gpt-ad-'+globalAdParams.portal.code+'-'+index.toString();}
else if(inSearchPage()){console.debug(index+': Search DFP');tagId='div-gpt-ad-'+globalAdParams.search.code+'-'+index.toString();}
else if(inBrowsePublications()){console.debug(index+': Browse DFP');tagId='div-gpt-ad-'+globalAdParams.browse.code+'-'+index.toString();}
else{return false;}
let script=getCurrentScript();if(!script)script=getScriptByContent('showDfpAd('+index+')');if(script){$(script).wrap('<div id="'+tagId+'"></div>');if(tagId.indexOf('doceree')!==-1){$('#'+tagId).load("/pb-assets/ads/ads-"+journalAdParams.alt_code+"-"+index+"-doceree.html");}
else{pushWhenReady(tagId);}}
else
console.warn('Failed to add div for DFP ad with index:'+index);return true;}
return false;}
function initJournalDfp(){if(dfpEnabled()){googletag.cmd.push(function(){googletag.defineSlot('/53867575/'+journalAdParams.dfp_slot+'//'+journalAdParams.alpha_code+'//728x90_Top',[728,90],'div-gpt-ad-123456789-0').addService(googletag.pubads());googletag.defineSlot('/53867575/'+journalAdParams.dfp_slot+'//'+journalAdParams.alpha_code+'//300x250_Top',[300,250],'div-gpt-ad-123456789-1').addService(googletag.pubads());googletag.defineSlot('/53867575/'+journalAdParams.dfp_slot+'//'+journalAdParams.alpha_code+'//300x250_bottom',[[160,600],[300,250]],'div-gpt-ad-123456789-2').addService(googletag.pubads());googletag.defineSlot('/53867575/'+journalAdParams.dfp_slot+'//'+journalAdParams.alpha_code+'//728x90_bottom',[728,90],'div-gpt-ad-123456789-3').addService(googletag.pubads());googletag.defineOutOfPageSlot('/53867575/'+journalAdParams.dfp_slot+'//'+journalAdParams.alpha_code+'//Interstitial','div-gpt-ad-123456789-4').addService(googletag.pubads());if(typeof AIM_126!=='undefined'){AIM_126.ready(function(){AIM_126.ondetect(function(json){googletag.pubads().setTargeting('aim_signal_specialty',[json.dmd_specialty_code]);console.debug('AIM_126.ondetect: '+JSON.stringify(json));});});googletag.pubads().enableAsyncRendering();console.debug('DMD AIM code is executed');}
console.log('Journal: Pushed DFP Ads');googletag.pubads().collapseEmptyDivs(true);googletag.pubads().set("page_url",window.location.origin);googletag.pubads().addEventListener('slotRenderEnded',slotRendered);googletag.enableServices();dfpSlotsReady=true;});}
else
console.log('Journal: CM8 Ads');}
function initPageDfp(page){if(dfpEnabled()){googletag.cmd.push(function(){googletag.defineSlot('/53867575/'+page.slot+'//728x90_Top',[728,90],'div-gpt-ad-'+page.code+'-0').addService(googletag.pubads());googletag.defineSlot('/53867575/'+page.slot+'//300x250_Top',[300,250],'div-gpt-ad-'+page.code+'-1').addService(googletag.pubads());googletag.defineSlot('/53867575/'+page.slot+'//300x250_bottom',[[160,600],[300,250]],'div-gpt-ad-'+page.code+'-2').addService(googletag.pubads());googletag.defineSlot('/53867575/'+page.slot+'//728x90_bottom',[728,90],'div-gpt-ad-'+page.code+'-3').addService(googletag.pubads());console.log(page.name+': Pushed DFP Ads');googletag.pubads().collapseEmptyDivs(true);googletag.pubads().set("page_url",window.location.origin);googletag.pubads().addEventListener('slotRenderEnded',slotRendered);googletag.enableServices();dfpSlotsReady=true;});}
else
console.log(page.name+': CM8 Ads');}
function initGlobalDfp(){if(inPortalHome())
initPageDfp(globalAdParams.portal);else if(inSearchPage())
initPageDfp(globalAdParams.search);else if(inBrowsePublications())
initPageDfp(globalAdParams.browse);}
(function(w,d,s,m,n,t){w[m]=w[m]||{init:function(){(w[m].q=w[m].q||[]).push(arguments);},ready:function(c){if('function'!=typeof c){return;}(w[m].c=w[m].c||[]).push(c);c=w[m].c;n.onload=n.onreadystatechange=function(){if(!n.readyState||/loaded|complete/.test(n.readyState)){n.onload=n.onreadystatechange=null;if(t.parentNode&&n.parentNode){t.parentNode.removeChild(n);}while(c.length){(c.shift())();}}};}},w[m].d=1*new Date();n=d.createElement(s);t=d.getElementsByTagName(s)[0];n.async=1;n.src='//www.medtargetsystem.com/javascript/beacon.js?'+(Date.now().toString()).substring(0,5);n.setAttribute("data-aim",m);t.parentNode.insertBefore(n,t);})(window,document,'script','AIM_126');AIM_126.init('126-610-A5ECBB04');console.debug('AIM_126 initialized');