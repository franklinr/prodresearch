
var sE = '#centerInner dl.figure, #centerInner dl.table, #centerInner dd.ecomponent, #centerInner h2, #centerInner h3, #centerInner h4';
var uE = '#centerInner div.articleOutlineHidden h2, #centerInner div.articleOutlineHidden h3, #centerInner div.articleOutlineHidden h4';
function initializeArticlePage(){
  ArticlePage = function() {
    var autoHide=0;
    var page = {
      objLColumn: $('#leftPane'),
      objCColumn: $('#centerPane'),
      objToolbarExt: $('#sdQuickSearch'),
      objToolbar: $('#articleToolbar'),
      selectorE: sE,
      selectorUE: uE,
      selectorE_BK: sE,
      selectorUE_BK: uE,
      boomboxAd:{width:280},
      ready: false,
      opts: {
        empty: false,
        selector: '',
        focusEffect: false,
        focus: {
          cssFocusFirst: 'outlineFocusFirst',
          cssFocus: 'outlineFocus',
          cssFocusLast: 'outlineFocusLast',
          scrollSyncSel: '#centerPane',
          idConvert: function(s) {return 'ol_'+s;}
        }
      },
      addDynamics: function() {
        //Enable the images
        $('#centerInner dl.figure').each(function() {
            if(SDM.imageLazyLoading==true && SDM.fullSize==true) {
                $(this).parent().parent().attr('style', $(this).parent().parent().attr('data-style') );
            }
        });
        if(SDM.imageLazyLoading==false) {
          $('#centerInner dl.figure dd a.linkText').click(function() {page.toggleImages('centerInner');});
        }
        else {
          $('#centerInner dl.figure dd a.linkText').hide();
        }

        $(".btnHolder").bind('click',function(e){page.toggleOptions(e,this);} );
        $('body').css('overflow', 'hidden').css('min-width', '');
        $('#header-area, #footer-area, #page-area, #articleToolbar').addClass('js');
        $('#leftPane, #leftPaneInner, #rightPane, #leftCloseBar, #centerPane, #outline, #olGraphCbBox, #centerInner, #rightInner').addClass('js');
        $('#leftPane, #centerPane, #rightPane').css('top', $('#articleToolbar').height());
        $('#leftCloseBar').css('margin-top', $('#articleToolbar').height());
        $('#page-area').css( { top: $('#header-area').height() } );
        if(SDU.isIE78()) {
          $(window).resize(function() { page.delay(function(){ page.setPaneWidths()}, 500)});
        }
        else {
          $(window).resize(_.debounce(page.setPaneWidths, 500));
        }
        page.setPaneWidths();
        rightSidePane.initAccordion();
        $('#rightPane').bind('resize', function(){$('#rightInner').accordion('resize');});
      },
      delay:function(callback, ms){   
        var timer = 0;  
        clearTimeout (timer);     
        timer = setTimeout(callback, ms);
      },
      verticalStretcher: function (paneScrlHeight, vpHeight) {
        var delta = 0;
        if(!$('#pStretcher').length) {
          $('#centerInner').append('<div id="pStretcher"></div>');
          $('#pStretcher').css('height', 0);
        }
        var sHeight = $('#pStretcher').css('height').split('px')[0]*1.0;
        var origPaneScrlHeight = paneScrlHeight - sHeight;
        if(origPaneScrlHeight<vpHeight) {
          if(SDU.isIE78()) delta = vpHeight - origPaneScrlHeight +150;
          else delta = vpHeight - origPaneScrlHeight +50;
        }
        $('#pStretcher').css({height:delta});
        DBG.out(1, 'ArticlePage::sizeStretcher()::stretcherHeight(' + delta + ')');
        return delta;
      },
      toggleOptions:function(e,obj) {
        var menuBtn = $(obj).parents('dd').find('ul.menuButton');
        if ($(menuBtn)[0]) {
          if($(menuBtn).is(":visible")){
            $(menuBtn).hide('blind');
            $(obj).parent().find("div").removeClass("up_Btn");
            $('body, .menuButton .viewWS').unbind('click',page.closeOptions);
          }else{
            page.closeOptions();
            $(menuBtn).show('blind', function(){
              if($('#footer-area').is(":visible")){
               $('#centerPane').scrollTop($('#centerPane')[0].scrollHeight);
              }
            });
            $(obj).parent().find('div').addClass("up_Btn");
            $('body, .menuButton .viewWS').unbind('click',page.closeOptions).bind('click',page.closeOptions);
          }
        }
        SD_UTIL.killEvent(e); 
      },
      closeOptions:function(e) {
        $('body, .menuButton .viewWS').unbind('click',page.closeOptions)
        $('.menuButtonLinks ul.menuButton').each(function(){
            if($(this).is(":visible")){
              $(this).parent('.menuButtonLinks').find("div").removeClass("up_Btn");
              $(this).hide('blind');
            }
        }); 
      }, 
      setPaneWidths: function () {
        $('html,body').css({'overflow-x': 'hidden', 'overflow-y': 'hidden'});
        //Check if browser tall enough for header/footer dynamics
        var vpHeight = $(window).height();
        var d = page.verticalStretcher($('#centerInner')[0].scrollHeight, vpHeight);
        page.viewHandler();

        pgLayout.vpWidth = $(window).width();
        /*reset to default values*/
        pgLayout.lcWidth = 258;
        pgLayout.ccWidth = 700;
        pgLayout.rcWidth = 300;
        pgLayout.lcLeft = 3;
        pgLayout.ccLeft = 260;
        pgLayout.rcLeft = 960;
        if (1606 <= pgLayout.vpWidth) {
          pgLayout.pgLeft = Math.floor(pgLayout.vpWidth/2) - 803;
          pgLayout.pgWidth = 1606;
          pgLayout.rcWidth = 640;
          Outline.sidebarOpen();
          rightSidePane.openPane();
          pgLayout.showRightBar=true;
          pgLayout.showLeftBar=true;
        }
        else if (1266 <= pgLayout.vpWidth) {
          pgLayout.pgLeft = 0;
          pgLayout.pgWidth = pgLayout.vpWidth;
          pgLayout.rcWidth = pgLayout.vpWidth - 965;
          $('#leftOpenBar').hide();
          Outline.sidebarOpen();
          rightSidePane.openPane();
          pgLayout.showRightBar=true;
          pgLayout.showLeftBar=true;
        }
        else if ((SDM.pm.contentType!="BK") && 1206 <= pgLayout.vpWidth) {
          pgLayout.pgLeft = 0;
          pgLayout.pgWidth = pgLayout.vpWidth;
          pgLayout.lcWidth = pgLayout.pgWidth-pgLayout.rcWidth-pgLayout.ccWidth-pgLayout.lcLeft;
          if(pgLayout.lcWidth>258)pgLayout.lcWidth=258;
          rightSidePane.openPane();
          $('#leftOpenBar').hide();
          Outline.sidebarOpen();
          pgLayout.showRightBar=true;
          pgLayout.showLeftBar=true;
        }
        else if ((SDM.pm.contentType!="BK") && 1020 <= pgLayout.vpWidth) {
          pgLayout.pgLeft = Math.floor(pgLayout.vpWidth/2) - 510;
          pgLayout.pgWidth = 1020;
          pgLayout.lcWidth = 20;
          pgLayout.lcLeft = 0;
          $(".toggleSideBar").show();
          rightSidePane.openPane();
          $('#leftOpenBar').show();
          page.delay(function(){ Outline.sidebarClose();}, pgLayout.holdAnimation);
          pgLayout.showRightBar=true;
          pgLayout.showLeftBar=false;
        }
        else if ((SDM.pm.contentType=="BK") && 1000 <= pgLayout.vpWidth) {
          pgLayout.pgLeft = Math.floor(pgLayout.vpWidth/2) - 490;
          pgLayout.pgWidth = 980;
          pgLayout.rcWidth = 20;
          pgLayout.lcLeft = 0;
          $(".toggleSideBar").show();
          $('#leftOpenBar').hide();
          Outline.sidebarOpen();
          if(pgLayout.showRightBar)page.delay(function(){rightSidePane.closePane();}, pgLayout.holdAnimation);
          pgLayout.showRightBar=false;
          pgLayout.showLeftBar=true;
        }
        else if (746 <= pgLayout.vpWidth) {
          $(".toggleSideBar").show();
          pgLayout.pgLeft = Math.floor(pgLayout.vpWidth/2) - 370;
          pgLayout.pgWidth = 746;
          pgLayout.lcWidth = 20;
          pgLayout.rcWidth = 20;
          $('#leftOpenBar').show();
          page.delay(function(){ Outline.sidebarClose();rightSidePane.closePane();}, pgLayout.holdAnimation);
          pgLayout.showRightBar=false;
          pgLayout.showLeftBar=false;
        }
        else {
          pgLayout.pgLeft = 0;
          pgLayout.pgWidth = 746;
          pgLayout.lcWidth = 20;
          pgLayout.rcWidth = 20;
          $('#leftOpenBar').show();
          $(".toggleSideBar").show();
          page.delay(function(){ Outline.sidebarClose();rightSidePane.closePane();}, pgLayout.holdAnimation);
          pgLayout.showRightBar=false;
          pgLayout.showLeftBar=false;
          $('html,body').css({'overflow-x': 'auto', 'overflow-y': 'hidden'});
        }

        if(pgLayout.showLeftBar==false) {
          $('#leftPane,#leftCloseBar').css('left', pgLayout.lcLeft);
          $('#leftPane').css('width', 258);
        }
        else{
          $('#leftPane,#leftCloseBar').css('left', pgLayout.lcLeft);
          $('#leftPane').css('width', pgLayout.lcWidth);
        }

        pgLayout.ccLeft=pgLayout.lcLeft+pgLayout.lcWidth;
        if(pgLayout.lcWidth<=20) {
          pgLayout.ccLeft-=2
        }
        pgLayout.rcLeft=pgLayout.ccLeft+pgLayout.ccWidth;
        $('#centerPane').css('left', pgLayout.ccLeft);
        $('#header-area,#footer-area,#page-area').css('width', pgLayout.pgWidth).css('left', pgLayout.pgLeft);
        if(pgLayout.showRightBar==false && $('#rightInner').css('display')!='none' && $('#rightPane').width()>20) {
          $('#rightInner').css('width',pgLayout.rcFloatWidth-22);
          $('#rightPane').css('width',pgLayout.rcFloatWidth).css('left',((pgLayout.ccLeft+pgLayout.ccWidth+20)-pgLayout.rcFloatWidth));
          $('#rightInner .innerPadding, #rightInner .innerPaddingApp').width(pgLayout.rcFloatWidth-55);
          $('#rightInner .js_workspace_content').css('width','');
          $('#rightInner div.scrollArea').width(pgLayout.rcFloatWidth-50);
        }
        else if(pgLayout.showRightBar==true) {
          $('#rightPane').css('left',pgLayout.rcLeft).css('width',pgLayout.rcWidth);
          $('#rightInner').css('width',pgLayout.rcWidth-2);
          $('#rightInner .innerPadding, #rightInner .innerPaddingApp').width(pgLayout.rcWidth-35);
          $('#rightInner .js_workspace_content').css('width','');
          $('#rightInner div.scrollArea').width(pgLayout.rcWidth-40);
        }
        else {
          $('#rightPane').css('left',pgLayout.ccLeft+pgLayout.ccWidth);
          $('#rightInner .innerPadding, #rightInner .innerPaddingApp').width(pgLayout.rcWidth-35);
          $('#rightInner .js_workspace_content').css('width','');
        }

        page.objToolbar.css('width', pgLayout.pgWidth);
        page.objToolbarExt.css('width', pgLayout.pgWidth-27);
        if(SDU.isIE7())page.setPageHeight();
        if($('#centerPane').height()!='')$('#leftPane').height('').height($('#centerPane').height());
        rightSidePane.resizeAccordion();
      },
      setPageHeight: function(param,heightVal){
        var headerHeight=0,footerHeight=0,spareHeight=0;
        if ($('#header-area').is(':visible'))headerHeight=$('#header-area').height();
        if(param=='footer'){
            footerHeight=heightVal;
        }else{
            if ($('#footer-area').is(':visible')){footerHeight=$('#footer').height();}
        }
        if(headerHeight==0)spareHeight=3;
        $('#page-area').height($(window).height()-headerHeight-footerHeight-spareHeight);
        if($('#centerPane').height()!='')$('#leftPane').height('').height($('#centerPane').height());
      },
      toggleImages: function(zStr) {
        $('#centerInner dl.figure').each(function() {
            var img = $(this).find('img.figure');
            if(img.attr('id')!='gabsImg'){
              if(SDM.fullSize==true) {
                img.removeClass('smallImg');
                if(img.attr('src')!=img.attr('data-thumbsrc')) {
                  img.attr('src', img.attr('data-thumbsrc'));
                  img.attr('height', img.attr('data-thumbheight'));
                  img.attr('width', img.attr('data-thumbwidth'));
                }
                if(SDM.imageLazyLoading==false) {
                  $(this).find('a.linkText').text("View full-size images");
                }
              }
              else {
                if(SDM.imageLazyLoading==true) {
                  img.attr('data-loaded', 'false');
                  img.attr('src', "/sd/grey_pxl.gif");
                  img.attr('height', img.attr('data-fullheight'));
                  img.attr('width', img.attr('data-fullwidth'));
                }
                else {
                  img.attr('src', img.attr('data-fullsrc'));
                  img.attr('height', img.attr('data-fullheight'));
                  img.attr('width', img.attr('data-fullwidth'));
                  $(this).find('a.linkText').text("View thumbnail images");
                }
                if(img.attr('data-fullwidth')>=580 && img.attr('data-fullwidth')<=800){
                    img.addClass('smallImg');
                    img.attr('height', '').attr('width', '');
                }
              }
            }
        });
        if(SDM.fullSize==true) {
          SD_UTIL.sendUserKeyEvent('disableFullSizeImages', 'article', zStr, SDM.keOriginContentFamily);
          $('#optImgToggle').html("Show full-size images");
          SDM.fullSize=false;
        }
        else {
          SDM.fullSize=true;
          $('#optImgToggle').html("Show thumbnail images");
          SD_UTIL.sendUserKeyEvent('enableFullSizeImages', 'article', zStr, SDM.keOriginContentFamily);
        }
        if(SDM.imageLazyLoading==true) {
            $('#centerPane').lazyLoadImages({imgSel:'img.imgLazyJSB'});
        }
        $('#centerPane').doTheScrollJitter();
      }, //toggleImages
      lazyLoadInit: function() {
        $("img.imgLazyJSB").show();
        $('#centerPane').lazyLoadImages({imgSel:'img.imgLazyJSB'});  
        $('#outline').lazyLoadOutlineImages({imgSel:'img.smlImgLazyJSB'});  
      },
      viewHandler: function( e ){
        $("#centerPane").unbind( "scroll.viewHandler", page.delayedScrollHandler );
        var h = $("#centerPane").height();
        var st = $("#centerPane").scrollTop();
        var sh = $('#centerPane')[0].scrollHeight;

        if( st > $('#centerPane').attr('data-st') ) { $('#centerPane').attr('data-dir', 'd'); }
        else { $('#centerPane').attr('data-dir', 'u'); }
        $('#centerPane').attr('data-st', $("#centerPane").scrollTop());
        if(st>20) {
          page.hideHeader();
        }
        else {
          page.showHeader();
        }
        setTimeout(page.viewHandlerFooter, 450);
      },
      viewHandlerFooter: function() {
        var h = $("#centerPane").height();
        var st = $("#centerPane").scrollTop();
        var sh = $('#centerPane')[0].scrollHeight;
        if(st+h > sh-20) {
          page.showFooter();
        }
        else {
          page.hideFooter();
        }
        $("#centerPane").bind("scroll.viewHandler", page.delayedScrollHandler );           
      },
      hideHeader: function(){
        if($('#header-area').attr('data-dynamic')=='n') {return;}
        if($("#header-area").css('display') == 'none' || $('#centerPane').attr('data-st')=='d') {return;}
        $("#header-area").hide('blind', {}, 300);
        $("#page-area").css("border-top","3px solid #6c9d30");                
        $("#page-area").animate({"top": 0 },400, function() {
          setTimeout(function() {rightSidePane.resizeAccordion(); }, 400);
          if(SDU.isIE7())page.setPageHeight();
        });
        $('#leftPane').height('');
      },
      showHeader: function(){
        if($('#header-area').attr('data-dynamic')=='n') {return;}
        if($("#header-area").css('display') != 'none') {return;}
        $("#page-area").css("border-top","none");
        $("#header-area").show('blind', {}, 300);
        var height =  $("#header-area").height();
        $("#page-area").animate({"top": height }, 300, function() {
            setTimeout(function() {rightSidePane.resizeAccordion(); }, 400);
            if(SDU.isIE7())page.setPageHeight();
        });                
        $('#leftPane').height('');
      },
      showFooter: function(){
        var googleAdsAvail = false;
        if($('#footer-area').attr('data-dynamic')=='n') {return;}
        $("#centerPane").unbind( "scroll.viewHandler", page.delayedHandler);

        if (googleAds!='' && !$('#footer-area #ggcon')[0]) {
          $('#footer .bottomArticle').append('<div id="ggcon">' + googleAds + '</div>');
          $('#ggcon').css('display', 'inline-block').show();	
        }

        var height = $("#footer").height();
        if(height==0){
          $("#footer-area").css({'position':'absolute','visibility':'hidden','display':'block','height':'auto'}); 
          if ($('#footer-area #ggcon')[0] && $('#footer-area #ggcon').is(':visible')) googleAdsAvail = true 
          height = $("#footer").height(); 
          $("#footer-area").css({'position':'','visibility':'','display':''}); 
        }
        if(SDU.isIE7() && googleAdsAvail) { height += 15; } else { height+=6; }
        $("#page-area").animate(  {"bottom": height }, 200,function(){
            $("#footer-area").css('display','block');
            $("#footer-area").animate( {"height": height },300);
            setTimeout(function() {rightSidePane.resizeAccordion(); }, 400);
            $("#centerPane").bind("scroll.viewHandler", page.delayedScrollHandler);
            if(SDU.isIE7())page.setPageHeight('footer', height);
        });
        $('#centerPane').attr('data-st', $("#centerPane").scrollTop()-$("#footer-area").height());
        $('#leftPane').height('');
      },
      hideFooter: function(){
        if($('#footer-area').attr('data-dynamic')=='n') {return;}

        var height = $("#footer-area").height();
        if( height === 0 ){ return; } // already collapsed 
        var scrollTop = $("#centerPane").scrollTop();            
        $("#footer-area").animate({"height":0},300,function(){
            $("#page-area").animate({"bottom":0},300,function() {
                setTimeout(function() {rightSidePane.resizeAccordion(); }, 400);
                $("#footer-area").css('display','none');
                if(SDU.isIE7())page.setPageHeight();
            });
        });
        $('#leftPane').height('');
      },         
      showLeftAd:function() {
        if(SDM.adPreventOutline == true) return;
        $("#articleLeftAd").append('<iframe scrolling="no" frameborder="0" border="0" cellspacing="0" src="' + SDM.adArticleLeftURL + '"></iframe>');
      },
      adRemoveOutline:function() {
        $("#articleLeftAd").remove();
      },
      touchUpLeftAd:function() {
        $("#articleLeftAd iframe")[0].style.height = $("#articleLeftAd iframe")[0].contentWindow.document.body.offsetHeight + 'px';
        $("#articleLeftAd iframe")[0].contentWindow.document.body.style.background = "#ECF2F6";
      },
      showOptionsAd:function() {
        $("#articleOptionsAd").append('<iframe frameborder="0" scrolling="no" border="0" cellspacing="0" src="' + SDM.adArticleOptionsURL + '"></iframe>');
      },
      updateRightAdLeftPosition:function(){
        var sidebarAd = $("#articleRightAd");
        if( sidebarAd.css( 'position' )== 'fixed' ){
          var rightInner = $("#rightInner"); // fixes the left position issue.
          sidebarAd.css({'left': (rightInner.offset().left - $(window).scrollLeft() ) });
        }
      },
      hideGGCON:function() {
        $('#ggcon').hide();
        var height = $("#footer").height(); 
        height += 6;
        if($('#footer-area').height()>0) {
          $('#footer-area').css('height', height);
          $("#page-area").animate({"bottom": height}, 200, function(){$('#rightInner').accordion('resize');});
        }
        if(SDU.isIE7())page.setPageHeight('footer', height);
      },
      moveGGCON:function(s) {
        $('#footer .bottomArticle').append('<div id="ggcon">' + s + '</div>');
        $('#ggcon').css('display', 'inline-block').show();
        var height = $("#footer").height();
        if(height==0){
          $("#footer-area").css({'position':'absolute','visibility':'hidden','display':'block','height':'auto'});
          height = $("#footer").height();
          $("#footer-area").css({'position':'','visibility':'','display':''});
        } 
        if(SDU.isIE7()) {height += 15;} else {height+=6;}
        if($('#footer-area').height()>0) {
            $("#footer-area").animate( {"height": height },300);
            $("#page-area").animate({"bottom": height}, 200, function(){$('#rightInner').accordion('resize');})
            $('#rightInner').accordion('resize');
        }
        $('#leftPane').height('');
      },
      doHighlighting:function(ev) {
        var thisObj = $(ev.target).closest('a');
        var linkId = thisObj.attr('href');

        var idSel = linkId.replace(/[\.]/g, '\\.').replace(/[\:]/g, '\\:');
        var secSegment = $(idSel).parents(".textboxe-extra").children(".displayNone");
        if(secSegment) {
          if (secSegment.css("display") == "none") {
            var secImg = $(idSel).parents(".textboxe-extra").children(".tbxCollapse");
            secImg.attr("src","/scidirimg/minus.gif");
            secSegment.css("display","block");
          }
        }
        $('#centerPane').moveTo(linkId.substring(1));
        ev.preventDefault();
      },
      showFullTableLink:function(){
        $("dl.table").each(function(i){
            var thisObj = $(this);
            if($(thisObj.find('.table')).width()<$(thisObj.find('table')).width()){
              $(thisObj.find(".fullsizeTable")).css('display','block');
            }
            if($(thisObj.find('.table')).width()<$(thisObj.find('dt img')).width()){
              $(thisObj.find(".fullsizeTable")).css('display','block');
            }
        });
      },
      searchWithinErrorMsg:function(msg) {
        $('#searchWithin .errorMsg').remove();
        $('#searchWithin').prepend('<div class="errorMsg"><div class="msg"><div class="alertIcon"></div><span>' + msg + '</span></div></div>').addClass('bookError');
        $('#outline').addClass('bookError');
      },
      searchWithinErrorMsgClear:function() {
        $('#searchWithin, #outline').removeClass('bookError');
        $('#searchWithin .errorMsg').remove();
      },
      searchWithinNoResult:function() {
        page.searchWithinErrorMsg('No results were found');
      },
      searchWithinNoTerms:function() {
        page.searchWithinErrorMsg('No search terms entered');
      },
      searchWithinInvalidSearch:function() {
        page.searchWithinErrorMsg('Invalid search format');
      },
      searchWithinSubmit:function() {
        var searchStr = $('#searchWithin input[type=text]').prop('value');
        if(searchStr=='' || searchStr =='Search this book') {
          page.searchWithinNoTerms();
          return;
        }
        page.searchWithinErrorMsgClear();
        if(searchStr.search('SW()')!=-1) {
          page.searchWithinInvalidSearch();
          SearchWithin.clear(true);
          return;
        }
        SearchWithin.clear();
        SearchWithin.saveSearch(0,searchStr);
        var rslt = SearchWithin.reqResult('#srcOutline li', page.selectorE_BK, page.opts.focus.idConvert, page.searchWithinNoResult);
      },
      searchWithinInit:function() {
        var val = SearchWithin.loadSearch();
        if(val==null || val.str=='' || val.str =='Search this book' || val.cid!=SDM.pm.cid) {
          SearchWithin.clear();
          $('#searchWithin input[type=text]').parent().siblings('.clearWithin').children().addClass('clearXHide').removeClass('clearXShow');
        }
        else {
          $('#searchWithin input[type=text]').prop('value', val.str);
          $('#searchWithin input[type=text]').parent().siblings('.clearWithin').children().removeClass('clearXHide').addClass('clearXShow');
          SearchWithin.init('#srcOutline li', page.selectorE_BK, page.opts.focus.idConvert, page.searchWithinNoResult);
        }
      },
      setupRelatedPDF:function() {
        $("#pdfLink").click(function(event) {
            var t = $(event.currentTarget);
            if (t.attr("pdfurl")) {
              pdfCite.openPDF (t.attr("pdfurl"), event);
            }
            if (t.attr("suggestedarturl")) {
              pdfCite.suggestedArt (t.attr("suggestedarturl"));
              if (t.attr("citingArtURL")) {
                pdfCite.citedArtURL = t.attr("citingArtURL");
              }
            }
            else {
              pdfCite.suggestedArtDisplayed = false;
            }
            return true;
        });
      }
    } //page

    if($.browser.msie && $.browser.version <= 6) {return;}

    if($('#pdfLink').length && $('#pdfLink').attr('href').indexOf('MiamiImageURL')!=-1 && SDM.entitled==true) {
      $('#pdfLink').click(function() {
          var nw = window.open($('#pdfLink').attr('href'), 'newPdfWin', 'height=' + $(window).height()*.9 + ',width=' + $(window).width()*.9);
      });
    }

    ArticleToolbar.init();
    page.addDynamics();
    page.hideFooter();
    page.setupRelatedPDF();
    CrossMark.init();

    Outline.init();
    if(SDM.entitled==true && SDM.pageType=='article_full') {
      if(SDM.pm.contentType=="BK") {
        page.opts.selector = page.selectorE_BK;
        page.opts.searchWithin = true;
      }
      else {
        page.opts.selector = page.selectorE;
      }
      page.opts.focusEffect = true;
    }
    else {
      page.opts.focusEffect = false;
      if(SDM.pm.contentType=="BK") {
        page.opts.selector = page.selectorUE_BK;
        page.opts.searchWithin = true;
      }
      else {
        page.opts.selector = page.selectorUE;
      }
    
      if(!$('#centerInner div.articleOutlineHidden').length) {
        page.opts.empty = true;
        if(SDM.pm.contentType!='BK') {
          $('#outline').css('top', 0);
        }
        $('#outline .outlineMsg').html('This document does not have an outline.')
                                 .css('padding-left',5)
                                 .css('margin-top', 38)
                                 .show();
      }
    }
    $('#centerInner').outline( $('#outline'), page.opts );

    $('#outline ul li').css('margin-right', $.scrollBarWidth());
    $('#outline').attr('data-st', 0);


    page.delayedScrollHandler = _.debounce( page.viewHandler, 300 );
    $( "#centerPane" ).bind( "scroll.viewHandler", page.delayedScrollHandler );
    $(".intra_ref,.authorVitaeLink,.figureLink,.authorName, .viewWS").bind("click",rightSidePane.findTargetElement);
    $('a.articleOptions').toggle(
        function() { $('div.articleOptions').css('display', 'block');},
        function() { $('div.articleOptions').css('display', 'none');}
    );
    $('#optImgToggle').click(function() {page.toggleImages('toolbar');});
    $('#leftPane').height('');

    populateRelLinks();
    if(SDM.imageLazyLoading==true) {
      page.lazyLoadInit();
    }
    else {
      $(".imgInstantJSB").show();
    }

    page.showFullTableLink();
    $('div.downloadCsv').bind("click", TableDownload.processRequest);
    $('a.ppt').bind("click", FigureDownload.processRequest);

    if(SDM.pm.contentType == "BK") EbookTOC.init();

    EComponent.init();
    CanonicalLink.init();
    CanonicalHomeLink.init();
    page.searchWithinInit();

    refResolve();

    if(SDM.displayGadgets) {
      GadgetUtil.loadGadgets();
    }
    Outline.hoverOverOff();

    ready=true;
    return page;
  }();
} //initializeArticlePage

function checkSearchWithin() {
  if($('#searchWithin input[type=text]').prop('value')=='') {
    $('#searchWithin input[type=text]').parent().siblings('.clearWithin').children().addClass('clearXHide').removeClass('clearXShow');
  }
  else {
    $('#searchWithin input[type=text]').parent().siblings('.clearWithin').children().removeClass('clearXHide').addClass('clearXShow');
  }
}

$.fn.outline = function(oObj, opts) {
  var cfg = {
    empty: false,
    selector: '.outlineItem',
    graphicsToggler: true,
    searchWithin: false,
    focusEffect: true,
    focus: {}
  };

  return this.each(function() {
    if(opts) {
      $.extend(true, cfg, opts);
    }

    oObj.append('<ul id="itemOutline"></ul>');
    if(cfg.graphicsToggler) {
    oObj.parent().prepend('<div id="olGraphCbBox">'
            + '<label><input id="outlineGraphicsCheckBox" type="checkBox" checked="true">Show thumbnails in outline</label>'
            + '</div>');
    }
    if(cfg.searchWithin) {
      oObj.parent().prepend('<div id="searchWithin" class="textEntry" role="Search" aria-label="Book">'
          + '<form name="searchWithinForm" action="javascript:checkSearchWithin();ArticlePage.searchWithinSubmit();">'
          + '<input type="text" value="Search this book" title="Search this book" size="26" maxlength="450"></input></form>'
          + '<button class="clearWithin" title="Clear book search"><div class="clearXHide"></div></button>'
          + '<button class="submit" title="Search this book"></button>'
          + '</div>');
      $('#searchWithin button.clearWithin').click(function() {
          $('#searchWithin input[type=text]').prop('value', 'Search this book');
          $(this).children().addClass('clearXHide').removeClass('clearXShow');
          SearchWithin.clear();
      });
      $('#leftPane button.submit').click(function() {ArticlePage.searchWithinSubmit();});

      $('#searchWithin input[type=text]').focusin(function() {
          if($(this).prop('value')=='Search this book') {
            $(this).prop('value', '');
          }
      });
      $('#searchWithin input[type=text]').focusout(function() {
          if($(this).prop('value')=='') {
            $(this).prop('value', 'Search this book');
            $(this).parent().siblings('.clearWithin').children().addClass('clearXHide').removeClass('clearXShow');
          }
          else {
            $(this).parent().siblings('.clearWithin').children().removeClass('clearXHide').addClass('clearXShow');
          }
      });
    }
    var level = "";
    var isGraphics = false;
    prs.rt('outlineLoop_start');

    if($(cfg.selector).length>0) {
      $(cfg.selector).each(function() {
        if($(this).parents('.textboxBody').length>0) {}
        else {
          if($(this).attr('id')==undefined) {
            $(this).attr('id', 'bs_' + Math.floor(Math.random()*100000));
            DBG.out(1, 'fixing id::' + $(this).attr('id') + '::'  + $(this).text());
          }
          DBG.out(4, 'adding::' + $(this).text());

          if($(this).is("h2")||$(this).is("h3")||$(this).is("h4")) {
            level = $(this)[0].tagName;
            level = level.toLowerCase();
            var label = $(this).html();
            var hasMml=$(this).find("#itemOutline .mathmlsrc"); 
            if(hasMml) { 
              $("#itemOutline .mathmlsrc").attr('onclick',''); 
            }
            if(label==undefined) label='';
            if (SDM.entitled==true) {
              oObj.children('ul').append(Outline.addItemSection($(this).attr('id'), label, level));
            }
            else {
              //Note: In case of unentitled view we render the outline from a hidden div in center pane
              oObj.children('ul').append(Outline.addItemOutline($(this).attr('id'), label, level));
            }
          }
          else {
            isGraphics = true;
            if($(this).hasClass('table')==true) {
              var label = $(this).attr('data-label');
              if(label==undefined) label='';
              oObj.children('ul').append(Outline.addItemTbl($(this).attr('id'), label, level));
            }
            else if($(this).hasClass('figure')==true) {
              var label = $(this).find(".label").html();
              if(label==undefined) label='';
              var image = $(this).find("dt img").attr('data-thumbsrc');
              var thumbHeight = $(this).find("dt img").attr('data-thumbheight');
              if(!$(this).children('div').attr('id')){
                oObj.children('ul').append(Outline.addItemFig($(this).attr('id'), label, image, level, thumbHeight));
              }
            }
            else if($(this).hasClass('ecomponent')==true) {
              var label = $(this).attr('data-label');
              if(label==undefined) label='';
              var ext = $(this).attr('data-ext');
              oObj.children('ul').append(Outline.addItemMMC($(this).parent('dl').attr('id'), label, ext, level));
            }
            else {}
          }
        }
      })
      $('#leftPane .outlineMsg').remove();
    }
    else {
      if(SDM.pm.contentType!='BK') {
        $('#outline').css('top', 0);
      }
      $('#outline .outlineMsg').html('This document does not have an outline.')
                               .show();
    }
    prs.rt('outlineLoop_end');
    oObj.append('<div id="articleLeftAd"></div>');
    
    //Setup the sync between rightPane scroll and outline highlight
    if(cfg.focusEffect==true) {
      oObj.syncTo(cfg);
    }
    
    $('#leftPane ul').show();
    
    if(SDM.outlineImgFence==true)  {
      if($('li div.fig, li div.tbl, li div.mmc').length > 0 && SDM.entitled==true) {
        if(SDM.outlineGraphics == true) {
          $('#outlineGraphicsCheckBox').prop('checked', true);
        }
        else {
          $('#outlineGraphicsCheckBox').prop('checked', false)
          $('li div.fig, li div.tbl, li div.mmc').parent().hide();
        }
        $('#outlineGraphicsCheckBox').change(function() {
            Outline.toggleGraphics();
            if($('#outlineGraphicsCheckBox').prop('checked')==true) {
              SD_UTIL.sendUserKeyEvent('enableOutlineGraphics', 'article', 'leftPane', SDM.keOriginContentFamily);
            }
            else {
              SD_UTIL.sendUserKeyEvent('disableOutlineGraphics', 'article', 'leftPane', SDM.keOriginContentFamily);
            }
        });
      }
      else {
        $('#outlineGraphicsCheckBox').prop('checked', false);
        $('#olGraphCbBox label').hide();
      }
    }
    else {
      $('#olGraphCbBox').hide();
      $('#outlineGraphicsCheckBox').prop('checked', false)
      $('li div.fig, li div.tbl, li div.mmc').parent().hide();
    }
  
    $('#leftCloseBar').click(function(e) {Outline.sidebarOpenClick(e)});
    $('#leftOpenBar').click(function(e) {Outline.sidebarCloseClick(e)});
  }); //return
} //.outline

var CrossMark = {
  cssUrl:'',
  init:function() {
    $("#open-crossmark").delegate("#crossmark-icon", "click",function(event){
        $.get(SDM.crossMarkURL +'/'+  SDM.pii + '/article/centerPane/displayPopup/' + SDM.keOriginContentFamily +'/'+ SDM.issn_or_isbn);
    });
    if($('#open-crossmark')[0]){
      LazyLoad.js([SDM.crossMarkLib], function() {
           $("#open-crossmark").css('display','inline-block');
           $('#open-crossmark').click(function(){$(".ui-dialog-titlebar").css('top','0px').css('width','520px');});
      });
    }
    $('#open-crossmark').bind('mouseover',function(){setTimeout(CrossMark.setCss,1000);});
    $('#open-crossmark').bind('mouseout',function(){setTimeout(CrossMark.removeCss,1000);});
    $('body').bind('mousemove',CrossMark.removeCss);
  },
  setCss:function(){
     if(!$('link[href*="crossmark_widget.css"]')[0]){
        $('body').prepend('<link href="'+CrossMark.cssUrl+'" rel="stylesheet" type="text/css"/>');
     }else{
        CrossMark.cssUrl=$('link[href*="crossmark_widget.css"]').attr('href');
     }
  },
  removeCss:function(){
     if($('link[href*="crossmark_widget.css"]')[0] && !$('.ui-widget-overlay').is(':visible') && !$('#crossmark-tooltip-130').is(':visible')){
        CrossMark.cssUrl=$('link[href*="crossmark_widget.css"]').attr('href');
        $('link[href*="crossmark_widget.css"]').remove();
     }
  }
}

var SearchWithin = {
  init:function(bkOutlineSelStr, selStr, idConvert, funcNoResult) {
    var val = SearchWithin.loadSearch();
    if(val.cid==SDM.pm.cid && val.str) {
      var swObj = SearchWithin.loadResult();
      if(swObj) {
        if(swObj && swObj.cid==SDM.pm.cid) {
          if(swObj.status!=0) {
            SearchWithin.clear();
          }
          else {
            SearchWithin.processResult(swObj, bkOutlineSelStr, selStr, idConvert);
          }
        }
        else {
          SearchWithin.reqResult(bkOutlineSelStr, selStr, idConvert, funcNoResult);
        }
      }
      else {
        SearchWithin.reqResult(bkOutlineSelStr, selStr, idConvert, funcNoResult);
      }
    }
  },
  loadSearch:function() {
    var flag=true;
    var searchStr='';
    var cidStr = '';
    var beg = document.cookie.indexOf('SEARCHWITHIN=');
    if(beg!=-1) {
      beg = beg + 'SEARCHWITHIN='.length;
      var end = document.cookie.indexOf(';', beg);
      var cookieStr = document.cookie.slice(beg, end);
      flag = cookieStr.split('SW()')[0];
      searchStr = cookieStr.split('SW()')[1];
      cidStr = cookieStr.split('SW()')[2];
    }
    else {
      return {f:'',str:'',cid:''};
    }
    return {f:flag,str:searchStr,cid:cidStr}; //[searchStr, cidStr];
  },
  saveSearch: function(f, sStr) {
    var site = document.location.pathname.split('/article/pii/')[0];
    document.cookie='SEARCHWITHIN' + '=' + f + 'SW()' + sStr + 'SW()' + SDM.pm.cid + ';;path=' + site;
  },
  reqResult: function(bkOutlineSelStr, selStr, idConvert, funcNoResult) {
    $.get('/science/searchwithin', function(res) {
        var result;
        try {
          result = $.parseJSON(res);
        }
        catch(e) {
          DBG.out(1, 'SearchWithin failed');
          return;
        }
        if(result.status==1 || typeof result.hitTerms=="undefined") {
          funcNoResult();
        }
        else {
          if(result.status==0) {
            SearchWithin.processResult(result, bkOutlineSelStr, selStr, idConvert);
          }
        }
    });
  },
  processResult: function(result, bkOutlineSelStr, selStr, idConvert) {
    SearchWithin.hlCenterPane(result.hitTerms.toString().replace(/,/g, ' '), selStr, idConvert);
    SearchWithin.hlOutline(result.piis, bkOutlineSelStr);
    SearchWithin.saveResult(result);
  },
  saveResult: function(rslt) {
    if(SDU.cookieAvail()&&SDU.sessionStorageAvail()&&typeof JSON!='undefined') {
      sessionStorage.setItem('bk.sw', JSON.stringify(rslt));
    }
  },
  loadResult: function() {
    if(SDU.cookieAvail()&&SDU.sessionStorageAvail()) {
      var sw = sessionStorage.getItem('bk.sw');
      if(sw) {
        var swObj = $.parseJSON(sw);
        if(swObj.cid==SDM.pm.cid) {
          return swObj;
        }
        else {
          SearchWithin.clearResult();
          return null;
        }
      }
      else {
        SearchWithin.clearResult();
        return null;
      }
    }
  },
  clearResult: function() {
    if(SDU.cookieAvail()&&SDU.sessionStorageAvail()) {
      sessionStorage.removeItem('bk.sw');
    }
  },
  clear:function(keepMsg) {
    $('.swh').removeClass('swh');
    var site = document.location.pathname.split('/article/pii/')[0];
    document.cookie = 'SEARCHWITHIN' + '=; expires=Fri, 01-Jan-70 01:02:03 UTC;';
    document.cookie = 'SEARCHWITHIN' + '=; expires=Fri, 01-Jan-70 01:02:03 UTC;path=' + site;
    if(typeof keepMsg=="undefined" && typeof ArticlePage!="undefined")
      ArticlePage.searchWithinErrorMsgClear();
  }, //searchWithin.clear

  hlOutline:function(piis, selStr) {
    for(var pii in piis) {
      $(selStr).each(function() {
          if($(this).attr('data-pii')==piis[pii]) {
            DBG.out(1, 'Highlighting Book TOC item ' + $(this).text());
            $(this).find('div a').addClass('swh');
            EbookTOC.getPath2Item(piis[pii]).each(function() {
                $(this).children('a').addClass('swh');
            });
          }
      });
    }
  },

  hlCenterPane:function(hitTerms, selStr, idConvert) {
    searchStr = hitTerms;

    //center pane highlighting
    searchhi.process($('#centerPane')[0], searchStr);
    //outline highlighting
    var objs = $('.searchword').each(function() {
        $(this).attr('data-posy', $(this).position().top);
    });
    $(selStr).each(function() {
       $(this).attr('data-posy', $(this).position().top);
       objs.push(this);
    });
    objs = _.sortBy(objs, function(val) {
        return $(val).attr('data-posy')*1.0;
    });
    objs = _.filter(objs, function(val) {
        return $(val).parents('.textboxBody').length==0;
    });
    objs = objs.reverse();
    var len = objs.length;
    for(i=0; i<len; i++) {
      var $c = $(objs[i]);
      if($c.hasClass('searchword')) {
        var ii=i;
        while($(objs[ii]).length && $(objs[ii]).hasClass('searchword')) {ii++;}
        $('#' + idConvert($(objs[ii]).attr('id'))).addClass('swh');
        var foundType="h4";
        if($(objs[ii]).is("h4")) {
          foundType = "h4";
        }
        if($(objs[ii]).is("h3")) {
          foundType = "h3";
        }
        if($(objs[ii]).is("h2")) {
          foundType = "h2";
          done=true;
        }

        var done=false;
        while(!done && $(objs[ii]).length) {
          if(foundType=="h4") {
            if($(objs[ii]).is("h4")) {}
            if($(objs[ii]).is("h3")) {
              $('#' + idConvert($(objs[ii]).attr('id'))).addClass('swh');
            }
            if($(objs[ii]).is("h2")) {
              done=true;
              $('#' + idConvert($(objs[ii]).attr('id'))).addClass('swh');
            }
          }
          else if(foundType="h3") {
            if($(objs[ii]).is("h4")) {}
            if($(objs[ii]).is("h3")) {}
            if($(objs[ii]).is("h2")) {
              $('#' + idConvert($(objs[ii]).attr('id'))).addClass('swh');
              done=true;
            }
          }
          if($(objs[ii]).is("h2")) {
            done=true;
          }
          ii++;
        }
      }
    }
  }//searchWithin.highlight

} //SearchWithin


var Outline = {
  onHover:false,
  pendCloseTimer:null,
  init:function() {
    $('#leftPane').hover(
        function() {
          Outline.hoverOverOn();
          if(!pgLayout.showLeftBar) {
            clearTimeout(Outline.pendingCloseTimer);
          }
        }, 
        function() { 
          Outline.hoverOverOff();
          if(!pgLayout.showLeftBar) {
            Outline.pendingCloseTimer = setTimeout(Outline.sidebarClose, 1000);
          }
        } 
    );
  },
  addItemMMC: function(hashId, lbl, ext, hStr) {
    var ecn = "olIconMMCDef";
    if(ext=="pdf"){extCls="olIconMMCPdf"}
    else if(ext=="avi"){ecn="olIconMMCMov"}
    else if(ext=="csv"){ecn="olIconMMCCsv"}
    else if(ext=="eps"){ecn="olIconMMCEps"}
    else if(ext=="flv"){ecn="olIconMMCFlv"}
    else if(ext=="gif"){ecn="olIconMMCImg"}
    else if(ext=="jpg"){ecn="olIconMMCJpg"}
    else if(ext=="kmz"){ecn="olIconMMCDef"}
    else if(ext=="mml"){ecn="olIconMMCDef"}
    else if(ext=="xls"){ecn="olIconMMCExcel"}
    else if(ext=="ppt"){ecn="olIconMMCPpt"}
    else if(ext=="doc"){ecn="olIconMMCWord"}
    else if(ext=="mp3"){ecn="olIconMMCAud"}
    else if(ext=="mpg"){ecn="olIconMMCMov"}
    else if(ext=="mp4"){ecn="olIconMMCMpg4"}
    else if(ext=="txt"){ecn="olIconMMCTxt"}
    else if(ext=="png"){ecn="olIconMMCPng"}
    else if(ext=="mov"){ecn="olIconMMCMov"}
    else if(ext=="rtf"){ecn="olIconMMCRtf"}
    else if(ext=="svg"){ecn="olIconMMCSvg"}
    else if(ext=="tar"){ecn="olIconMMCDef"}
    else if(ext=="tif"){ecn="olIconMMCDef"}
    else if(ext=="zip"){ecn="olIconMMCZip"}
    else {ecn = "olIconMMCDef";}

    var html = "<li><div id='ol_" + hashId + "' class='io item " + hStr + "sec mmc'>"
             + "<div class=\"olIcon " + ecn + "\"></div><a class=\"olIcon " + ecn + "\" href='" + "' onClick=\"SD_UTIL.sendUserKeyEvent('displayTOCSection', 'article', 'leftPane', '" + SDM.keOriginContentFamily + "'); return $('#centerPane').moveTo('" + hashId + "\')\">"
             + lbl + "</a></div></li>";
    return html;
  },  //Outline.addItemMMC
  addItemTbl: function(hashId, lbl, hStr) {
    var html = "<li><div id='ol_" + hashId + "' class='io item " + hStr + "sec tbl'>"
             + "<div class=\"olIcon olIconTbl\"></div><a class=\"olIcon olIconTbl\" href='" + "' onClick=\"SD_UTIL.sendUserKeyEvent('displayTOCSection', 'article', 'leftPane', '" + SDM.keOriginContentFamily + "'); return $('#centerPane').moveTo('" + hashId + "\')\">"
             + lbl + "</a></div></li>";
    return html;
  },  //Outline.addOutlineItemTbl
  addItemFig: function(hashId, lbl, img, hStr, thumbHeight) {
    var html = "<li><div id='ol_" + hashId + "' class='io item " + hStr + "sec fig'>"
             + "<a href='" + "' onClick=\"SD_UTIL.sendUserKeyEvent('displayTOCSection', 'article', 'leftPane', '" + SDM.keOriginContentFamily + "'); return $('#centerPane').moveTo('" + hashId + "\')\">";
    if (SDM.imageLazyLoading==true) {
      html += "<img src=\"/sd/grey_pxl.gif\"  class=\"smlImgLazyJSB greyImg\" data-smlsrc='" + img + "' data-thumbheight='" + thumbHeight + "'/></a></div></li>";
    }
    else {
      html += "<img src='" + img + "' class=\"displayImg\"></a></div></li>";
    }
    return html;
  },  //Outline.addOutlineItemFig

  addItemSection: function(hashId, lbl, hStr) {
    var html = "<li><div id='ol_" + hashId + "' class='io item " + hStr + "sec'>"
             + "<a href='#" + hashId + "' onClick=\"SD_UTIL.sendUserKeyEvent('displayTOCSection', 'article', 'leftPane', '" + SDM.keOriginContentFamily + "'); return $('#centerPane').moveTo('" + hashId + "\')\">"
             + lbl + "<br>"
             + "</a></div></li>";
    return html;
  }, //Outline.addOutlineItemSection

  addItemOutline: function(hashId, lbl, hStr) {
    var html = "<li><div class='io item " + hStr + "sec'>"
             + "<a class='cLink' queryStr='" + SDM.urlTOCLinkQueryStr + "' href='" + SDM.urlTOCLink + "'\>"
             + lbl + "<br>"
             + "</a></div></li>";
    return html;
  }, //Outline.addOutlineItemSection
  sidebarOpenClick: function(e) {
    Outline.sidebarOpen(true);
    SD_UTIL.sendUserKeyEvent('openLeftPane', 'article', 'leftPane', SDM.keOriginContentFamily);
    return false;
  },
  sidebarCloseClick: function(e) {
    Outline.sidebarClose();  
    SD_UTIL.sendUserKeyEvent('closeLeftPane', 'article', 'leftPane', SDM.keOriginContentFamily);
    return false;
  },
  sidebarOpen: function(e) {
    if($('#leftPane').css('display')=='none') {
      $('#leftCloseBar').hide();
      $('#leftPane').height('').height($('#leftPane').height());
      $('#leftPane').show('slide',  250, function() {
          var ol = $('#outline');
          ol.css('overflow-y', 'auto');
          if(ol.attr('data-st')==undefined) {}
          else {
            ol.scrollTop(ol.attr('data-st'));
          }
          ol.css('overflow-y', 'hidden');
          if(e==true) {
            Outline.hoverOverOn();
          }
      });
    }
  },
  sidebarClose: function() {
    if($('#leftPane').css('display')=='block' && $('#leftPane').attr('data-closing')!='y') {
      var ol = $('#outline');
      var st = ol.scrollTop();
      ol.attr('data-st', st);
      ol.css('overflow-y', 'hidden');

      $('#leftPane').attr('data-closing', 'y');
      $('#leftPane').height('').height($('#leftPane').height());
      $('#leftPane').hide('slide', 250, function() {
          $('#leftCloseBar').show();
          $('#leftPane').attr('data-closing', '');
      });
    }
  },
  collapseSmallLeft: function() {
  }, //Outline.collapseSmallLeft
  expandSmallLeft: function() {
  }, //Outline.expandSmallLeft
  toggleGraphics: function(force) {
    if(SDM.outlineImgFence==false) return; // || $('#outlineGraphicsCheckBox').prop('checked')==false) return;
    if(SDM.outlineGraphics == true || (typeof(force)!=undefined && force=="hide") ) {
      SDM.outlineGraphics = false;
      var ulWidthBefore = $('#outline ul').width();
      $('li div.fig, li div.tbl, li div.mmc').parent().hide();
      var ulWidthAfter = $('#outline ul').width();
      if(ulWidthAfter > ulWidthBefore && !SDU.isIE7()) {
        $('#outline').css('overflow-x', 'hidden');
        $('#outline').attr('data-osbp', 'n');
        $('#outline ul li').css('margin-right', $.scrollBarWidth());
      }
      else if(ulWidthAfter < ulWidthBefore && !SDU.isIE7()) {
        $('#outline').attr('data-osbp', 'y');
        $('#outline ul li').css('margin-right', 0);
      }
    }
    else {
      SDM.outlineGraphics = true;
      var ulWidthBefore = $('#outline ul').width();
      $('li div.fig, li div.tbl, li div.mmc').parent().show();
      var ulWidthAfter = $('#outline ul').width();
      if(ulWidthAfter > ulWidthBefore && !SDU.isIE7()) {
        $('#outline').attr('data-osbp', 'n');
        $('#outline ul li').css('margin-right', $.scrollBarWidth());
      }
      else if(ulWidthAfter < ulWidthBefore && !SDU.isIE7()) {
        $('#outline').css('overflow-x', 'auto');
        $('#outline').attr('data-osbp', 'y');
        $('#outline ul li').css('margin-right', 0);
      }
    }
  }, //Outline.toggleGraphics
  hoverOverOn: function() {
    this.onHover = true;
    var ol = $('#outline');
    ol.doTheScrollJitter();
        
    var ulWidthBefore = $('#outline ul').width();

    if(SDU.isIE7()) {}
    else {
      ol.css('overflow-x', 'auto');
    }
        
    ol.css('overflow-y', 'auto');
    if(ol.attr('data-st')==undefined) {}
    else {
      ol.scrollTop(ol.attr('data-st'));
    }
        
    var ulWidthAfter = $('#outline ul').width();
    if(ulWidthAfter < ulWidthBefore) {
      ol.attr('data-osbp', 'y');
      if(SDU.isIE7()) {}
      else {
        if($('#lpTabs .leftTab').hasClass('activeTab')) {
          ol.find('.srcli').each(function() {
            if($(this).children('div.activeChapter').length) {
              $(this).children('div.activeChapter').children('span').css('margin-right', 0);
              $(this).find('li').css('margin-right', 0);
            }
            else {
              $(this).css('margin-right', 0);
            }
          });
        }
        else {
          ol.find('li').css('margin-right', 0);
        }
      }
    }
    else {
      ol.attr('data-osbp', 'n');
      if(SDU.isIE7()) {
//              ol.find('li').not('.outlineFocus').css('margin-right', 0);
      }
      else {
//        ol.find('li').not('.outlineFocus').css('margin-right', 0);
      }
      ol.find('li.outlineFocus').parent().css('background', '#ffffff');
    }
    ol.css('background', '#ffffff');
    ol.children('ul').css('background', '#ffffff');
    ol.addClass('active');
        
    $('#articleLeftAd').css('background', '#ffffff');
    if( $("#articleLeftAd iframe").length > 0 ){
      $('#articleLeftAd iframe')[0].contentWindow.document.body.style.background = "#ffffff";
      $('#articleLeftAd iframe').css('background', '#ffffff');
    }
  },
  hoverOverOff: function() {
    this.onHover = false;
    var ol = $('#outline');
    ol.doTheScrollJitter()
    var ulWidthBefore = $('#outline ul').width();

    var st = ol.scrollTop();
    ol.attr('data-st', st);
    ol.css('overflow-y', 'hidden');
    ol.css('overflow-x', 'hidden');
    var ulWidthAfter = $('#outline ul').width();

    if(SDU.isIE7()) {
      if(ulWidthAfter < ulWidthBefore) {}
      else {
        if($('#lpTabs .leftTab').hasClass('activeTab')) {
          $('#outline ul li').css('margin-right', $.scrollBarWidth());
//          ol.find('li.srcli').css('margin-right', $.scrollBarWidth());
        }
        else {
          $('#outline ul li').css('margin-right', $.scrollBarWidth());
        }
      }
    }
    else {
      if(ulWidthAfter < ulWidthBefore) {
        $('#outline ul li').css('margin-right', $.scrollBarWidth());
        ol.find('li.srcli').css('margin-right', $.scrollBarWidth());
      }
      else {
        ol.find('li').each(function() {
            if($(this).children('div.activeChapter').length) {
              $(this).children('div.activeChapter').children('span').css('margin-right', $.scrollBarWidth());
              $(this).find('li').css('margin-right', 0);
            }
            else {
              $(this).css('margin-right', $.scrollBarWidth());
            }
        });
      }
    }
    ol.find('li.outlineFocus').parent().css('background', '#ecf2f6');
    ol.css('background', '#ecf2f6');
    ol.children('ul').css('background', '#ecf2f6');

    ol.removeClass('active');
    //This must be at end or FF will reset the scroll
    ol.scrollTop(st);
        
    $('#articleLeftAd').css('background', '#ecf2f6');
    if( $("#articleLeftAd iframe").length > 0 ) {
      $('#articleLeftAd iframe')[0].contentWindow.document.body.style.background = "#ecf2f6";
      $('#articleLeftAd iframe').css('background', '#ecf2f6');
    }      
  }
} //Outline



var DBG = {
  out: function(lvl, str) {
    if(SDM.debugFlag=="undefined") {return;}
    if(SDM.debugFlag >= lvl || lvl==0) {
      if(typeof console=== "undefined" || typeof console.log==="undefined") {
        if(!$('#sdConsole').length) {
          $('body').append('<textarea id="sdConsole" class="ui-widget-content" cols="60"></textarea>');
          $('#sdConsole').resizable();
        }
        $('#sdConsole').append(str + "<br>");
      }
      else{console.log(str) }
    }
  }
} //DBG

$(document).ready(function() {
    if (SDM.pru!='') {
      SD_UTIL.sendPageLoadStats();
    } 
});
var SD_UTIL = {
  killEvent:function(e){
    if(!e) return;
    e.preventDefault()
    e.stopPropagation();
  },
  sendUserKeyEvent: function(a, o, z, ocf) {
    $.get(SDM.userActionURL+'/'+o+'/'+z+'/'+ocf+'/'+a);
  },
  sendDownloadKeyEvent: function(o, z, ocf, f) {
    $.get(SDM.ep.downloadActionURL+'/'+o+'/'+z+'/'+ocf+'/'+f);
  },
  loadLib: function(urlStr) {
    var headID = document.getElementsByTagName('head')[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = urlStr;
    headID.appendChild(newScript);
  },
  isPerfTimingAvail:function() {
    return !(typeof window.performance==="undefined" || typeof window.performance.timing==="undefined")
  },
  isSendStatsReady:function() {
    if(SD_UTIL.isPerfTimingAvail()) {
      if(window.performance.timing.domComplete&&window.performance.timing.loadEventStart&&window.performance.timing.loadEventEnd) return true;
      else return false;
    }
    return true;
  },
  sendStats:function(){
    if(SD_UTIL.isSendStatsReady()) {}
    else {setTimeout(SD_UTIL.sendStats, 250);return;}
    var params = '';
    if(SD_UTIL.isPerfTimingAvail()) {
      for(var k in window.performance.timing) {
        prs.rt(("wpt_"+k), window.performance.timing[k]);
      }
    }
    var prs2 = _.sortBy(prs, function(val) {
      return val.toString().match(/([A-Za-z_]+:[A-Za-z0-9_]+)/g)[1].split(':')[1]*1.0;
    });
    for( var i = 0;i < prs2.length;i++){
      params += "data=" + prs2[i].toString() + "&";
    }
    params += "key=" + SDM.pageTransKey + "&";
    params += "pagetype=" + SDM.pageType;
//    $.post(SDM.urlPrefix+"/pageReport",params);
  },
  printStats:function() {
    var newprs = _.sortBy(prs, function(val) {
      return val.toString().match(/([A-Za-z_]+:[A-Za-z0-9_]+)/g)[1].split(':')[1];
    });
    for( var i = 0;i < newprs.length;i++){
      var dParts = newprs[i].toString().match(/([A-Za-z_]+:[A-Za-z0-9_]+)/g);
      DBG.out(1, dParts[1].split(':')[1] + ',' + dParts[0].split(':')[1] + ',');
    }
  },
  sendPageLoadStats:function() {
    var params = '';
    if (window.performance && window.performance.timing) {
      if (window.performance.timing.loadEventEnd > 0) {
        params = SD_UTIL.getArtSpdStats();
        for(var k in window.performance.timing) {
          params += "&" + k + "=" + window.performance.timing[k];
        }
        var url = SDM.pru+"/pageReport?"+params;
        $('body').append('<img style="display:none" src="' + url + '">');
      }
      else {
        setTimeout(SD_UTIL.sendPageLoadStats, 100);
      }
    }
    else {
      params = SD_UTIL.getArtSpdStats();
      params += "&loadEventEnd=" + new Date().getTime();
      var url = SDM.pru+"/pageReport?"+params;
      $('body').append('<img style="display:none" src="' + url + '">');
    }
  },
  getArtSpdStats:function(){
      var params,lbl,timer;
      params = "cpc=SD";
      for( var i = 0;i < prs.length;i++){
        lbl=prs[i].toString().match(/([A-Za-z_]+:[A-Za-z0-9_]+)/g)[0].split(':')[1];
        if (lbl.indexOf("wpt_") == -1) {
          timer=prs[i].toString().match(/([A-Za-z_]+:[A-Za-z0-9_]+)/g)[1].split(':')[1];
          params += "&" + lbl + "=" + timer;
        }
      }
      params += "&key=" + encodeURIComponent(SDM.pageTransKey);
      params += "&pagetype=" + SDM.pageType;
      params += "&sds=" + SDM.sds;
      params += "&tid=" + SDM.tid;
      if (document.location.href) {
        params += "&href=" + encodeURIComponent(document.location.href);
      }
      if (document.documentElement.clientWidth &&
          document.documentElement.clientHeight) { 
        params += "&winHeight=" + document.documentElement.clientHeight;
        params += "&winWidth=" + document.documentElement.clientWidth;
      }
      params += "&domCount=" + document.getElementsByTagName("*").length;
      return params;
  },
  getProdColor: function(){
    return (SDM.prodColor==""?"sci_dir":SDM.prodColor);
  },
  getIFrameHeight: function(ifr) {
    var ifrDoc=ifr.contentWindow||ifr.contentDocument||ifr.document;
    if(ifrDoc.document!=undefined) ifrDoc=ifrDoc.document;
    return $(ifrDoc.body).height();
  },
  resizeIFrame: function(iframeBox, iframeHeight) {
    $('#' + iframeBox + ' iframe').height(iframeHeight);
  }
}

// Lazy Loader
$.fn.lazyLoadImages = function(opts) {
  var cfg = {
    imgSel: 'img',
    preLoadLine: 10
  };

  function scrollAction() {
    var bottom = $(window).height() + $('#centerPane').scrollTop();
    $(cfg.imgSel).each(function() {
      if( Math.abs($('#centerPane').scrollTop()+$(window).height() - $(this).position().top+$(this).height()) < 
                                                                     $(window).height() + cfg.preLoadLine
       || Math.abs($('#centerPane').scrollTop() - $(this).position().top)  < $(window).height() + cfg.preLoadLine) {
        var imgObj = $(this);
        if(imgObj.attr('data-loaded')!='true' ) {
          var dataGabssrcAttr = imgObj.attr('data-gabssrc');
          var dataFullsrcAttr = imgObj.attr('data-fullsrc');
          var dataThumbsrcAttr = imgObj.attr('data-thumbsrc');
          var dataInlImgsrcAttr = imgObj.attr('data-inlimgsrc');
          if (dataGabssrcAttr != undefined && dataGabssrcAttr != '') {
            imgObj.attr('src', imgObj.attr('data-gabssrc')).attr('data-loaded', 'true');
          }else if (SDM.fullSize==true && dataFullsrcAttr != undefined && dataFullsrcAttr != '') {
            imgObj.attr('src', imgObj.attr('data-fullsrc')).attr('data-loaded', 'true');
          } else if (dataThumbsrcAttr != undefined && dataThumbsrcAttr != '') {
            imgObj.attr('src', imgObj.attr('data-thumbsrc')).attr('data-loaded', 'true');
          } else if (dataInlImgsrcAttr != undefined && dataInlImgsrcAttr != '') {
            imgObj.attr('src', imgObj.attr('data-inlimgsrc')).attr('data-loaded', 'true');
          }
        }
        $(this).parent().parent().css('height', '').css('width', '');
      }
      else {
//        $(this).addClass('imgLazyFull').parent().parent().position('relative');
      }
    })
  } //scroll

  return this.each(function() {
    if(opts) {
      $.extend(cfg, opts);
    }

    scrollAction(); // run it once for any images that are currently on the screen
    var lazyScroll = _.debounce(scrollAction, 300);
    $(this).scroll( lazyScroll );
  }) //return
};

$.fn.lazyLoadOutlineImages = function(opts) {
  var cfg = {
    imgSel: 'img',
    preLoadLine: 200
  };

  function lazyDisplay() {
    var cnt = 0;
    var myTop = 0;
    var myHeight = 0;
    var myWidth = 0;
    var thumbHeight = 0;
    $(cfg.imgSel).each(function() {
        var outlineTop = Math.abs($('#outline').scrollTop());
        var outlineBottom = Math.abs(outlineTop + $('#outline').height());
        var outlineHeight = $('#outline').height();
        var windowHeight = Math.abs($(window).height());
        if (cnt == 0) {
          myTop = Math.abs($(this).position().top);
        }
        else {
          myTop += (myHeight * 1); // add last height to position
        }
        myHeight = Math.abs($(this).height());
        thumbHeight = $(this).attr('data-thumbheight');
        if (thumbHeight == undefined) {
            thumbHeight = 0;
        }
        if (thumbHeight > 0 && thumbHeight < myHeight) {
            myHeight = thumbHeight;
        }
        myWidth = Math.abs($(this).width());
        var myDims = myTop * 1 + myHeight * 1;

        if( Math.abs(myDims - outlineTop) < Math.abs(outlineBottom + cfg.preLoadLine) 
         || Math.abs(outlineTop - myTop)  < Math.abs(outlineHeight + cfg.preLoadLine)) {
          var imgObj = $(this);
          if(imgObj.attr('data-loaded')!='true' ) {
            imgObj.attr('src', imgObj.attr('data-smlsrc')).attr('data-loaded', 'true');
            imgObj.removeClass("greyImg");
            imgObj.addClass("displayImg");
          } 
          $(this).parent().parent().css('height', '').css('width', '');
        } 
        cnt++;
    })
  } //scroll

  return this.each(function() {
    if(opts) {
      $.extend(cfg, opts);
    }
      
    lazyDisplay(); // run it once to show images that are currently on page
    var lazyScroll = _.debounce(lazyDisplay, 300);
    $(this).scroll( lazyScroll );
  }) //return
};

$.fn.lazyLoad = function( cfg ){
  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
          timeout = null;
          func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };
  var plugin = {
    objs:[],
    buffer: cfg.buffer?cfg.buffer:50, // 50 pixels by default
    batchSize: cfg.batchSize?cfg.batchSize:1, // 1 is the default batch size.
    scrollSrc: cfg.scrollSrc?cfg.scrollSrc:'#centerPane',
    callback: cfg.intoView?cfg.intoView:function(obj,idx){},
    screenTop: $(window).scrollTop(),
    screenHeight:$(window).height(),
    debounce: function(func, wait) {
      return limit(func, wait, true);
    },
    calculateView: function() {
      if( plugin.applyPatch() ) {
        plugin.buffer += 500;
        plugin.screenTop = $( plugin.scrollSrc ).scrollTop() - plugin.buffer;
      }
      else{
        plugin.screenTop = $( plugin.scrollSrc ).scrollTop() - plugin.buffer;
      }
      var screenBot = plugin.screenTop + $(window).height() + plugin.buffer;
      var batch = [];
      var objs = [];
      $.each( plugin.objs, function() {
          var tmpTop= this.top;
          if( plugin.applyPatch() ){
            tmpTop = this.el.offsetTop;
            this.top = tmpTop;
          }
          if( tmpTop > plugin.screenTop && tmpTop < screenBot ) {                        
            batch.push( this );            
            if( plugin.batchSize == 1 ){            
              plugin.callback( batch );
              batch = [];
            }
            else{              
              if( batch.length == plugin.batchSize ){
                plugin.callback( batch );
                batch = [];
              }
            }
          }
          else {
            objs.push( this );
          }          
      });       
      if( batch ){ plugin.callback( batch ); } // run any remainder in batch
      plugin.objs = objs;
    },
    loadAll:function() {
      plugin.callback( plugin.objs );    
    },
    loadOne:function(id){
      if (id > 0){
        plugin.callback( plugin.objs,id); 
      }
    },
    applyPatch:function() {
      return ($.browser.msie && $.browser.version < 9)
    }
  }

  var elements = this;    
  $.each( elements, function() {
      if( plugin.applyPatch() ) {
        var top = this.offsetTop;
        plugin.objs.push({"top":top,"el":this});    
      }
      else{
        plugin.objs.push({"top":$(this).position().top,"el":this});
      }
  });

  var lazyResize = plugin.debounce(plugin.calculateView,300);
  var lazyScroll = plugin.debounce(plugin.calculateView, 300);
    
  $(window).resize( lazyResize );
  $(plugin.scrollSrc).scroll( lazyScroll );
  plugin.calculateView();
  return plugin;
}  
// end of Lazy Loader

//Article Citation
function submitCitation(actionUrl) {
  document.forms["citationInfo"].action = actionUrl; 
  document.forms["citationInfo"].submit(); 
}
//Article Refer to by link
function populateRelLinks() {
  var refLink = doc.getById("refersToAndReferredToBy");
  $.ajax({
      url: SDM.refLinkURL,
      type: 'GET',
      error: function() {refLink.innerHTML = ' ';},
      success: function(res) {
          if(res.replace(" ","")!=""){
            refLink.style.display = 'block';
            refLink.innerHTML = res;
          }
          else {
            $("#refersToAndReferredToBy").remove();
          }
      }
  });
}

function isNotNumber(o) {
  if (o == -1) {
    return true;
  }
  return isNaN (o-0);
}
function getNumber(str) {
  if(!str) {
    return -1;
  }
  var i=0;
  while(i < str.length) {
    var charat = str.charAt(i);
    if(!isNotNumber(charat)) {
      if(charat != "0") {
        return str.substring(i);
      }
    }
    i++;
  }
}
//Reference resolution
var ajaxRefResol;
var ajaxCitedByUpdate;
function updateCitedByCounts(citedByCounts,isHoover,start,count) {
  citedByCounts = citedByCounts.substring(0,citedByCounts.length-1);
  var updateCitedUrl = SDM.ep.updatedCitedBy + citedByCounts;

  ajaxCitedByUpdate = new $.ajax({
       url: updateCitedUrl,
       type: 'GET',
       async : isHoover,
       dataType : 'text',
       error: function() {
          $(".citedBy_").each(function(){
             $(this).html("");
          });
       },
       success: function(res) {
         var citedBy = decodeURIComponent(res);
         if (citedBy != null) {
            this.$citedByDiv = $('<div></div>')
              .hide()
              .append($(citedBy)
           );
           $(".citedBy_").each(function(){
              if(myXabsCounts[this.id]) {
                 if( this.innerHTML.match('Cited By in Scopus') == null) {
                  $(this).html( myXabsCounts[this.id]);
                  $(this).attr ("data-citeres", "Y");
                 }
              } else {
                 $(this).html("");
                 $(this).attr ("data-citeres", "Y");
              }
           });
         }
       }
   }); 
}
String.prototype.substringBetween = function (string1, string2) {
    if ((this.indexOf(string1, 0) == -1) || (this.indexOf(string2, this.indexOf(string1, 0)) == -1)) {
        return (-1);
    } else {
        return this.substring((this.indexOf(string1, 0) + string1.length), (this.indexOf(string2, this.indexOf(string1, 0))));
    }
};

var lazyRefs = null;
function refResolve() {
  lazyRefs = $(".refPlaceHolder").lazyLoad({
      batchSize:50,
      intoView:function(objs,idx){
          if( objs ){
            if( objs[0] ){
              var start = $(objs[0].el).attr("id").substring(8);
              if(!start) {
                start = 1;
              }
              var count = objs.length;
              if (idx) {
                resolveRefs(idx,1);
              }
              else {
                resolveRefs( start, count );
              }
            }
          }
      }
  });
}


function resolveRefs( start, count ){
  var url = SDM.ep.refResolvePath + "&_refRangeStart="+start+"&_refRangeCount="+count;
  var isHoover = true;
  if (count == 1) {
    isHoover = false;
  }
  ajaxRefResol = new $.ajax({
      url: url,
      type: 'GET',
      async : isHoover,
      dataType : 'text',
      error: function() {
        $(".refPlaceHolder").each(function(){
            $(this).html(' <span style="color:red;"> [SD-008]<\/span>');
        });
        return;
      },
      success: function(res) {
        var refMap = decodeURIComponent(res);
        var citedBySCEids = refMap.substringBetween("#","^");
        var tmp = "#"+citedBySCEids+"^";
        refMap = refMap.replace(tmp,"");
        if (refMap != null) {
          this.$OuterDiv = $('<div></div>').hide().append($(refMap));
          $(".refPlaceHolder").each(function(){
              if (myMap[this.id.toLowerCase()]['refHtml'] || myMap[this.id.toLowerCase()]['refHtml'] != "") {
                if(this.innerHTML.match('/science?') == null){
                  $(this).html(myMap[this.id.toLowerCase()]['refHtml'] );
                  $(this).attr ("data-refres", "Y");
                }

                // Add abstarct url to the <li> tag
                if (myMap[this.id.toLowerCase()]['absUrl']) {
                  $(this).attr ("data-absurl", myMap[this.id.toLowerCase()]['absUrl']);
                }
              }
              else {
                $(this).html("");
                $(this).attr ("data-refres", "Y");
              }
          });

          // update Cited by counts
          if(citedBySCEids != null && citedBySCEids != ""){
            updateCitedByCounts(citedBySCEids,isHoover,start,count);
          }
        }
      }
  });     
}
//Reference resolution End
var EbookTOC = {
  eBookTOCTimeout: 1000,
  currentLink: null,
  tocObj: null,

  init: function() {
    var eBookTOCURL = $('div.publicationHead div.title a').attr("href").replace('book', 'toc');
    
    if(SDU.cookieAvail()&&SDU.sessionStorageAvail()) {
      var tocStr = sessionStorage.getItem('bk.toc');
      if(tocStr) {
        EbookTOC.tocObj = $.parseJSON(tocStr);
        if(EbookTOC.tocObj.eBookCID==SDM.pm.cid) {
          DBG.out(1, 'Found bk.toc using...');
        }
        else {
          EbookTOC.tocObj=null;
          sessionStorage.removeItem('bk.toc');
          DBG.out(1, 'Found different bk.toc removing...');
        }
      }
    }
    
    if(EbookTOC.tocObj==null) {
      $.getJSON(eBookTOCURL, function(res) {
        if (res){
          if(SDU.cookieAvail()&&SDU.sessionStorageAvail()&&typeof JSON!='undefined') {
            sessionStorage.setItem('bk.toc', JSON.stringify(res));
            DBG.out(1, 'Storing bk.toc');
          }
        }
        EbookTOC.load(res);
      });
    }
    else {
      EbookTOC.load(EbookTOC.tocObj);
    }
    $('#leftPane #srcOutline li div.so a').ellipsis();
  }, //init

  load:function(res) {
    var $bookToc = EbookTOC.buildToc(res);

    $('#leftPane').prepend('<ul id="lpTabs">'
      + '<li class="leftTab tab" tabindex="0">Book contents</li>'
      + '<li class="rightTab tab" tabindex="0">Chapter contents</li>'
      + '</ul>');
    $('#lpTabs .leftTab').click(function() {
        if($('#srcOutline').css('display')!='none') return;
        EbookTOC.showSourceTab(this);
        SD_UTIL.sendUserKeyEvent('sourceTabSelected', 'article', 'leftPane', SDM.keOriginContentFamily);
    });
    $('#lpTabs .rightTab').click(function() {
        if($('#srcOutline').css('display')=='none') return;
        EbookTOC.showItemTab(this);
        SD_UTIL.sendUserKeyEvent('itemTabSelected', 'article', 'leftPane', SDM.keOriginContentFamily);
    });
    $('#outline').prepend($bookToc);
    $('#outline, #leftPane, #leftPaneInner').addClass('book');

    //Initially set all parent nodes to collapsed.
    EbookTOC.showPath2Item(SDM.pm.pii);
    $('.activeChapter >a').attr('href', "");

    if(SDM.outlineTab=='S') {
      EbookTOC.showSourceTab($('#lpTabs .leftTab')[0]);
    }
    else {
      EbookTOC.showItemTab($('#lpTabs .rightTab')[0]);
    }
  }, //load
  showSourceTab:function(e) {
    $(e).parent().children('.tab').removeClass('activeTab');
    $(e).addClass('activeTab');
    $('.outlineMsg').hide();
    $('#srcOutline').show();
    $('.activeChapter').parent().append($('#itemOutline')[0]);
    $('#searchWithin').show();
    $('#olGraphCbBox').hide();
    Outline.toggleGraphics('hide');
  },
  showItemTab:function(e) {
    $(e).parent().children('.tab').removeClass('activeTab');
    $(e).addClass('activeTab');
    $('#outline').removeClass('bookError').prepend($('#itemOutline')[0]);
    $('#searchWithin .errorMsg').remove();
    $('.outlineMsg').show();
    $('#srcOutline').hide();
    $('#searchWithin').hide();
    $('#olGraphCbBox').show();
    if($('#outlineGraphicsCheckBox').prop('checked')==true) {
     Outline.toggleGraphics('show');
    }
  },
  buildToc:function(res) {
    $('body').append('<ul id="srcOutline"></ul>');
    for(var i in res.eBookTOC) {
      $('#srcOutline').append(EbookTOC.buildTocNode(res.eBookTOC[i], 1));
    }
    return $('#srcOutline');
  },
  buildTocNode:function(nr, lvl) {
    var classStr = "so item " + nr.NodeType;
    var spClass = 'srcPartClosed';
    if(nr.NodeList) classStr += " parent ";
    if(nr.PII==SDM.pii) {
      classStr += ' activeChapter ';
      spClass = 'srcPartOpened';
    }
    if(lvl>3) {
      lvl=3;
    }
    
    var $node;
    if(nr.PII) {
      $node = $('<li data-pii="' + nr.PII + '" class="srcli lvl' + lvl + '"></li>');
      if(nr.PII==SDM.pii) {
        $node.append('<div class="' + classStr + '"><div class="' + 'srcPartStatic' + '"></div><span title="' + nr.Title + '">' + nr.Title + '</span></div>');
      }
      else {
        $node.append('<div class="' + classStr + '"><div class="' + 'srcPartStatic' + '"></div><a class="cLink" querystr="?&zone=leftPane&_origin=article&originContentFamily=nonserial" href="/science/article/pii/' + nr.PII + '" title="' + nr.Title + '">' + nr.Title + '</a></div>');
      }
    }
    else if(nr.NodeList && nr.NodeList.length) {
      $node = $('<li data-pii="" class="srcli lvl' + lvl + '"></li>');
      $node.append('<div class="' + classStr + '"><div class="srcPartClosed"></div><a href="" ' + '" title="' + nr.Title + '" onclick="EbookTOC.nodeClick(this);return false;">' + nr.Title + '</a></div>');
      var $ul = $('<ul></ul>');
      for(var i in nr.NodeList) {
        $ul.append(EbookTOC.buildTocNode(nr.NodeList[i], lvl+1));
      }
      $node.append($ul);
      $ul.hide();
    }
    return $node;    
  },
  nodeClick:function(e) {
    if($(e).parent().parent().children('ul').css('display')=='none') {
      $(e).parent().parent().children('ul').show();
      $(e).parent().children('div').addClass('srcPartOpened').removeClass('srcPartClosed');
    }
    else {
      $(e).parent().parent().children('ul').hide();
      $(e).parent().children('div').removeClass('srcPartOpened').addClass('srcPartClosed');
    }
  },
  showPath2Item:function(pii) {
    $('#srcOutline li').each(function() {
      if($(this).attr('data-pii')==pii) {
        $(this).children('div').removeClass('so').addClass('socip');
        $(this).parentsUntil('#srcOutline').filter('li').each(function() {
            $(this).removeClass('srcli');
            EbookTOC.nodeClick($(this).children('div').children('a')[0]);
            $(this).children('div').removeClass('so').addClass('socip');
        });
      }
    });
  },
  getPath2Item:function(pii) {
    var rslt;
    $('#srcOutline li').each(function() {
      if($(this).attr('data-pii')==pii) {
        rslt = $(this).parentsUntil('#srcOutline').children('div');
      }
    });
    return rslt;
  }
} //EbookTOC

//Nonserial Index and glossary ajax call
var loadsection;
function loadSection(baseUrl,section) {
  var endPoint = baseUrl+section;
  var div1 = doc.getById("indexSection");
  loadsection = new $.ajax( {
      url: endPoint,
      type: 'GET',
      error: function() {     
        div1.innerHTML = '';
      },
      success: function(res) {
        div1.innerHTML = res;        
        if($('#'+section).position()!=null) {
          $('#centerPane').moveTo(section);
        }
        var secTitle=$('#sectitle');    
        $('#ol_sectitle').html("<a onclick=\"return $('#centerPane').moveTo('sectitle')\"  href='"+secTitle.attr('id')+"'>"+secTitle.html()+"<br></a>");
      }
  });
}

//TOOL BAR
var AutoCompleFlag =false;
var IE7HeightFixGlobalVar;
var ArticleToolbar = {
  DEFAULT_QS_TEXT: "Search ScienceDirect",
  init:function() {
    $("#quickSearch").css("color", "#9b9b9b");
    $("#articleToolbar .sdSearch input").val("Search ScienceDirect");
    $("#quickSearchButton").click( ArticleToolbar.toggleQuickSearch );
    //the below code for ie7
    if( $("#sdQuickSearch").is(":visible") ){
      $("#centerPane").bind('click',ArticleToolbar.toggleQuickSearch);
    }
    $("#moreOptionsButton").click( ArticleToolbar.toggleOptions );
    $('#quickSearch').bind('keypress',ArticleToolbar.qssmall_frmsubmit);
    $('#articleToolbar .sdSearch button.submit').bind('click',ArticleToolbar.qSearchbut);
    $('#articleToolbar .sdSearch input').bind('focusin',ArticleToolbar.showTextQSonFocus);
    $('#articleToolbar .sdSearch input').bind('focusout',ArticleToolbar.showTextQSoutFocus);

    //make sure the icons for toolbar are clickable too         
    $('.icon_pdf div').click(function(){ $('.icon_pdf a').click();  })
    $('.icon_orderdoc'+SD_UTIL.getProdColor()+' div').click(function(){ 
        document.location = $(".icon_orderdoc"+SD_UTIL.getProdColor()+" a").attr("href");  });
    $('.icon_exportarticle'+SD_UTIL.getProdColor()+' div').click(function(){ 
        document.location = $(".icon_exportarticle"+SD_UTIL.getProdColor()+" a").attr("href"); })
    $('.email'+SD_UTIL.getProdColor()+' div').click(function(){
        document.location = $(".email"+SD_UTIL.getProdColor()+" a").attr("href"); });
    $('.alert'+SD_UTIL.getProdColor()+' div').click(function(){
        document.location = $(".alert"+SD_UTIL.getProdColor()+" a").attr("href"); });
    $('.thumbnail'+SD_UTIL.getProdColor()+' div').click(function(){
        document.location = $(".thumbnail"+SD_UTIL.getProdColor()+" a").attr("href"); });
    $('.fullsize'+SD_UTIL.getProdColor()+' div').click(function(){
        $(".fullsize"+SD_UTIL.getProdColor()+" a").click(); });
  },
  toggleQuickSearch:function(e){
    AutoCompleFlag =false;
    if( $("#sdQuickSearch").is(":visible") ){
      $("#quickSearchButton").attr("title", "Show more quick search options");
      $("#quickSearchButton div").removeClass("up_" + SD_UTIL.getProdColor() );
    }else{
      $("#quickSearchButton").attr("title", "Show less quick search options");
      $("#quickSearchButton div").addClass("up_" + SD_UTIL.getProdColor() );
    }

    $("#sdQuickSearch").toggle('blind',function(){
        if( $("#sdQuickSearch").is(":visible") ){
          ArticleToolbar.disableQS();
        }
        else{
          ArticleToolbar.enableQS(); 
        }                
    });

    $('body').bind('click',ArticleToolbar.closeQS);
    $('#centerPane').bind('scroll',ArticleToolbar.closeQS);
    ArticleToolbar.closeOptions();        
    SD_UTIL.killEvent( e );        
  },
  toggleOptions:function(e){
    AutoCompleFlag =true;
    if( $("#moreOptionsMenu").is(":visible") ){
      ArticleToolbar.closeOptions();
    }
    else{
      $("#moreOptionsButton div").addClass("up_" + SD_UTIL.getProdColor() );
      if(SDU.isIE7() || SDM.adReqOptions==false) {
        $("#moreOptionsMenu").show('blind');
      }
      else {
        $("#moreOptionsMenu").show();
      }
      $('body').bind('click',ArticleToolbar.closeOptions);
      $('#centerPane').bind('scroll',ArticleToolbar.closeOptions);  
    }
    ArticleToolbar.closeQS();
    SD_UTIL.killEvent( e );
  },
  closeOptions:function(){
    $("#moreOptionsButton div").removeClass( "up_" + SD_UTIL.getProdColor() );
    if( $("#moreOptionsMenu").is(":visible") ){
      if(SDU.isIE7() || SDM.adReqOptions==false) {
        $("#moreOptionsMenu").hide('blind');
      }
      else {
        $("#moreOptionsMenu").hide();
      }
    }
    $('body').unbind('click',ArticleToolbar.closeOptions );
    $('#centerPane').unbind('scroll',ArticleToolbar.closeOptions );                
  },
  userIsUsingSearchForm:function(e) {
    var IE7HeightFixLocalVar = $("#page-area").height();
    if(IE7HeightFixLocalVar>0) {
      IE7HeightFixGlobalVar=IE7HeightFixLocalVar;
    }
    if(AutoCompleFlag!=true) {
      if($(e.target).attr("class")!="ui-corner-all") {
        return  e &&  ($( e.target ).parents( "div" ).hasClass("extSearch") ||
                       $( e.target ).parents( "div" ).hasClass("quickSearch") );
      }
      else{
        $("#page-area").height(IE7HeightFixGlobalVar+"px");
        return true;
      }
    }
    else{
      return  e && ($( e.target ).parents( "div" ).hasClass("extSearch") ||
                    $( e.target ).parents( "div" ).hasClass("quickSearch") );
    }
  },
  closeQS:function(e) {
    if( $("#sdQuickSearch").is(":visible") ) {
        $("#quickSearchButton").attr("title", "Show more quick search options");
    }
    if( ArticleToolbar.userIsUsingSearchForm( e )) { return; }
    ArticleToolbar.enableQS();
    $("#quickSearchButton div").removeClass( "up_" + SD_UTIL.getProdColor() );
    if( $("#sdQuickSearch").is(":visible") ){
        $("#sdQuickSearch").toggle('blind');
    }
    $('body').unbind('click',ArticleToolbar.closeQS );
    $('#centerPane').unbind('scroll',ArticleToolbar.closeQS );
  },
  disableQS:function(){
    $(".sdSearch input").prop("disabled","disabled");
    $(".sdSearch input").css("background","#CCCCCC");
    $(".sdSearch button").prop("disabled","disabled");        
    $(".sdSearch input").css("color","#9b9b9b");     
    if( ArticleToolbar.containsUserQuery() ){
      $("#qs_all").val($(".sdSearch input").val());
    }
  },
  enableQS:function(){
    $(".sdSearch input").prop("disabled","");
    $(".sdSearch input").css("background","white");
    if($("#qs_all").val() == "" || $("#qs_all").val() == "Search figures & videos"){
      $(".sdSearch input").css("color","#9b9b9b");
    }
    else{
      if ($("#Articles").prop("checked") == true){
        $(".sdSearch input").css("color","#000000");
      }
    }

    $(".sdSearch button").prop("disabled","");
    if ($("#Images").prop("checked") == false){ 
      $(".sdSearch input").val( $("#qs_all").val());
    }
    else if( $("#qs_all").val()!='' && $("#qs_all").val() != ArticleToolbar.DEFAULT_QS_TEXT ) {
      $(".sdSearch input").val( $("#qs_all").val() );
    }
    else if( $("#qs_all").val()=='' ){
      $(".sdSearch input").val(ArticleToolbar.DEFAULT_QS_TEXT);
    }
    $("#Articles").prop("checked", true);

    $(".toggleQukSrch").css('display', '');
    $("#fieldLabel").html("&nbsp;&nbsp;&nbsp;&nbsp;All Fields");
    $("#qs_all").attr("title","For Example. Heart Attack and Behaviour");
    if ($("#qs_all").val() == "Search figures & videos") {
        $("#qs_all").val('');
        $("#qs_all").css('color','#000000');
    }
    $("#volField, #qs_vol , #issueField , #qs_issue , #pageField , #qs_pages").css('display','');
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      $("#submit_search").css('margin-left','14px');
    }

    $("#sdQuickSearch input.textbox").val("");
    ArticleToolbar.resetOnEmptyQS();
  },
  resetOnEmptyQS:function(){
    if ( $(".sdSearch input").val()=="" ){
         $(".sdSearch input").val(ArticleToolbar.DEFAULT_QS_TEXT);
    }
  },
  containsUserQuery:function(){
    return $(".sdSearch input").val() != ArticleToolbar.DEFAULT_QS_TEXT;
  },
  qSrchButton:function(){
    doc.getById("qs_all").value=doc.getById("quickSearch").value;
    document.forms["qkSrch"].submit();
    return false;
  },
  qssmall_frmsubmit:function(e){
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { 
      if($(".sdSearch input").val() == ArticleToolbar.DEFAULT_QS_TEXT){
        $(".sdSearch input").val("");
        ArticleToolbar.qSrchButton();
      }
      else{
        ArticleToolbar.qSrchButton();
      }
    }
  },
  qSearchbut:function(){
    if($(".sdSearch input").val() == ArticleToolbar.DEFAULT_QS_TEXT){
       $(".sdSearch input").val("");
      ArticleToolbar.qSrchButton();
    }
    else{
      ArticleToolbar.qSrchButton();
    }
  },
  artInternalLnkPos:function(){
    if($('#_loggedusr').val() == 'loggedusr') {
      $('#articleToolbar').css('height',52);
    }
    else {
      $('#articleToolbar').css('height',26);
    }
  },

  showTextQSonFocus:function(){
    if($("#quickSearch").val() == ArticleToolbar.DEFAULT_QS_TEXT){
      $("#quickSearch").val("");
      $("#quickSearch").css("color", "#000000");
      return false;
    }
    else{
      $("#quickSearch").css("color", "#000000");
    }
  },
  showTextQSoutFocus:function(){
    if($("#quickSearch").val() == ""){
      $("#quickSearch").val( ArticleToolbar.DEFAULT_QS_TEXT );
      $("#quickSearch").css("color", "#9b9b9b");
      return false;
    }
  }
};

var blocks = {
  articleOptions: false,
  quickSearch: false
};

function publicationLink(url, showId, hideId, rsltIndId) {
  $.get(url, function(data) {
      if(data.match(/TRUE/g)) {
        $('#'+hideId).css('display', 'none');
        $('#'+showId).css('display', 'inline');
        $('#'+rsltIndId).css('display', 'none');
      }
      else {
        $('#'+rsltIndId).css('display', 'inline');
      }
  });
}
//TOOL BAR END

function openNS(url, width, height) {
  if ((navigator.appName == "Microsoft Internet Explorer") && (parseFloat(navigator.appVersion) < 4 )) {
    return false;
  }

  if (!width) var width = 600;
  if (!height) var height = 400;
  var newX=width,newY=height,xOffset=10,yOffset=10;
  var parms = 'width=' + newX + ',height=' + newY +
    ',screenX='+ xOffset + ',screenY=' + yOffset +
    ',status=yes,toolbar=yes,menubar=yes' +
    ',scrollbars=yes,resizable=yes,location=yes';
  nsWin = window.open(url,'displayWindow',parms);
  nsWin.focus();
  return false;
}

var figCaption;
function openStrippedNS(url, figElem, figRefElem, pii) {
  if ((navigator.appName == "Microsoft Internet Explorer") &&(parseFloat(navigator.appVersion) < 4 )) {
    return false;
  }
  var capId = figElem.replace('labelCaption','');
  var ih = doc.getById(figElem);
  var cRef = doc.getById(capId+'b'+figRefElem);
  var newRef = doc.getById('anc'+capId+'b'+figRefElem);

  var xOffset=25,yOffset=25;
  var parms = 'left='+ xOffset + ',top=' + yOffset +',status=yes,toolbar=no,menubar=no' + ',scrollbars=yes,resizable=yes,location=no';
  if(ih != null ) {
    if(cRef != null) {
      figCaption = ih.innerHTML.replace(cRef.innerHTML,'<a href='+'/science/article/pii/'+pii+'#'+figRefElem+'>'+newRef.innerHTML+'</a>');
    }
    else {
      figCaption = ih.innerHTML;
    }
  }
  else {
    figCaption = "";
  } 
  nsWin = window.open(url,'displayWindow',parms);
  nsWin.focus();
  return false;
}

var LoginBox = {
  getStyleObj: function(elem,parent) {
    if (document.layers) {
      if (parent) {return "document."+parent+".document."+elem;}
      else { return "document."+elem + ".style";}
    }
    else if (document.all) {return "document.all."+elem + ".style";}
    else if (document.getElementById) {return "doc.getById('"+elem+"').style";}
  },
  flipLogin: function (e,button){
    var t = eval(LoginBox.getStyleObj(e));
    var u = doc.getById("loginPlus");
    var v = doc.getById("userPlus");
    var userbox = doc.getById("userBox");
    var j = doc.getById("loginPlusScript");
    if(button == null){
      if (t.display=="none"){
        t.display = 'block';
        j.className = 'minus';
      }
      else{
        t.display = 'none';
        j.className = 'plus';
      }
    }
    else if (button == "userPlus" ) {
      if (t.display=="none" ){
        t.display = 'block';
        v.className = 'userMinus';
      }
      else{
        t.display = 'none';
        v.className = 'userPlus';
      }
    }
    else{
      if (t.display=="none" ){
        t.display = 'block';
        userbox.style.display ='none';
        v.className = 'userPlus';
      }
      else{
        t.display = 'none';
      }
    }
  }
}//LoginBox

/*Existing Quick Search functionality*/
//Auto complete in quicksearch
function sortInit() {
  var navBox = $("#navBox");
//  navBox.children().css("cursor", "move");
  navBox.sortable({ axis: "y",
                    opacity: 0.6
                 });
  navBox.disableSelection();
  navBox.bind("sortstop", function(event,ui) {
    var url = SD_SORTURL + "?" + navBox.sortable("serialize");
    $.get(url);
  });
}
///////////////////////////
var QuickSearch = {
  getElementsByClassName: function(oElm, strTagName, strClassName){
    var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i<arrElements.length; i++){
      oElement = arrElements[i];
      if(oRegExp.test(oElement.className)){
        arrReturnElements.push(oElement);
      }
    }
    return (arrReturnElements);
  }, //getElementsByClassName

  clearQSForm: function() {
    document.qkSrch.qs_tak.value="";
    document.qkSrch.qs_author.value="";
    document.qkSrch.qs_title.value="";
    document.qkSrch.qs_vol.value="";
    document.qkSrch.qs_issue.value="";
    document.qkSrch.qs_pages.value="";
  }, //clearQSForm

  changeFields: function(event) {
    var quckSrch = QuickSearch.getElementsByClassName(document, 'td', 'toggleQukSrch');
    if(event.currentTarget.value == "i") {
      $(".toggleQukSrch").css('display', 'none');
      doc.getById("fieldLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Images";
      doc.getById("qs_all").title = "Search figures & videos";
      if (doc.getById("qs_all").value == "") {
        doc.getById("qs_all").value = "Search figures & videos";
        doc.getById("qs_all").style.color ="#9b9b9b";
      }
      doc.getById("volField").style.display = "none";
      doc.getById("qs_vol").style.display = "none";
      doc.getById("issueField").style.display = "none";
      doc.getById("qs_issue").style.display = "none";
      doc.getById("pageField").style.display = "none";
      doc.getById("qs_pages").style.display = "none";
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
        doc.getById("submit_search").style.marginLeft = "7px";
      }
    }
    else {
      $(".toggleQukSrch").css('display', '');
      doc.getById("fieldLabel").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;All Fields";
      doc.getById("qs_all").title = "For Example. Heart Attack and Behaviour";
      if (doc.getById("qs_all").value == "Search figures & videos") {
        doc.getById("qs_all").value = ""; 
        doc.getById("qs_all").style.color ="#000000";
      }
      doc.getById("volField").style.display = "";
      doc.getById("qs_vol").style.display = "";
      doc.getById("issueField").style.display = "";
      doc.getById("qs_issue").style.display = "";
      doc.getById("pageField").style.display = "";
      doc.getById("qs_pages").style.display = "";
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
        doc.getById("submit_search").style.marginLeft = "14px";
      }
    }
  }, //changeFields
  clearValues: function() {
    if(doc.getById("Images").checked ==  true) {
      if(doc.getById("qs_all").value == "Search figures & videos") {
        doc.getById("qs_all").value = "";
        doc.getById("qs_all").style.color ="#000000";
      }
    }
  }, //clearValues
  setValues: function() {
    if (doc.getById("Images").checked ==  true) { 
      if (doc.getById("qs_all").value == "") {
        doc.getById("qs_all").value = "Search figures & videos";
        doc.getById("qs_all").style.color ="#9b9b9b";
      }
    }
  } //setValues
}; //QuickSearch



function autoCompleteInit() {
  $(document).ready(function() {sdAutoComplete('qs_title','qsPub_autoComp', SDM.urlPrefix + '/jfind/auto');});
}

function sdAutoComplete(inputField, outputField, serviceURL) {
  $(".qsRadio").click(QuickSearch.changeFields);
  $(".qsImgBlurFocus").blur(QuickSearch.setValues);
  $(".qsImgBlurFocus").focus(QuickSearch.clearValues);
  $( "#" + inputField ).autocomplete(
    { 
      minLength:2,
      source: function(req,resp) {
        $.post(serviceURL,{ qs_title:req.term }, function(data){
          var list = []
          $(data).find("li").each(function(i,e){ list.push({ label:$(e).text() });});
          resp( list );
        })
      },
      open: function(event, ui) { $("ul.ui-autocomplete").css("z-index", 1999); $("ul.ui-autocomplete").addClass("suggdropdown"); }
    });
}
              
function ccAutoComplete(inputField, outputField, validCostCodes) {
  $("#"+inputField).autocomplete({
    minLength:2,
    source:validCostCodes
  });
  //var costcode_list = new Autocompleter.Local(inputField,outputField,validCostCodes,{ minChars:2, partialSearch:false }) 
}
autoCompleteInit();

var CanonicalLink = {
  init: function() {
    $("body").delegate(".cLink", "click", function(event) {
      var t = $(this);
      createStateCookie(t.attr("queryStr"), event);
    });
  }
}

var CanonicalHomeLink = {
  init: function() {
    $("body").delegate(".canonHomeLink", "click", function(event) {
        var t = $(this);
        createCookieForHomePage(t,event);
    });
  }
}

function createCookieForHomePage (hc, e) {
  var cv = '';
  cv=cv.addTag(hc.attr("method"), 'md')
    .addTag(hc.attr("zone"), 'z')
    .addTag(hc.attr("btn"), 'btn')
    .addTag(hc.attr("origin"), 'org')
    .addTag(hc.attr("more"), 'me')
    .addTag(hc.attr("actionType"), 'at')
    .addTag(hc.attr("boxAction"), 'bt')
    .addTag(hc.attr("box"), 'bx')
    .addTag(hc.attr("record"), 'rd')
    .addTag(hc.attr("fl"), 'fl')
    .addTag(hc.attr("prompt"), 'pt')
    .addTag(hc.attr("lg"), 'lg');
  createCookie("SD_HOME_PAGE_COOKIE", cv)
}

String.prototype.getParameter = function(inName)
{
   var outParm = "";
   var queryIndex = this.indexOf("?");
   var parmIndex = this.indexOf(inName, queryIndex+1);
   if (parmIndex > 0)
   {
      parmIndex += inName.length;
      while ((parmIndex >= 0) && ('=' != this.charAt(parmIndex)))
      {
         parmIndex = this.indexOf(inName, parmIndex+1);
         if (parmIndex > 0)
         {
            parmIndex += inName.length;
         }
      }
      if ('=' == this.charAt(parmIndex))
      {
         parmIndex++;
         var endIndex = parmIndex;
         while (   (endIndex < this.length)
                && ('&' != this.charAt(endIndex))
                && ('#' != this.charAt(endIndex)))
         {
            endIndex++;
         }
         if (endIndex > parmIndex)
         {
            outParm = this.substring(parmIndex,endIndex);
         }
      }
   }
   return outParm;
}

String.prototype.addTag = function (tagVal, tag) {
  if(tagVal) {
    return this.concat("<"+tag+">"+tagVal+"</"+tag+">");
  }
  else {
    return this;  
  }
};

function createStateCookie (qs, e) {
  var zone='';
  zone = qs.getParameter("_zone");
  if(!zone) {
    zone = qs.getParameter("zone");
  } 
  var cv = '';
  if (qs) {
    cv=cv.addTag(qs.getParameter("_alid"), 'al')
    .addTag(qs.getParameter("_rdoc"), 'rd')
    .addTag(qs.getParameter("_fmt"), 'fmt')
    .addTag(qs.getParameter("_origin"), 'org')
    .addTag(qs.getParameter("_srch"), 'src')
    .addTag(qs.getParameter("_ct"), 'cnt')
    .addTag(zone, 'z')
    .addTag(qs.getParameter("_docanchor"), 'av')
    .addTag(qs.getParameter("_alertKey"), 'ak')
    .addTag(qs.getParameter("_wid"), 'wid')
    .addTag(qs.getParameter("_errMsg"), 'err')
    .addTag(qs.getParameter("_reqId"), 'req')
    .addTag(qs.getParameter("_xRefDocId"), 'cid')
    .addTag(qs.getParameter("_origPii"), 'opi')
    .addTag(qs.getParameter("artImgPref"), 'rt')
    .addTag(qs.getParameter("_cid"), 'rwi')
    .addTag(qs.getParameter("_hierId"), 'rhi')
    .addTag(qs.getParameter("_explode"), 'exp')
    .addTag(qs.getParameter("_idxType"), 'ind')
    .addTag(qs.getParameter("_refLink"), 'rfl')
    .addTag(qs.getParameter("_alpha"), 'alp')
    .addTag(getDateTime(), 'rdt')
    .addTag(qs.getParameter("overrideIP"), 'oip')
    .addTag(qs.getParameter("nextPrevTag"), 'np')
    .addTag(qs.getParameter("originContentFamily"), 'oct')
    .addTag(qs.getParameter("panel"), 'p');
  }
  createCookie ("SD_ART_LINK_STATE", cv);
}

  
function createCookie(cookieName, value) {
  var cookieStart = "<e><q>science</q>";
  var cookieEnd = "</e>";
  var cookieValue;
  if (value) {
    cookieValue = cookieStart;
    cookieValue += value;
    cookieValue += cookieEnd;
  }
  var hostName = document.location.hostname;
  hostName.toLowerCase();
  var domain = '';
  if (hostName.indexOf ('sciencedirect.com') != -1) {
    domain = '.sciencedirect.com';
  }
  else if (hostName.indexOf('.lexisnexis.com') != -1) {
    domain = '.lexisnexis.com';
  }
  var finalCookie= cookieName+"="+cookieValue+";path=/";
  if (domain) {
    finalCookie += ";domain=" + domain;
  }
  document.cookie = finalCookie; 
}

function getDateTime() {
  var ct=new Date();
  return ct.getFullYear()+"/"+ct.getMonth()+"/"+ct.getDate()+"/"+ct.getHours()+":"+ct.getMinutes()+":"+ct.getSeconds();
}

// PDFCITE Begin
var pdfCite = {
  suggestedArtDisplayed : false,
  pdfWin : "",
  openPDF:function(url, event) {
    var newWidth;
    var newHeight;
    if (document.body.clientWidth) {
      newWidth=((document.body.clientWidth*90)/100);
      newHeight=document.body.clientHeight;
    } else { //makes ie happy
      newWidth=((document.documentElement.clientWidth*90)/100);
      newHeight=document.documentElement.clientHeight;
    }
    pdfWin=window.open(url,'newPdfWin','width='+newWidth+',height='+newHeight+',resizable=yes,left=50,top=50');
    pdfWin.focus();
	pdfCite.popupTabwrap();
  },
  closePopup:function(){
    doc.getById('suggestedPdfList').style.display = 'none';
    doc.getById('pdfModalWindow').style.display = 'none';
	$('#pdfLink').focus();
  },
  popupTabwrap:function(){
      var obj = $('#pdfModalWindowMsgBox');
      obj.find('a:last').keydown(function(e) {                       
        if (e.keyCode == 9 && !e.shiftKey) {                       
          e.preventDefault();                                
          $(obj).find('a:first').focus();               
        }
      })                                      
      obj.find('a:first').keydown(function(e) {                      
        if (e.keyCode == 9 && e.shiftKey) {                        
          e.preventDefault();                                
          $(obj).find('a:last').focus();                
        }
      })
  },
  setOptOutFlag:function(url) {
    try {
      $.post(url);
    }catch(e){}
    pdfCite.closePopup ();
  },
  alignSuggestedArticleBox:function() {
    var x=0, y=1;
    var msgBox = $('#pdfModalWindowMsgBox');
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var top = (winHeight - msgBox[0].offsetHeight)/2;
    var left = (winWidth - msgBox[0].offsetWidth)/2;
    var pos = pdfCite.getScrollXY();
    if (pos) {
      top = top+pos[y];
      left = left+pos[x];
    }
    msgBox.css('top',top + 'px');
    msgBox.css('left',left + 'px');
    $("#modalBoxDisplay").focus();
    pdfWin.focus();
  },
  showDetails:function(pii, absUrl){
    var toHide = "trunc_" + pii;
    var toShow = "citation_" + pii;
    var absId = "abs_" + pii;
    $('li.pdfAbs').hide();
    $('li.citationDetails').hide();
    $('li.wrapperLi').show();
    doc.getById(toHide).style.display = 'none';
    doc.getById(toShow).style.display = 'block';
    // Retrieve Abstract
    var obj = doc.getById(absId);
    if(obj.length < 1) { return; }
    if (obj.innerHTML == "") {
      var ajaxReq = $.get(absUrl, function(response) {
      if (response) {
        obj.style.display = 'block';
        obj.innerHTML=response;
        pdfCite.alignSuggestedArticleBox();
      }
      });
    } else {
      obj.style.display = 'block';
      pdfCite.alignSuggestedArticleBox();
    }
  },
  hideElementsByClassName:function(className, tag)  {
    var all = getElementsByClassName(document, tag, className);
    for(var k=0;k<all.length;k++) {
      all[k].style.display = "none";
    }
  },
  showElementsByClassName:function(className, tag, startIndex)  {
    var all = getElementsByClassName(document, tag, className);
    var idx =0;
    if (startIndex!=null){
      idx = 1;
    }
    for(var k=idx;k<all.length;k++) {
      all[k].style.display = "inline";
    }
  },
  suggestedArt:function(url) {
    var ajaxReq = $.get(url, function(response) {
      response = $.trim(response);
      if (response && response.length > 0) {
        pdfCite.buildSuggestedArticleList(response, "relatedArtList");
        $('#pdfkingTab').addClass('active');
        $('#pdfkingTab').show();
        $('#pdfciteContent').hide();
        $('#pdfciteTab').removeClass('active');
        $('#suggestedPdfList').css('display','block');
        $('#pdfkingContent').show();
        $('#pdfModalWindow').css('display','block');
        $('#pdfModalWindow').css('height', $(window).height()+"px");
        pdfCite.alignSuggestedArticleBox();
		$('#pdfkingArtTitle0').focus();
      }
    });
  },
  citingArt:function(url) {
  var helpURL = SDM.helpUrlDomain+ "/sdhelp_CSH.htm#citing_art_lrn_more.htm";
    if (pdfCite.citedArtDisplayed) { return; }
    var ajaxReq = $.get(url, function(response) {
      pdfCite.citedArtDisplayed = true;
      response = $.trim(response);
      if (response && response.length > 0) {
        pdfCite.buildSuggestedArticleList(response, "citingArtList");
        $('#pdfciteTab').show();
        if (!pdfCite.suggestedArtDisplayed) {
          $('#suggestedPdfList').css('display','block');
          $('#pdfModalWindow').css('display','block');
          $('#pdfModalWindow').css('height', $(window).height()+"px");
          $('#pdfciteContent').show();
          $('#pdfciteTab').addClass('active');
          pdfCite.alignSuggestedArticleBox();
         }
      } else {
        $('#citingArtList').html("<div class='msgBox'>There are no articles that cite the article you downloaded.&nbsp;<a class = 'learn-more' href = '#' onclick='openNS(\""+helpURL+"\");'>Learn more</a></div> ");
        $('#pdfciteTab').show();
       }
    })
    .error(function() {
      $('#citingArtList').html("<div class='msgBox'>There are no articles that cite the article you downloaded.&nbsp;<a class = 'learn-more' href = '#' onclick='openNS(\""+helpURL+"\");'>Learn more</a></div>");
   });
  },
  toggleSuggestedTabs:function(showTab, hideTab, elem) {
    if ((showTab == '#pdfcite') && (pdfCite.citedArtURL != null)) {
      pdfCite.citingArt(pdfCite.citedArtURL);
    }
    $(elem).parent().addClass('active');
    $(showTab+'Content').css('display','block');
    $(hideTab+'Content').css('display','none');
    $(hideTab+'Tab').removeClass('active');
	$(showTab+'ArtTitle0').focus();
  },
  buildSuggestedArticleList:function(jsonStr, jsonObj) {
  var helpURL = SDM.helpUrlDomain+ "/sdhelp_CSH.htm#citing_art_lrn_more.htm";
    var obj = jQuery.parseJSON(jsonStr);
    var enableEntitlement =$('#'+jsonObj).attr('data-entitled');
    if (jsonObj == "citingArtList") {
      if (obj.ERR_TYPE=="0")  {
        $('#citingArtList').html("<div class='msgBox'>There are no articles that cite the article you downloaded.&nbsp;<a class = 'learn-more' href = '#' onclick='openNS(\""+helpURL+"\");'>Learn more</a></div>");
      } else if (obj.ERR_TYPE=="3") {
        $('#citingArtList').html("<div class='msgBox1'><div class='msgBox3'>The citing articles could not be retrieved at this time.</div><div class='msgBox2'>Click the link below to view the citing articles in Scopus.</div></div>");
      }
    }    
    var artList='';
    var htmlStr='';
    var msgHtml='';
    var jsonQStr='';
    var qStr='';
	var articleTitleId ='';
    if (obj != null) {
      if (jsonObj=="relatedArtList" && obj.citation.length) {
        pdfCite.suggestedArtDisplayed = false;
      }
      $.each (obj.citation, function(i, item){
         var noPDF = (obj.NO_PDF_LINK && obj.NO_PDF_LINK=="Y")?"Y":"N";
         var showMoreUrl = SDM.urlPrefix + '/more/' + item.PII + "/" + obj.TYPE;
         artList += '<ol class="artList"><li class="';
         if (enableEntitlement =='Y' && obj.ERR_TYPE!="2") {
           artList +='artTitleSub';
         } else {
           artList +='artTitleNonSub';
         }
         if (jsonObj == "citingArtList") {
           jsonQStr= item.QUERYSTRING;
           qStr = jsonQStr.replace('_fmt=high', '_fmt='+obj.FORMAT_TAG);
		   articleTitleId = "pdfciteArtTitle"+i;;
         } else {
           qStr= item.QUERYSTRING;
		   articleTitleId = "pdfkingArtTitle"+i;
         }
		 
         artList +='"><a id ="' +articleTitleId+ '" class="cLink" target="_blank" querystr="' + qStr +'" href="'
                 + item.ARTURL + '">'
                 + item.ARTTITLE + '</a></li>' 
                 + '<li class="source">' + item.PUBTITLE;
         if(item.VOLISS) { artList +=', ' + item.VOLISS; }
         if(item.PUBDT) { artList +=', ' + item.PUBDT; }
         if(item.PG) { artList +=', ' + item.PG; }
         artList +='</li><li class="authors">'+ item.AUTHORS
                 + '</li>';
         if (item.PII) {     
	     artList +='<li class="showMore"><span class="moreInfo"><a href="#" data-url="'
                 + showMoreUrl +  '" class="toggleMoreInfo"  aria-describedby="' +articleTitleId+ '">Show abstract</a>'
                 + '</span><span class="moreInfo hidden"><a href="#" class="toggleMoreInfo" aria-describedby="' +articleTitleId+ '">'
                 + 'Close abstract</a></span>';
         }
         if (enableEntitlement =='Y' && obj.ERR_TYPE!="2" && noPDF!="Y") {
            var pdfURL = SDM.urlPrefix +item.PDFURL;
	    artList +='<span class="pipe">&nbsp;|&nbsp;</span><span class="pdf">'
                    + '<a aria-describedby="' +articleTitleId+ '" title="Download PDF" href="' 
                    + pdfURL+'" target="_blank">PDF&nbsp;(' 
                    + item.PDFSIZE + ')</a></span>';
         }
         artList +='<ol><li class="abs"></li></ol></li></ol>';
      });
      artList +='<a target="_blank" class = "view-more" href="' + obj.VIEW_MORE_URL + '" >View ';
      if (jsonObj=="relatedArtList") {
         artList +='more related articles';
         artList +='</a>';
      } else {
         if (obj.ERR_TYPE=="2" || obj.ERR_TYPE=="3") {
	    artList +='details of all citing articles in Scopus.</a>';
         } else {
           artList +='more citing articles';
           artList +='</a>';
         }
      }
      
        if (jsonObj=="citingArtList") {
          if (obj.ERR_TYPE=="0")  {
            msgHtml = "<div class='msgBox'>There are no articles that cite the article you downloaded.&nbsp;<a class = 'learn-more' href = '#' onclick='openNS(\""+helpURL+"\");'>Learn more</a></div> ";
          } else if (obj.ERR_TYPE=="3") {
            msgHtml ="<div class='msgBox1'><div class='msgBox3'>The citing articles could not be retrieved at this time.</div><div class='msgBox2'>Click the link below to view the citing articles in Scopus.</div></div>";
          } else {
            msgHtml ="<div class = 'related-articles-msg'><span>These articles cite the article you downloaded.</span><a class = 'learn-more' href = '#' onclick='openNS(\""+helpURL+"\");'>Learn more</a></div>";
          }
	  $('#citingArticlesMsg').html(msgHtml);
        }
        htmlStr = artList;      
        $('#'+jsonObj).html(htmlStr);
      }
      $(".toggleMoreInfo").bind("click", pdfCite.toggleShowAbs);
	  $(document).keyup(function(e){if (e.keyCode == 27) { pdfCite.closePopup(); }});
      if (jsonObj=="relatedArtList") {
        pdfCite.suggestedArtDisplayed = true;
      }
  },
  toggleShowAbs:function(e){
    var obj=$(e.currentTarget);
    var parentObj = $(obj).parents("ol");
    var abs = $(parentObj).find("li.abs");
    var moreInfo = $(parentObj).find("span.moreInfo");
    $('#relatedArtList span.moreInfo, #citingArtList span.moreInfo').each(function(){
        if($(this).hasClass('hidden')){
            $(this).css('display','none');
        }else{
            $(this).css('display','inline-block');
        }
    });
    moreInfo.css('display','inline-block');
    $(obj).parents('span.moreInfo').css('display','none');
    var showMoreUrl = $(obj).attr ("data-url");
      if (showMoreUrl) {    
        $('ol li.abs').hide();      
        $.get(showMoreUrl, function(response) {
            if (response && response.length > 1) {
              $(abs).html("<h2>Abstract</h2>"+response);
              $(abs).show();
            } else {
			  $(abs).html("No abstract is available for this article.");
			  $(abs).show();
			}
        });
      } else { $(abs).hide(); }
      return false;
  },
  getScrollXY:function(){
    var x=0, y=1;
    var pos = new Array(2);
    var scrOfX = 0, scrOfY = 0;
    if( typeof( window.pageYOffset ) == 'number' ) { //Netscape compliant
      scrOfY = window.pageYOffset;
      scrOfX = window.pageXOffset;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
      //DOM compliant
      scrOfY = document.body.scrollTop;
      scrOfX = document.body.scrollLeft;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
      //IE6 standards compliant mode
      scrOfY = document.documentElement.scrollTop;
      scrOfX = document.documentElement.scrollLeft;
    }
    pos[x] = scrOfX;
    pos[y] = scrOfY;
    return pos;
  }   
}
// End of PDFCITE

function flipAlertSettings (id, currObj) {
  var obj = document.getElementById (id);
    if (obj.style.display == 'none') {
      obj.style.display = 'block';
      currObj.className = 'regMinus';
      currObj.innerHTML = "Hide alert & other settings.&nbsp;&nbsp;&nbsp;&nbsp;";
    } else {
      obj.style.display = 'none';
      currObj.className = 'regPlus';
      currObj.innerHTML = "Show alert & other settings.&nbsp;&nbsp;&nbsp;&nbsp;";
    }
}

//ce:e-component
var ECC = {
  selectorDisplayCount:10,
  audioPlayerWidth:318,
  audioPlayerHeight:29,
  videoPlayerWidth:320,
  videoPlayerHeight:266,
  reqFlashVersion:"9.0.0",
  reqMajorVersion:9,
  reqMinorVersion:0,
  videoNoFlashWidth:318,
  videoNoFlashHeight:260,
  audioPlayerURL:"/page/flash/AudioPlayer.swf",
  videoPlayerURL:"/page/flash/VideoPlayer.swf"
};
var EComponent = {
  videos: null,
  others: null,
  audios: null,
  needFlash: false,
  init: function() {
    if($('.MMCvAUDIO').length+
       $('.MMCvOTHER').length+
       $('.MMCvVIDEO').length==0) {
      return;
    }
    
    var fv = swfobject.getFlashPlayerVersion();
    if(ECC.reqMajorVersion==0 || ECC.reqMajorVersion > fv.major || (ECC.reqMajorVersion == fv.major && ECC.reqMinorVersion>fv.minor)) {
      this.needFlash = 'true';
      this.initNoFlash('version_mismatch');
    }
    else {
    this.audios = $('.MMCvAUDIO');
    $('.MMCvAUDIO').each(function() {
      swfobject.embedSWF(
          SDM.urlPrefix+ECC.audioPlayerURL,
          $(this).siblings('div').attr('id'),
          ECC.audioPlayerWidth,
          ECC.audioPlayerHeight,
          ECC.reqFlashVersion,
          false,
          false,  //flashvars
          {menu: "false",
          play: "false",
          bgcolor: "0xFFF",
          allowscriptaccess:"always",
          wmode: "opaque",
          flashvars: $(this).attr('mmcvflashvars')});
    });
    this.others = $('.MMCvOTHER');
    this.videos = $('.MMCvVIDEO');
    $('.MMCvVIDEO').each(function() {
      swfobject.embedSWF(
          SDM.urlPrefix+ECC.videoPlayerURL,
          $(this).siblings('div').attr('id'),
          ECC.videoPlayerWidth,
          ECC.videoPlayerHeight,
          ECC.reqFlashVersion,
          false,
          false, //flashvars
          {menu:"false",
          play: "false",
          bgcolor:"0xFFF",
          allowscriptaccess:"always",
          allowFullScreen:"true",
          wmode:"opaque",
          flashvars:$(this).attr('mmcvflashvars')});
    });
    }
    this.buildMMClabelanchor();
    //if(SDM.suppContentBox==true) this.buildWidget();
  }, // EComponent.init
  buildMMClabelanchor: function(){
      $('dd.ecomponent').each(function(i){
          var thisObj = $(this).parent('dl');
          var downLinkObj = thisObj.find(".MMCvLINK");
          var captionObj = thisObj.find(".MMCvLABEL_SRC a");
          if(downLinkObj && captionObj){
              var downLinkUrl = $(downLinkObj).attr('href');
              $(captionObj).attr('href',downLinkUrl);
          }
      });    
  },
  initNoFlash: function(str){
    //Do something
  }
}

//BEGIN ggcon.js
function google_ad_request_done(google_ads) {
  var s = '';
  var i;
  if (google_ads.length == 0) {return;}

  var feedbackURL = '';
  if(google_info != null && google_info.feedback_url.length > 0) {
    feedbackURL = google_info.feedback_url;
  }
  if (google_ads[0].type == "image") {
    s += '<a href="' + google_ads[0].url +
         '" target="_top" title="go to ' + google_ads[0].visible_url +
         '"><img border="0" src="' + google_ads[0].image_url +
         '"width="' + google_ads[0].image_width +
         '"height="' + google_ads[0].image_height + '"></a>';
  }
  else if (google_ads[0].type == "flash") {
    s += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
         ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"' +
         ' WIDTH="' + google_ad.image_width +
         '" HEIGHT="' + google_ad.image_height + '">' +
         '<PARAM NAME="movie" VALUE="' + google_ad.image_url + '">' +
         '<PARAM NAME="quality" VALUE="high">' +
         '<PARAM NAME="AllowScriptAccess" VALUE="never">' +
         '<EMBED src="' + google_ad.image_url +
         '" WIDTH="' + google_ad.image_width +
         '" HEIGHT="' + google_ad.image_height + 
         '" TYPE="application/x-shockwave-flash"' + 
         ' AllowScriptAccess="never" ' + 
         ' PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED></OBJECT>';
 } else if (google_ads[0].type == "text") {
   if(google_ads.length>1 && google_ads.length<4) {
     s += '<div class="googleAds" style="background-color:#FFFFFF;">';
     s += '<div style="margin-bottom:-2px;_padding-bottom: 2px; width: 100%;border-bottom: 1px solid #CCCCCC; font-family: arial; font-size: 12px;">';
     s += '<div style="padding: 4px; border-bottom: 1px solid #CCCCCC; background-color:#EEEEEE">';
     s += '<img class="closeX" src="/sd/btn_xclose.gif" ';
     s += 'onmouseout="javascript:this.src=\'/sd/btn_xclose.gif\';"';
     s += 'onmouseover="javascript:this.src=\'/sd/btn_xclose_hov.gif\';"';
     s += 'onclick="ArticlePage.hideGGCON();"/>';
        if(feedbackURL.length > 0) {
          s += '<a href="' + feedbackURL + '" target="_blank">Sponsored Links</a>';
        }
        else {
          s += 'Sponsored Links';
        }
        s += '</div>';

        for(i=0; i < google_ads.length; ++i) {
          s += '<div style="margin: 5px;width:30%;float:left;">';
          s += '<a href="' + google_ads[i].url + '" ' +
               'onmouseout="window.status=\'\'" ' +
               'onmouseover="window.status=\'go to ' +
               google_ads[i].visible_url + '\'" ' +
               '>' +
               google_ads[i].line1 + '</a><br>' +
               '<span style="color:#000000">' +
               google_ads[i].line2 + '&nbsp;<br>' +
               google_ads[i].line3 + '<br></span>' +
               '<span style="color:#008000">' +
               google_ads[i].visible_url + '</span><br>';
               s += '</div>';
        }
      }
      else {
        $('#ggcon').css({border:'1px solid #cccccc'});
        s += '<div style="background-color:#FFFFFF; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px">'
        s += '<div style="width: 100%;border: 0px solid #CCCCCC; font-family: arial; font-size: 12px;">';
        s += '<div style="padding: 4px; border-bottom: 1px solid #CCCCCC; background-color:#EEEEEE">';
        if(feedbackURL.length > 0) {
          s += '<a href="' + feedbackURL + '" target="_blank">Sponsored Links</a>';
        }
        else {
          s += 'Sponsored Links';
        }
        s += '</div>';
        if (google_ads.length == 1) {
            /*
             * Partners should adjust text sizes
             * so ads occupy the majority of ad space.
             */
            s += '<div style="margin: 5px">';
            s += '<a href="' + google_ads[0].url + '" ' +
                 'onmouseout="window.status=\'\'" ' +
                 'onmouseover="window.status=\'go to ' +
                 google_ads[0].visible_url + '\'" ' +
                 '>' +
                 google_ads[0].line1 + '</a><br>' +
                 '<span style="color:#000000">' +
                 google_ads[0].line2 + '&nbsp;' +
                 google_ads[0].line3 + '<br></span>' +
                 '<span style="color:#008000">' +
                 google_ads[0].visible_url + '</span><br>';
            s += '</div>';
        } else if (google_ads.length > 1) {
            /*
             * For text ads, append each ad to the string.
             */
            for(i=0; i < google_ads.length; ++i) {
                s += '<div style="margin: 5px">';
                s += '<a href="' + google_ads[i].url + '" ' +
                     'onmouseout="window.status=\'\'" ' +
                     'onmouseover="window.status=\'go to ' +
                     google_ads[i].visible_url + '\'" ' +
                     '>' +
                     google_ads[i].line1 + '</a><br>' +
                     '<span style="color:#000000">' +
                     google_ads[i].line2 + '&nbsp;' +
                     google_ads[i].line3 + '<br></span>' +
                     '<span style="color:#008000">' +
                     google_ads[i].visible_url + '</span><br>';
                     s += '</div>';
            }
        }
        s += '</div></div>';
      }
    }
    googleAds = s;
    if( $("#footer-area").is(":visible") ) {
      ArticlePage.moveGGCON(s);
    }
    prs.rt('ggcon_end');
    return;
}
//END ggcon.js

function assignPosition(d) {
  if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
     d.css("left", Number(linkBufObj.offsetLeft + linkBufObjLeft) + "px");
     var linkId = linkBufObj.id;
     var linkNum = linkId.substring(9,linkId.length);
     var numPrev = Number(linkNum) - 1;
     var numPrevs = Number(linkNum) - 2;
     var numNext = Number(linkNum) + 1;
     var prevEle = doc.getById("authname_" + numPrev);
     var nextEle = doc.getById("authname_" + numNext);
     var prevestEle = doc.getById("authname_" + numPrevs);
     var posPrev;
     var posNext;
     if(prevEle != null){
      posPrev = findPosY(prevEle);
     } else {
      posPrev = findPosY(linkBufObj);
     }
     if(posPrev ==  findPosY(linkBufObj)){
      d.css("top", findPosY(linkBufObj) + linkBufObj.offsetHeight + 5 + "px");
     } else {
       if(nextEle != null){
        posNext = findPosY(nextEle);
       } else {
        if(prevestEle != null && posPrev == findPosY(prevestEle) ){
         posNext  = findPosY(linkBufObj) + 27;
        } else {
         posNext  = findPosY(linkBufObj);
        }
       }
       d.css("top", posNext + linkBufObj.offsetHeight + 5 + "px");
     }
     d.css("display", "block");

  } else {
     d.css("left", Number(linkBufObj.offsetLeft + linkBufObjLeft) + "px");
     d.css("top", findPosY(linkBufObj) + linkBufObj.offsetHeight + 2 + "px");
     d.css("display", "block");
  }
}


function textBoxCE(textObj,imptr) {
  var child=doc.getById(textObj);
  var imgChild=doc.getById(imptr);
  if(child.style.display!="block") {
    child.style.display="block";
    imgChild.src="/scidirimg/minus.gif";
  }
  else{
    child.style.display="none";
    imgChild.src="/scidirimg/plus.gif";
  }
}

function toggleFigLblMMCStyling()
{
  var defBoxes;
  var crntLblDivs;

  defBoxes = getElementsByClassName(document, 'DIV', 'textboxdefault');

  for(var k=0;k<defBoxes.length;k++) {
    crntLblDivs = getElementsByClassName(defBoxes[k], 'SPAN', 'nodefault');
    if (crntLblDivs.length == 0) {
      defBoxes[k].style.background = 'none';
      defBoxes[k].style.border = '0 none';
      defBoxes[k].style.margin = '0 0 0 15px';
    }
  }
}

function findPosY(obj) {
  var curtop = 0;
  if(obj.offsetParent) {
    while(1) {
      curtop += obj.offsetTop;
      if(!obj.offsetParent) { break; }
        obj = obj.offsetParent;
      }
  }
  else if(obj.y) {
    curtop += obj.y;
  }
  return curtop;
}
//Auth hover End

function hideModalBox(){
  doc.getById("modalBoxDisplay").style.display="none";
}

function setCenterAlign() {
  var msgBox = $('#modalWindowMsgBox');
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        var top = (winHeight - msgBox[0].offsetHeight)/2;
        var left = (winWidth - msgBox[0].offsetWidth)/2;
  msgBox.css('top',top+ 'px');
  msgBox.css('left',left+ 'px');
  $('#modalWindow').css('height',winHeight +'px');
}

function requestHeightAdjust(id, h) {
  if(h==0) { $('#' + id).height(h); }
  $('#' + id + ' iframe').height(h+20);
}

// default page layout settings
var pgLayout={
  vpWidth : $(window).width(),
  lcWidth : 260,
  ccWidth : 700,
  rcWidth : 300,
  rcFloatWidth:320,
  pgWidth : 1606,
  lcLeft : 0,
  ccLeft : 260,
  rcLeft : 960,
  pgLeft : 0,
  showLeftBar:true,
  showRightBar:true,
  animDuration:300,
  holdAnimation:500,
  bibliographicPanelDisplayed: false,
  relatedCitingPanelDisplayed: false,
  applicationPanelDisplayed: false,
  hoverOnColor:'#fff',
  hoverOffColor:'#ECF2F6',
  glowOnColor:'#C1D3E1',
  glowOffColor:'#ECF2F6'
};

//NewArtDeux Start
// right pane sidebar start
var rightSidePane={
  sendRightPaneKeyEvents: function(a, o, z) {
    $.get(SDM.userActionURL+'/'+o+'/'+z+'/'+a);
  },
  openPane: function() {
    $('#rightInner').css('margin-left','0');
    $('#rightInner').show();
    pgLayout.showRightBar=true;
    $('.toggleSideBar').unbind('click', rightSidePane.togglePane);
    //$('.toggleSideBar div').removeClass('open').addClass('close');
    $(".toggleSideBar").hide();
    rightSidePane.resizeAccordion();
    $('body').unbind('click', rightSidePane.handleMouseClick);
  },
  closePane: function() {
    $('#rightInner').css('margin-left',19);
    if(pgLayout.showRightBar==false) {
      $('#rightPane').stop().animate({ 'left': (pgLayout.rcLeft+pgLayout.rcFloatWidth)},  pgLayout.animDuration, function() {
          $(".toggleSideBar").show();
          $('#rightPane').css('width', pgLayout.rcWidth).css('left', pgLayout.ccLeft+pgLayout.ccWidth);
          $('.toggleSideBar div').removeClass('close').addClass('open');
      });
    }
    pgLayout.showRightBar=false;
    $('.toggleSideBar').bind('click', rightSidePane.togglePane);
    rightSidePane.resizeAccordion();
    $('body').unbind('click', rightSidePane.handleMouseClick);
  },
  togglePane: function(actPanel) {
    if(pgLayout.showRightBar==false) {
      $('#rightPane').css('width',pgLayout.rcFloatWidth);
      $('#rightInner').show().css('margin-left',19);
      $('.toggleSideBar div').removeClass('open').addClass('close');
      $('#rightPane').stop().animate({ 'left': (pgLayout.rcLeft-$('#rightInner').width())},  pgLayout.animDuration,function(){
          pgLayout.rcLeft=parseFloat($('#rightPane').css('left'),10);
          pgLayout.showRightBar=true;
          if(typeof actPanel =='string' && !$("#rightInner h2.ui-state-active").hasClass(actPanel))$('#rightInner').accordion("option", "active",'.'+actPanel);
      });
      $('body').bind('click', rightSidePane.handleMouseClick);
      rightSidePane.sendRightPaneKeyEvents('openRightPane', 'article', 'rightPane');
    } else {
      $('#rightPane').stop().animate({ 'left': (pgLayout.rcLeft+$('#rightInner').width())},  pgLayout.animDuration,function(){
          $('.toggleSideBar div').removeClass('close').addClass('open');
          pgLayout.rcLeft=parseFloat($('#rightPane').css('left'),10);
          $('#rightInner').hide();
          $('#rightPane').css('width',20);
          $('#rightInner').css('margin-left','');
          pgLayout.showRightBar=false;
      });
      $('body').unbind('click', rightSidePane.handleMouseClick);
      rightSidePane.sendRightPaneKeyEvents('closeRightPane', 'article', 'rightPane');
    }
    rightSidePane.resizeAccordion();
  },
  initAccordion: function () {
    $('#rightInner').accordion({
        'fillSpace':true,
        'icons':false,
        'active':false,
        'collapsible': true,             
        'changestart': function(event,ui) {
            selObj=$(ui.newContent).children('.innerPadding, .innerPaddingApp');
            if($(selObj).hasClass('js_bibliographic_content')){
              rightSidePane.getBibliographicPanel(selObj);
            }else if($(selObj).hasClass('js_citation_content')){
              rightSidePane.getRelatedCitingPanel(selObj);
            }else if($(selObj).hasClass('js_application_content')){
              rightSidePane.resetAccordionStyling();
              rightSidePane.sendUserKeyEvents('displayRightPanePanel', 'article', 'rightPane', SDM.keOriginContentFamily, 'applications');
            }else if($(selObj).hasClass('js_workspace_content')){
              rightSidePane.sendUserKeyEvents('displayRightPanePanel', 'article', 'rightPane', SDM.keOriginContentFamily, 'workspace');
            }
            $(ui.newContent).css({'overflow-y': 'auto', 'overflow-x': 'hidden'});
        },
        'change': function(event,ui) {
            $('#rightInner').accordion('resize');
            selObj=$(ui.newContent).children('.innerPadding, .innerPaddingApp');
            rightSidePane.showRightAd(selObj);
        }
    });
    $('#rightPane .accordionContent, #rightPane .accordionHead').hover(
        function() {
          var obj;
          if($(this).hasClass('accordionHead')) {
            obj=$(this).next('#rightPane .accordionContent');
          }
          else{
            obj=$(this);
          }
          rightSidePane.hoverOn(obj);
        },
        function() {
          var obj;
          if($(this).hasClass('accordionHead')) {
            obj=$(this).next('#rightPane .accordionContent');
          }
          else{
            obj=$(this);
          }
          rightSidePane.hoverOff(obj);
        } 
    );
    rightSidePane.setAccordionStyling();
    rightSidePane.setDefaultPane();
  },
  resizeAccordion: function () {
    $('#rightInner').accordion('resize');
    rightSidePane.hoverOff($('#rightPane div.ui-accordion-content-active'));
  },
  setAccordionStyling: function () {
    $('div.js_application_content').parent().css({'display': ''});
    $('div.js_application_content').parent().removeClass('ui-accordion-content');
    $('div.js_application_content').parent().css({'visibility': 'hidden', 'top': '-1000px', 'position': 'absolute', 'left': '-1000px'});
  },
  resetAccordionStyling: function () {
    $('div.js_application_content').parent().css({'visibility': '', 'top': '', 'position': '', 'left': ''});
  },
  setDefaultPane: function() {
    if (SDM.relatedCitingPanelAvail) {
      $('#rightInner').accordion('option', 'active', '.relatedArticles');
    } else if (SDM.applicationsPanelAvail) {
      $('#rightInner').accordion('option', 'active', '.applications');
    } else {
      $('#rightInner').accordion('option', 'active', '.bibliographic');
    } 
  },
  hoverOn: function(obj){
    $(obj).css({'background-color':pgLayout.hoverOnColor});
    pgLayout.glowOffColor=pgLayout.hoverOnColor;
    $(obj).children('.hidescrollbar').css({'display':'none'});
    if(!$(obj).children('.innerPadding').hasClass('js_workspace_content')){
      $(obj).css({'overflow-y':'auto','overflow-x':'hidden' });
    } 
  },
  hoverOff: function(obj){
    $(obj).css({'background-color':pgLayout.hoverOffColor});
    pgLayout.glowOffColor=pgLayout.hoverOffColor;
    $(obj).children('.hidescrollbar').css({'display':'block'});
    if($(obj)[0]){
      if($(obj).height()<$(obj)[0].scrollHeight && !$(obj).children('.innerPadding').hasClass('js_workspace_content')){
        $(obj).css({'overflow-y':'hidden','overflow-x':'hidden' });
      }
    } 
  },
  handleMouseClick:function(e){
    if(!$(e.target).parents('#rightPane').attr('id')
        && $(e.target).attr('class')!='intra_ref'
        && $('.toggleSideBar').css('display')=='block') {
      rightSidePane.togglePane();
    }
  }, 
  sendUserKeyEvents: function(a, o, z, ocf, p) {
    $.get(SDM.userActionURL+'/'+o+'/'+z+'/'+ocf+'/'+a+'/'+p);
  },
  getBibliographicPanel:function(obj){
    rightSidePane.sendUserKeyEvents('displayRightPanePanel', 'article', 'rightPane', SDM.keOriginContentFamily, 'biblioInfo');
    if (pgLayout.bibliographicPanelDisplayed) { return; }
    var authorStr='';
    $(".authorName").each (function() {
      if (authorStr != '') { authorStr += ', '; }
      authorStr += $(this).text();
      var authDegree = $(this).next('span.authorDegrees');
      if(authDegree != null && $(authDegree).text() != '') {
        authorStr += ', ';
        authorStr += $(authDegree).text();
      }
    }); 

    var collab = $('.authorGroup .collab');
    if (collab != null && $(collab).text() != '') { 
      authorStr += ', ';
      authorStr += $(collab).text();
    };

    var articleTitle = $(".svTitle").text();
    var doiLink = '<a href="http://dx.doi.org/' + SDM.doi + '">http://dx.doi.org/' + SDM.doi + '</a>';
    var pubTitle = $(".publicationHead div.title").text();
    if (pubTitle == "") {
      pubTitle = $(".publicationHead div.title").find("img").attr("alt");
    }
    var volIssueDetails = $(".publicationHead p.volIssue").text();
    var artHistory =  $(".articleDates").html();
    var exportCitation = $('.icon_exportarticle'+SD_UTIL.getProdColor()).outerHTML();
    var clonedObj;
    if (exportCitation != null) {
      clonedObj = $(exportCitation).clone();
      var url = $(clonedObj).find('a').attr('href');
      url = url.replace("toolbar", "rightPane");
      url += '&panel=biblioInfo';
      $(clonedObj).find('a').attr('href', url);
    }
    var nonSerialInfo = '';
    if (SDM.editorsInChief)  { nonSerialInfo = SDM.editorsInChief; }
    if (SDM.publicationCity) {
      if (nonSerialInfo != '') { nonSerialInfo += ', '; }
        nonSerialInfo += SDM.publicationCity;
      }

    var htmlStr = '<dl class="citation"><dd>' + authorStr + '</dd><dd class="title">'
                      + articleTitle + '</dd><dd class="pubInfo">' + pubTitle;
    if (nonSerialInfo != '') { htmlStr += ', ' + nonSerialInfo };
    if (volIssueDetails != '') { htmlStr += ', ' + volIssueDetails };
    htmlStr +='</dd><dd class="doi">' + doiLink + '</dd></dl>';
    if (artHistory != null) { htmlStr += '<dl class="articleHistory"><h3>Article history</h3>'+ artHistory + '</dl>'; }
    if (clonedObj || SDM.outwardLinks) { htmlStr += '<ul class="outwardLinks">'; }
    if (clonedObj != null) { htmlStr += '<li class="clearfix">' + $(clonedObj).outerHTML() + '</li>'; }
    if (SDM.outwardLinks) { htmlStr += '<li>' + SDM.outwardLinks + '</li>'; }
    if (exportCitation || SDM.outwardLinks) { htmlStr += '</ul>'; } 
    if (SDM.isSpecialIssue) {
      var titleEditors = $(".titleEditors").text();
      var specIssueTitle = $(".specIssueTitle").text();
      var specIssueUrl = $(".publicationHead p.volIssue").find("a").attr("href");
      htmlStr += '<h3>This article belongs to a special issue</h3><ol class="specIssue"><li class="specIssTitle"><a class="cLink" queryStr="?&zone=rightPane&panel=biblioInfo" href="' + specIssueUrl + '">' + specIssueTitle + '</a><li class="editor">' + titleEditors + '</li></ol>';
      htmlStr += '<div class="articleList"><h3>Other articles from this special issue</h3><ol id="specIssueList"></ol></div>';
    }
    obj.html (htmlStr);
    if (SDM.isSpecialIssue) {
      var specIssURL=SDM.urlPrefix + '/spliss/rslts/' + SDM.hubEid + '/' + SDM.pii;
      var getArticleList=function(res){rightSidePane.buildArticleList(res, "specIssueList", true);};
      $.getJSON (specIssURL, getArticleList);
    } 
    pgLayout.bibliographicPanelDisplayed = true;
  },
  getRelatedCitingPanel:function(obj){
    rightSidePane.sendUserKeyEvents('displayRightPanePanel', 'article', 'rightPane', SDM.keOriginContentFamily, 'citeRelatedArt');
    if (pgLayout.relatedCitingPanelDisplayed) { return; }

    if (SDM.rerunAvail && SDM.rerunJson !='') {
      var obj = $.parseJSON (decodeURIComponent(SDM.rerunJson));
      rightSidePane.buildArticleList (obj, "rerunArticles");
    }

    // Dont display the box when crawler is enabled
    if(SDM.crawlerAvail==true) { return; }

    if(SDM.mlktAvail) {
      var relatedArtURL=SDM.urlPrefix +'/mlkt/rslts/'+SDM.pii+'/Art'
      var getArticleList=function(res){rightSidePane.buildArticleList(res, "relArtList");};
      $.getJSON (relatedArtURL, getArticleList);

      if(SDM.relatedRefAvail==true) {
        var relatedRefURL=SDM.urlPrefix +'/mlkt/rslts/'+SDM.pii+'/Ref';
        var getArticleList=function(res){rightSidePane.buildArticleList(res, "relRefList");};
        $.getJSON (relatedRefURL, getArticleList);
      }
    }

    if(SDM.citedByScAvail) {
      var citedByURL=SDM.urlPrefix +'/citedby/rslts/'+SDM.pii;
      var getArticleList=function(res){rightSidePane.buildArticleList(res, "citedByList");};
        $.getJSON (citedByURL, getArticleList);
    }

    pgLayout.relatedCitingPanelDisplayed = true; 
  },
  toggleMoreInfo:function(e){
    var obj = $(e.target);
    var showMoreUrl = $(obj).attr ("data-url");
    var moreInfo = $(obj).parent().parent().find("div.moreInfo");
    moreInfo.toggle();
    var abs = moreInfo.find("div.abs");
    if (showMoreUrl && abs.html() == "") {
      $.get(showMoreUrl, function(response) {
          if (response.length > 1) {
            var absStr = '<h4>Abstract</h4>';
            absStr += response;
            abs.html(absStr);
            abs.show();
          }
      });
    }
    
    if(typeof sqClick=='function'&&obj.parents('#relArtList').length) { sqClick(obj,'mlktShowMore','122'); }
    return false;    
  },
  buildArticleList:function(res, targetId, isSpecialIssue) {
    var artList = '';
    var cacheType = res.TYPE;
    if (cacheType == '5') {
        $('#rightPane span#hitcount').html(res.HITCOUNT);
    }
    if (res) {
      if (cacheType == '8') { 
        if (parseInt(res.ARTICLE_COUNT) > 0 && $(res.citation).length > 0) {
          artList += '<h3 class="scopusInfo"><div><span class="bold">More documents by </span>'
          artList += '<a href="' + res.AUTH_PROFILE_URL + '">' + res.AUTHOR_NAME  + '</a></div><div class="scopus">Provided by Scopus</div></h3>';
        } else {
          return;
        }
      }
      if ($(res.citation).length < 1) {
        $('#'+targetId).parent().show();
        return;
      }
      $.each (res.citation, function(i, item){
          var key = item.PII?item.PII:item.SCEID;
          var showMoreUrl = SDM.urlPrefix + '/more/' + key + '/' + cacheType; 
          artList += '<li><ol class="articles"><li class="artTitle"><a title="' + item.ARTTITLE + '" href="' + item.ARTURL + '"';
          if (item.QUERYSTRING) {
              artList += ' class="cLink" queryStr="' + item.QUERYSTRING + '"';
          }
          artList += '>' + item.ARTTITLE + '</a></li>';
          if (isSpecialIssue == true) {
            artList += '<li class="authors">' + item.AUTHORS + '</li>';
          } else {
            artList += '<li class="srcTitle">' + item.PUBYR;
            if (item.PUBYR) { artList += ', '; }
            artList += item.PUBTITLE + '</li>';  
          }
          artList += '<li class="showMore">'
                  +  '<div class="moreInfo"><a data-url="' + showMoreUrl +  '" class="toggleMoreInfo closed">Show more information</a></div>'
                  +  '<div class="moreInfo hidden">'
                  +  '<a class="toggleMoreInfo opened">Close</a><ol class="details"><li>' + item.AUTHORS + '</li><li class="title">' + item.ARTTITLE + '</li>';
          artList += '<li class="fullSrcTitle">' + item.PUBTITLE ;
          if (item.VOLISS) { 
             artList += ', ' + item.VOLISS; 
          } else {
             if (item.VOL) {
                if ((item.VOL).indexOf('-') != -1) {
                    artList += ', Volumes ';
                } else {
                    artList +=', Volume ';
                }
                artList += item.VOL;
             }
             if (item.ISS) {
                if ((item.ISS).indexOf('-') != -1) {
                    artList +=', Issues ';
                } else {
                    artList +=', Issue ';
                }
                artList += item.ISS; 
             }
          }
          if (item.PUBDT) { artList += ', ' + item.PUBDT; }
          if (item.PG) { artList += ', ' + item.PG; }
          artList += '</li>';
          if (item.LBL) { artList += '<li class="docSubType">' + item.LBL + '</li>'; }
          artList += '<div class="abs"></div>';
          if (item.PDFURL) {
            artList += '<ul class="links"><li class="clearfix pdf"><div class="icon_pdf"><div class="icon"></div><a title="Download PDF" class="pdfRightPaneLink" href="';
            artList += item.PDFURL;
            artList += '"> PDF';
            if (item.PDFSIZE) {
              artList += ' (';
              artList += item.PDFSIZE;
              artList += ')';
            }
            artList += '</a></div></li></ul>';
          }
          if (cacheType == '5' && item.VIEW_RECORD_URL) {
              artList += '<ul><li><a href="' + item.VIEW_RECORD_URL + '">View details in Scopus</a></li><ul>';
          }
          if (item.PDFURL ||  item.VIEW_RECORD_URL) { 
              artList += '</ul>';
          }
          artList += '</ol></div></li></ol></li>'
      });
      var moreUrl = '';
      if (cacheType == '9') {
        moreUrl = $(".publicationHead p.volIssue").find("a").attr("href");
      } else {
        moreUrl = res.VIEW_MORE_URL;
      }
      if (cacheType != '8') {
        if ( moreUrl != '' && parseInt(res.HITCOUNT) > parseInt(res.MAX_ARTICLES_TO_DISPLAY) ) {
            artList += '<li><a href="' + moreUrl + '" class="viewMoreArticles cLink"'; 
            if (cacheType == '9') {
                artList += ' class="cLink" queryStr="?&zone=rightPane&panel=biblioInfo"'; 
            }
            artList += '>View more articles &raquo;</a></li>';
        }
      } else {
        if (parseInt(res.ARTICLE_COUNT) > 3) {
          artList += '<li class="scopusMoreLink"><a href="' + res.AUTH_ARTICLE_COUNT_URL + '">View more documents authored by '
                  + res.AUTHOR_NAME + '</a></li>';
        }
        if (parseInt(res.CITEDBY_COUNT) > 0) {
          artList += '<li class="scopusMoreLink"><a href="' + res.AUTH_CITEDBY_COUNT_URL + '">View more documents that cite '
                  + res.AUTHOR_NAME + '</a></li>';
        }
      }
      $('#'+targetId).html (artList);
      $('#'+targetId).parent().show();
      $('.pdfRightPaneLink').click(function(e) {
          var obj = e.target;
          var nw = window.open($(obj).attr('href'), 'newPdfRightPane', 'height=' + $(window).height()*.9 + ',width=' + $(window).width()*.9);
          SD_UTIL.killEvent(e);
      });
      $(".toggleMoreInfo").unbind("click", rightSidePane.toggleMoreInfo ).bind("click", rightSidePane.toggleMoreInfo);
      $('#rightPane li.srcTitle, #rightPane li.authors, #rightPane .artTitle a').ellipsis();
    }
  },
    sendCrossRefKeyEvents: function(a, o, z, ocf) {
          $.get(SDM.userActionURL+'/'+o+'/'+z+'/'+ocf+'/'+a);
    },
    findTargetElement:function(e) {
        var className = $(e.target).closest('a').attr('class');
        if (className == "figureLink") {
            // User clicked on Figure
            var wsObj = $(e.target).parents("dl");
            var selID = $(wsObj).attr('id');
            rightSidePane.setWorkSpace (selID,e);
        } else if (className.indexOf("authorName")!=-1) {
            var wsObj = $(e.target);
            rightSidePane.setWorkSpace(wsObj,e);
        }else {
            // IntraRef
            var selID=$(e.target).closest('a').attr('href').split('#');
            selID=selID[1];
            rightSidePane.setWorkSpace (selID,e);
            if (className == "intra_ref") {
                rightSidePane.sendCrossRefKeyEvents('displayCrossRefLink', 'article', 'centerPane', SDM.keOriginContentFamily);
            }
        }

        e.preventDefault();
        e.stopPropagation(); 
    },       
    setWorkSpace:function(selID,evt) {
        if(typeof(selID)=='object'){
            var wsObj = selID;
        }else{
            var wsObj = $('#'+selID);
        }
        if(!$(wsObj)[0]) {return;} 
        var data='';

        if($(wsObj)[0].tagName=='DIV' && $(wsObj).hasClass('figure') && $(wsObj).hasClass('table')) wsObj=$(wsObj).closest('div').next('p').next('div').find('dl');
        var wsObjClass=$(wsObj).attr('class')?$(wsObj).attr('class').replace(' ',''):$(wsObj).parent().attr('class').replace(' ','');
        wsObjClass=wsObjClass.replace('svArticle','').replace(' ','');

        var baseElement='dl.'+wsObjClass;
        switch (wsObjClass){
            case 'figure':
                var exeWS=function(wsObj,wsObjClass){return rightSidePane.populateFigures(wsObj,wsObjClass);};
                break;
            case 'table':
                var exeWS=function(wsObj,wsObjClass){return rightSidePane.populateTables(wsObj,wsObjClass);};
                 break;
            case 'references':
                 baseElement='ol.'+wsObjClass+'>li';
                 var exeWS=function(wsObj,wsObjClass){return rightSidePane.populateReferences(wsObj,wsObjClass);};
                 break;
            case 'ecomponent':
                 var baseElement='dd.'+wsObjClass;
                 if ($(wsObj).is('dl')) { wsObj = $(wsObj).find('dd.ecomponent'); }         
                 var exeWS=function(wsObj,wsObjClass){return rightSidePane.populateEcomponents(wsObj,wsObjClass);};
                 break;
            case 'footnote': 
            case 'tblFootnote':
                  var exeWS=function(wsObj,wsObjClass){return rightSidePane.populateFootnote(wsObj,wsObjClass);};
                  break;
            case 'authorName': 
            case 'affiliation': 
            case 'vitae': 
            case 'correspondence':
                  baseElement='.'+wsObjClass;
                  if(wsObjClass!='authorName'){
                      wsObjClass='authorName';
                      baseElement='.'+wsObjClass;
                      wsObj=$(evt.target).parents('li').find(baseElement);
                  }
                  if(wsObjClass=='vitae') {
                      wsObj=$('#b'+$(evt.target).attr('id')).parents('li').find(baseElement);
                  }
                  var exeWS=function(wsObj,wsObjClass){return rightSidePane.populateAuthorInfo(wsObj,wsObjClass);};
                  break;
            default:
                  ArticlePage.doHighlighting(evt);
                  return;
        }

        if(pgLayout.showRightBar==false){
             rightSidePane.togglePane("workspace");
        }else if(!$("#rightInner h2.ui-state-active").hasClass("workspace")){
             $('#rightInner').accordion("option", "active",".workspace");
        }

        data+=rightSidePane.buildPreviousNextLinks(baseElement,wsObj,wsObjClass);
        data+=exeWS(wsObj,wsObjClass); 

        if(wsObjClass!='authorName') {
            if(wsObjClass=='references' || wsObjClass=='footnote') { selID='b'+selID; }
            if(wsObjClass=='tblFootnote') { selID='ancb'+selID; }
            data+='<ul class="links">';
            if(wsObjClass=='ecomponent'){
              selID = $(wsObj).parent('dl').attr('id');
            }
            data+= '<li><a href="#'+selID+'" class="js_article" onclick="return $(\'#centerPane\').moveTo(\''+selID+'\')"><span class="icon viewInArticle_'+SD_UTIL.getProdColor()+'"></span>View in article</a></li>';
            if(wsObjClass=='ecomponent'){
              var obj='';
              obj = $(wsObj).siblings('dd.menuButtonLinks');
              if ($(obj).length>1) { obj = $(wsObj).next('dd.menuButtonLinks'); }
              data+='<li><a href="'+$(obj).find('a.MMCvLINK').attr('href')+'" class="js_article"><span class="icon download_'+SD_UTIL.getProdColor()+'"></span>'+$(obj).find('a.MMCvLINK').text()+'</a></li>';
            }
             data+='</ul>';
        }
        data += '<div id="workSpaceView"></div>';
        $('.js_workspace_content').find('.scrollArea').html(data);

        // Make AJAX call to get the abstract for references.
        if (wsObjClass=='references') {
            rightSidePane.populateReferenceLinks (wsObj);
        }

        if (wsObjClass=='authorName') {
            var authUrl = $(wsObj).parents('li').find('.authorName').attr('data-authurl');
            if (authUrl!=undefined) {
                var getArticleList=function(res){rightSidePane.buildArticleList(res, "scopusArticleList", true);};
                $.getJSON (authUrl, getArticleList); 
            }
        } 

        rightSidePane.animateBackground($('.js_workspace_content').parents('.accordionContent'));
        $('.buttonNavBox  a').unbind('click',rightSidePane.findTargetElement).bind('click',rightSidePane.findTargetElement);
        $('.intra_ref').unbind('click',rightSidePane.findTargetElement).bind('click',rightSidePane.findTargetElement);   

    },
    buildPreviousNextLinks:function(baseElement,wsObj,wsObjClass){
        var data='';
        var indexVal=$(baseElement).index($(wsObj)[0]);
        var next = $(baseElement).eq(indexVal+1);
        if(indexVal-1>=0){
            var prev = $(baseElement).eq(indexVal-1);
        }
        if(wsObjClass=='references') { wsObjClass='reference'; }
        if(wsObjClass=='authorName') { wsObjClass='author'; }
        if(wsObjClass=='tblFootnote') { wsObjClass='footnote'; }
        if ($(next)[0] || $(prev)[0]) {
            data+='<div aria-label="Go to previous and next in sidebar" role="navigation" class="buttonNavBox">';
            if($(prev).attr("id")){
                data+='  <a href="#'+$(prev).attr("id")+'" class="previous">&laquo; previous '+ wsObjClass +'</a>';
            }
            if($(next).attr("id")){
                data+='  <a href="#'+$(next).attr("id")+'" class="next">next '+ wsObjClass +' &raquo;</a>';
            }
            data+='</div>';
        }
        return data; 
    },
    populateFigures:function(selObj,selObjClass){
        var data='', imgSrc='';
        if($(selObj).find('dl.figure').length>0){
            $(selObj).find('dl.figure').each(function() {
                if($(this).find("img.figure").attr("data-fullsrc")==undefined){
                    imgSrc=$(this).find("img.figure").attr("data-gabssrc");
                }else{
                    imgSrc=$(this).find("img.figure").attr("data-fullsrc");
                }
                data+='<dl class="'+selObjClass+'">';
                if(imgSrc!=undefined)data+= '<dt><img src="'+imgSrc +'" alt="'+ $(this).find("img.figure").attr("alt") +'" class="'+selObjClass+'"></dt>';
                data+= ' <dd>'+$(this).find("dd p").outerHTML() +'</dd>'
                    + '</dl>';
            });
        }else{
            if($(selObj).find("img.figure").attr("data-fullsrc")==undefined){
                imgSrc=$(selObj).find("img.figure").attr("data-gabssrc");
            }else{
                imgSrc=$(selObj).find("img.figure").attr("data-fullsrc");
            }
            data+='<dl class="'+selObjClass+'">';
            if(imgSrc!=undefined)data+='<dt><img src="'+imgSrc +'" alt="'+ $(selObj).find("img.figure").attr("alt") +'" class="'+selObjClass+'"></dt>';
            data+= ' <dd>'+$(selObj).find("dd p").outerHTML() +'</dd>'
                + '</dl>';
        }
        return data;  
    },
    populateTables:function(selObj,selObjClass){
        var data='';
        data+='<dl class="'+selObjClass+'">';
        var tblData=$($(selObj).outerHTML());
        $(tblData).find('*[id]').each(function(){
            $(this).removeAttr('id');
        });
        $($(tblData).find('.menuButtonLinks')).remove();
        $($(tblData).find('.fullsizeTable')).remove();
        data+=$(tblData).html();
        data+= '</dl>';
        return data; 
    },
    populateReferences:function(selObj,selObjClass){
        var data='';
        data+='<ol class="'+selObjClass+'">';
        if($(selObj).find("li.author").html()!=null) { data+= '<li class="author">'+ $(selObj).find("li.author").html() +'</li>'; }
        if($(selObj).find("li.title").html()!=null) { data+= '<li class="title">'+ $(selObj).find("li.title").html() +'</li>'; }
        if($(selObj).find("li.source").html()!=null) { data+=' <li class="source">'+$(selObj).find("li.source").html() +'</li>'; }
        data+='<ul class="absPlaceHolder"></ul>';
        data+='<ul class="placeHolder"></ul>'; 
        data+='</ol>';
        return data; 
    },
    populateReferenceLinks:function (selObj) {
        var url='';
        var placeHolderObj = $(selObj).find("li.refPlaceHolder");
        if ($(placeHolderObj).attr("data-refres")=='Y') {
            // Reference has been resolved.
            rightSidePane.getAbstract(placeHolderObj);
            if ($(placeHolderObj).html()!=null) {
                // Add zone & panel for KeyEvents
                var keyEventObj = rightSidePane.addZoneAndPanelForKeyEvents(placeHolderObj);
                var data='';
                data+='<ul class="links">';
                $(keyEventObj).find('div.boxLink').each(function(){
                    var clonedObj = $(this).clone();
                    if($(clonedObj).find('.citedBy_')[0]){
                        var citeObj = $(clonedObj).find('.citedBy_');
                        var workId = "work_" + $(citeObj).attr('id');
                        $(clonedObj).find('.citedBy_').attr('id', workId);
                        // Check whether cited by count is retrieved already
                        if ($(citeObj).attr('data-citeres') == 'Y') {
                             var replacedText = $(citeObj).text().replace(" | ","");
                             $(clonedObj).find('.citedBy_').html(replacedText);
                        } else {
                            rightSidePane.getScopusCitedByCount(placeHolderObj,citeObj);
                        }
                        data+='<li class="refLinks">'+$(clonedObj).outerHTML()+'</li>';
                    } else {
                        data+='<li class="refLinks">'+$(clonedObj).outerHTML()+'</li>';
                    }
                });
                data+='</ul>';
                var wsObj = $('.js_workspace_content').find('.scrollArea');
                var obj = $(wsObj).find("ul.placeHolder");
                $(obj).show();
                $(obj).html(data);
            }
        } else {
            // Reference not resolved. Resolve reference and get abstarct
            rightSidePane.resolveRefsForWorkSpacePanel(placeHolderObj);
        } 
    },
    getAbstract:function(refHolder){
        var absUrl = $(refHolder).attr("data-absUrl");
        if (absUrl == undefined) { return; }
        var ajaxReq = $.get(absUrl, function(response) {
            if (response.length > 1) {
                 var wsObj = $('.js_workspace_content').find('.scrollArea');
                 var obj = $(wsObj).find("ul.absPlaceHolder");
                 $(obj).show();
                 $(obj).html(response);
            }
        });
    },
    addZoneAndPanelForKeyEvents:function(obj) {
        $(obj).find('div.boxLink').each(function(){
            if ($(this).find('a')[0]) {
                // For article url add zone & panel to queryStr
                var anchorTag = $(this).find('a');
                var queryStr = $(anchorTag).attr('queryStr');
                if (queryStr!=undefined) {
                    queryStr += '&_zone=rightPane&panel=workspace';
                    $(anchorTag).attr('queryStr', queryStr);
                } else {
                     var url = $(anchorTag).attr('href');
                     if (url!=undefined) {
                         if (url.indexOf("art_page") != -1) {
                             url = url.replace ("art_page", "rightPane");
                         } else {
                             url += '&zone=rightPane';
                         }
                         url += '&panel=workspace';
                         $(anchorTag).attr('href', url);
                     }
                 }
             }
        });
        return obj; 
    },
    getScopusCitedByCount:function(placeHolderObj,citeObj){
        var citeUrl = '';
        var scEid = $(citeObj).attr("data-sceid");
        var refId = $(placeHolderObj).attr("id");
        if (scEid != undefined && refId != undefined) {
            citeUrl = SDM.urlPrefix + '/citedByScopus/' + scEid + '/' + refId;
        }
        if (citeUrl != '') {
            var ajaxReq = $.get(citeUrl, function(response) {
                if (response) {
                     var wsObj = $('.js_workspace_content').find('.scrollArea');
                     if ($(wsObj).find('.citedBy_')[0]) {
                         $(wsObj).find('.citedBy_').html(response);
                     }
                }
            });
       }
    },
    resolveRefsForWorkSpacePanel:function(placeHolderObj){
        var url = url = SDM.urlPrefix + '/resolveRefs/' + SDM.pm.eid + '/' + $(placeHolderObj).attr("id");
        var data='';
        var wsObj = $('.js_workspace_content').find('.scrollArea');
        var obj = $(wsObj).find("ul.placeHolder");
        if (obj && url) {
            var ajaxReq = $.get(url, function(response) {
                if (response) {
                    var absData = $(response).find('li.refAbs');
                    if ($(absData)[0] ) { data+= $(absData).outerHTML(); }
                    // Add zone & panel for KeyEvents
                    var keyEventObj = rightSidePane.addZoneAndPanelForKeyEvents($(response)); 
                    data+='<ul class="links">';
                    $(keyEventObj).find('div.boxLink').each(function(){
                        data+='<li class="refLinks">'+$(this).html()+'</li>';
                    });
                    data+='<ul>';
                    $(obj).show();
                    $(obj).html(data);
                }
            });
        }
    },   
    populateEcomponents:function(selObj,selObjClass){
        var data='';
        var wsObj = $(selObj).parent('dl');
        var wsObjId = $(selObj).attr('id');
        data+='<dl class="'+selObjClass+'">';
        if ($(wsObj)[0] && wsObjId != 'undefined') {
          data += ' <dd>'+$(wsObj).find('#'+wsObjId).html() +'</dd>';
        }
        if ($(wsObj).find("dd.mmcCaption").html() != null) {
          data += ' <dd>'+$(wsObj).find("dd.mmcCaption").html() +'</dd>';
        }
        data += '</dl>';
        return data; 
    },
    populateAffiliations:function(selObj,selObjClass){
        var data='';
        data+='<ul class="'+selObjClass+'">'
            + '<li>'+ $(selObj).html() +'</li>'
            + '</ul>';
        return data;
    }, 
    populateAuthorInfo:function(selObj,selObjClass){
        var data='';
        var affData='';
        var vitaeData='';
        var authText='';
        data+='<h3>' + $(selObj).parents('li').find('.authorName').text()+'&nbsp;'
            +$(selObj).parents('li').find('.authorDegrees').text()
            + '</h3>'
            +'<dl class="author">';
        if($(selObj).parents('li').find('.authorRoles').text()!=''){
            var roleTxt=$(selObj).parents('li').find('.authorRoles').text();
            data+='<dd><span class="icon blank"></span><p>'
                + roleTxt.substring(2,roleTxt.length-1)
                + '</p></dd>';
        }

        $(selObj).parents('li').find('a').each(function() {
            if($($(this).attr('href')).parents('ul').hasClass('affiliation')){
                affData=$($(this).attr('href')).clone();
                $($(affData).find('sup')).remove();
                data+='<dd><span class="icon affiliation_'+SD_UTIL.getProdColor()+'"></span><p>'
                    + $(affData).html()
                    + '</p></dd>';
            }else if(!$(data).find('.affilData')[0]){
                 data+='<dd class="affilData"><span class="icon affiliation_'+SD_UTIL.getProdColor()+'"></span><p>'
                     + '</p></dd>';
            }
            if($($(this).attr('href')).hasClass('correspondence')){
                data+='<dd><span class="icon correspondence_'+SD_UTIL.getProdColor()+'"></span><p>'
                    + $($(this).attr('href')).find('dd').html()
                    + '</p></dd>';
            }
           if($($(this).attr('href')).hasClass('footnote')){
                data+='<dd><span class="icon blank"></span><p>'
                    + $($(this).attr('href')).find('dd').html()
                    + '</p></dd>';
           }
           if($(this).attr('href').toLowerCase().indexOf('mailto')!=-1){
                data+='<dd><span class="icon email_'+SD_UTIL.getProdColor()+'"></span><p>'
                    + $(this).attr('href').replace('mailto:','')
                    + '</p></dd>';
           }
           if($(this).attr('target')=='externObjLink'){
                var url=$(this).attr('href').substring($(this).attr('href').indexOf('_targetURL')+11,$(this).attr('href').length);
                data+='<dd><span class="icon url"></span><p>'
                    + decodeURIComponent(decodeURIComponent(url))
                    + '</p></dd>';
           }
        });

        data+='</dl>';

        if($(selObj).parents('li').find('.authorVitaeLink')[0]){
            var vitaeObj=$($(selObj).parents('li').find('.authorVitaeLink').attr('href')).clone();
            var authImg='';
            if($(vitaeObj).find('img')[0]){
                authImg='<div class="authImg">'+$(vitaeObj).find('img').outerHTML()+'</div>';
                $($(vitaeObj).find('img').parent('span')).remove();
            }
            data+='<h3>Vitae</h3>'
                +authImg
                +$(vitaeObj).html();
        }

        // Scoupus Author Info
        var authUrl = $(selObj).parents('li').find('.authorName').attr('data-authurl');
        if (authUrl != '') {
            data += '<div class="articleList"><ol id="scopusArticleList"></ol></div>';
        } 
        if(affData=='' && $(selObj).parents('ul').next('ul.affiliation')[0]){
            var affData=$(selObj).parents('ul').next('ul.affiliation');
            var affOtherData='';
            var affNewData=$('<div>'+data+'</div>').clone();
            if(affData[0] && !$(affData).find('sup')[0]){
               $($(affData).find('sup')).remove();
                affOtherData+='<span class="icon affiliation_'+SD_UTIL.getProdColor()+'"></span><p>'
                    + $(affData).find('li').html()
                    + '</p>';
                $(affNewData).find('.affilData').html(affOtherData);
            }else{
                $(affNewData).find('.affilData').remove();
            }
            data=$(affNewData).html();
        }else{
            var affNewData=$('<div>'+data+'</div>').clone();
            $(affNewData).find('.affilData').remove();
            data=$(affNewData).html();
        }
        return data;  
    },
    populateFootnote:function(selObj,selObjClass){
        var data='';
        if(selObjClass=='footnote'){
            data+='<h3>Footnote '+ $(selObj).find("dt").text() +'</h3>';
            data+='<p>'+ $(selObj).find("dd").html() +'</p>';
        }else{
            data+='<h3>Table footnote '+ $(selObj).find("dt").text() +'</h3>';
            data+='<p>'+ $(selObj).find("dd").html() +'</p>';
        }
        return data; 
    },
    animateBackground:function(obj){
        var rp=$(obj).add($(obj).children('.hidescrollbar'));
        $('div.accordionContent').animate({backgroundColor: pgLayout.glowOnColor},{queue:false,duration:300,complete:function() {
           setTimeout( function() {$('div.accordionContent').stop().animate({backgroundColor: pgLayout.glowOffColor}, {queue:false,duration:100})}, 300);
        }});
    },
    showRightAd:function(obj) {
        var iframe='';
        var rpWidth = $(obj).width();
        var rightAdPH=$(obj).find('.rightAdPlaceHolder');
        $('.rightAdPlaceHolder').html('');
        if (rpWidth <= 300 && SDM.adArticleRightSmURL != "") {
            iframe = '<div id="articleRightAdSm"><iframe scrolling="no" frameborder="0" border="0" cellspacing="0" src="' + SDM.adArticleRightSmURL + '"></iframe></div>';
        }
        else if (rpWidth > 300 && SDM.adArticleRightLgURL != "") {
            iframe = '<div id="articleRightAdLg"><iframe scrolling="no" frameborder="0" border="0" cellspacing="0" src="' + SDM.adArticleRightLgURL + '"></iframe></div>';
        }
        if (rightAdPH[0] && iframe!='') {
            rightAdPH.html(iframe);
        }else if(iframe!=''){
            $(obj).append($('<div class="rightAdPlaceHolder">'+iframe+'</div>'));
        }else{
            rightAdPH.hide();
        }
    }
}
// right pane sidebar code end

// to get the outer html of the selected content
$.fn.outerHTML = function(s) { 
    return (s) ? this.before(s).remove() : $("<p>").append(this.eq(0).clone()).html(); 
} 
// to mimic textoverflow ellipsis feature if not supported by the browser
$.fn.ellipsis = function(){
  var style = document.documentElement.style;
  var hasTextOverflow = ('textOverflow' in style || 'OTextOverflow' in style);
  if(!hasTextOverflow){
    return this.each(function(){
      var element = $(this),                        
      // the clone element we modify to measure the width                         
      clone = element.clone(),                        
      // we save a copy so we can restore it if necessary                        
      originalElement = element.clone(),                        
      originalWidth = element.width(),                        
      reflow = function () { 
          if (originalWidth !== element.width()) {                                
            element.replaceWith(originalElement);                                
            element = originalElement;                                
            originalElement = element.clone();                                
            element.ellipsis();                                
            originalWidth = element.width();
          }                        
      };
      if(element.css("overflow") == "hidden"){
        var text = element.html();
        var multiline = element.hasClass('multiline');
        var t = $(this.cloneNode(true)).hide().css('position', 'absolute').css('overflow', 'visible').width(multiline ? element.width() :'auto').height(multiline ? 'auto' : element.height());
        element.after(t);
        function height() { return t.height() > element.height(); };
        function width() { return t.width() > element.width(); };
        var func = multiline ? height : width;
        while (text.length > 0 && func()){
          text = text.substr(0, text.length - 1);
          t.html(text + "...");
        }
        element.html(t.html());
        t.remove();
      }
      setInterval(reflow, 200);
    });
  }
  else {
    $(this).css({'text-overflow':'ellipsis','overflow':'hidden','white-space':'nowrap'});
  }
}
// NewArt Deux End

//NEWARTDEUXBEGIN TableDownload
var TableDownload = {
  processRequest: function(e) {
    var tableId = $(e.target).closest('dl').attr('id');    
    var table = $("#" + tableId + " dd.table table");
    var lblCap = $("#" + tableId + " dd.lblCap");
    var csvText = "";
    csvText += TableDownload.convertLabelToCSV(lblCap);
    csvText += "\n";
    csvText += TableDownload.convertTableToCSV(table);

    SD_UTIL.sendDownloadKeyEvent('article', 'centerPane', SDM.keOriginContentFamily, 'CSV');

    $('<form action="' + SDM.ep.downloadCsvURL + '"' + ' method="post">' + '<input type="hidden" name="buffer" value="' + csvText.toString() + '" ></form>')
          .appendTo('#articleToolbar').submit().remove();

    return; 
  }, //processRequest

  convertLabelToCSV: function(myLabel) {
    var csvData = [];
    var labelRow = [];
    labelRow[labelRow.length] = TableDownload.cleanCellData($(myLabel).html());
    TableDownload.row2CSV(labelRow, csvData);
    var mydata = csvData.join('\n');
    return mydata;
  },

  convertTableToCSV: function(myTable) {
    var csvData = [];
    myTable.find('thead tr').each(function() {
      var tmpHeadRow = [];
      $(this).find('th').each(function() {
        tmpHeadRow[tmpHeadRow.length] = TableDownload.cleanCellData($(this).html());
      });
      TableDownload.row2CSV(tmpHeadRow, csvData);
    });

    myTable.find('tbody tr').each(function() {
      var tmpRow = [];
      $(this).find('td').each(function() {
        tmpRow[tmpRow.length] = TableDownload.cleanCellData($(this).html());
      });
      TableDownload.row2CSV(tmpRow, csvData);
    });

    var mydata = csvData.join('\n');
    return mydata;
  }, //convertTableToCSV

  row2CSV: function(tmpRow, csvData) {
    var tmp = tmpRow.join('') // to remove any blank rows
    if (tmpRow.length > 0 && tmp != '') {
      var mystr = tmpRow.join(',');
      csvData[csvData.length] = mystr;
    }
  }, //row2CSV

  cleanCellData: function(rawCellData) {
    if(rawCellData.match('mathmlsrc') == null) {
      var cleanCellData = rawCellData.replace(/<img\/?[^>]+(>|$)/g, "&lt;image&gt;");
      cleanCellData = cleanCellData.replace(/<\/?[^>]+(>|$)/g, "");
      cleanCellData = cleanCellData.replace(/[,]/g, "<comma>");  //temporary workaround for comma. 
      cleanCellData = cleanCellData.replace(/&nbsp;/gi, " ");
      cleanCellData = cleanCellData.replace(/&gt;/gi, ">");
      cleanCellData = cleanCellData.replace(/&lt;/gi, "<");
      var regexp = new RegExp(/["]/g); 
      cleanCellData = cleanCellData.replace(regexp, "⿿");
    } else {
      var cleanCellData = "<MathML>";
    }

    if (cleanCellData.indexOf(",") != -1) {
      cleanCellData = "\"" + cleanCellData + "\"";
    }

    return cleanCellData;
  } //cleanCellData
} //TableDownload
//NEWARTDEUXEND TableDownload

var FigureDownload = {
  processRequest: function(e) {
    SD_UTIL.sendDownloadKeyEvent('article', 'centerPane', SDM.keOriginContentFamily, 'PPT');
  }
}

var GadgetUtil = {
  toolbarIds:["SD_FTA1", "SD_AT1P"],
  displayGadgetCallBack: "",

  loadGadgets:function() {
    SDM.sciverseDecoded=false;
    var gadgetURL = SDM.urlPrefix +'/gadgets/render/'+SDM.pii;
    $.post(gadgetURL,{ JSONString:SDM.sciverseJsonObject }, function(data){
      if(data) {
        try {
          sciverse = decodeURIComponent(decodeURIComponent(data));
          SDM.sciverseDecoded=true;
        }
        catch (err) {
          SDM.sciverseDecoded=false;
        }
      }
      if(SDM.sciverseDecoded==true && sciverse.length>0) {
        prs.rt('svAppLibs_start');
        LazyLoad.js([SDM.ep.svShindigLib, SDM.ep.svSciverseLib], function() {
          GadgetUtil.displayGadgetsWrapper();
          if(SDU.isIE7()) ArticlePage.setPaneWidths();
          prs.rt('svAppLibs_end');
        });
      }
    }); 
  },
  displayGadgetsWrapper:function() {
    if(typeof displayGadgets=='function') {
      sgf.subscribeForEvents(sgfEvents.INVOKE_WORKSPACE_VIEW, GadgetUtil.invokeWorkSpaceView);
      sgf.subscribeForEvents(sgfEvents.DISPLAY_GADGET, GadgetUtil.checkForPrivilagedGadget); 
      displayGadgets();
    }
    else {
      setTimeout('GadgetUtil.displayGadgetsWrapper()', 250); 
    } 
  },
  checkForPrivilagedGadget:function(gadgetArray) {
    if (pgLayout.applicationPanelDisplayed) { return; }
    if (gadgetArray != null) {
      $.each (gadgetArray, function() {
        if (this.privFlag == 'Y' && (GadgetUtil.toolbarIds).indexof(this.locationId) > -1) {
          if(!$("#rightInner h2.ui-state-active").hasClass("applications")){
            $('#rightInner').accordion('option', 'active', '.applications');
            rightSidePane.resizeAccordion();
            ArticlePage.setPaneWidths();
          }
          pgLayout.applicationPanelDisplayed = true;
          return false;
        }
      });
    }
  },
  toggleGadgetView:function(obj, boxId, ecompId) {
    if($(obj).hasClass('openMMC')) {
      $(obj).removeClass('openMMC').addClass('closeMMC');
      GadgetUtil.displayGadgetCallBack (boxId, ecompId);
    } else if ($(obj).hasClass('closeMMC')) {
      $(obj).removeClass('closeMMC').addClass('openMMC');
      GadgetUtil.closeGadgetView (boxId);
    }
  },
  closeGadgetView:function (boxId) {
    var ecompObj = $('#'+boxId);
    if (ecompObj) {
      $(ecompObj).find('.containerApplOver').remove();
      $(ecompObj).find('.ecomponent').children().css('display', 'block');
    }
  },
  invokeWorkSpaceView:function() {
    $('.js_workspace_content .scrollArea').html('');
    $('.js_workspace_content .scrollArea').html('<div id="workSpaceView"></div>');
    $('.js_workspace_content #workSpaceView').css('display', 'block');
    if(!$("#rightInner h2.ui-state-active").hasClass("workspace")){
      $('#rightInner').accordion("option", "active",".workspace");
    }
    rightSidePane.animateBackground($('.js_workspace_content').parents('.accordionContent'));
  }   
  
}

// gadget framwrk callback to add menuitem
function svAddMenuItems(boxId, ecompId, imageUrl, altText, fnName){
  GadgetUtil.displayGadgetCallBack = fnName;
  var ecompObj = '';
  var boxObj = $('#'+boxId);
  if ($(boxObj).find('dd.ecomponent').length > 1) {
    ecompObj = $('#'+ecompId).next('dd.menuButtonLinks').find('ul.menuButton');
  } else {
    ecompObj = $('#'+boxId).find('ul.menuButton');
  }

  if (ecompObj[0]) {
      var htmlStr = '<li><a class="openMMC" href="#" onclick=\'GadgetUtil.toggleGadgetView(this,"' + boxId + '","' + ecompId + '");\'><img src="'+imageUrl+'" alt="'+altText+'"></img></a></li>';
      $(ecompObj).append(htmlStr);
  } 
}

Array.prototype.indexof = function(obj){
   for(var i=0; i<this.length; i++){
      if(this[i]==obj){
          return i;
      }
   }
   return -1;
}
