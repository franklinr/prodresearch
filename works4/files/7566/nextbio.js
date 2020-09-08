<!--
var testTimer = 0;
var piiValue = "";
var searchTerms = "";
var iFrameHtml = " ";

function createTO(mSec)
{
  testTimer = setTimeout("handleTO()", mSec);
}
function cancelTO()
{
  if(0 != testTimer){
    clearTimeout(testTimer);
    testTimer = 0;
  }
}
function handleTO()
{
  var myFrame = null;
  if(document.all) {
    var myFrame = document.all["tagCloudDummyIframe"];
  }
  else if(document.getElementById) {
    myFrame = document.getElementById("tagCloudDummyIframe");
  }
  if(myFrame) {
    myFrame.parentNode.removeChild(myFrame);
  }
}
function iframeContentLoaded(e)
{
  try {
    var myFrame;
    var myFrameDoc;
    if(document.frames) {
      myFrame = document.frames["tagCloudDummyIframe"];
      if(myFrame) {
        myFrameDoc = myFrame.document;
      }
    }
    else {
      myFrame = document.getElementById("tagCloudDummyIframe");
      if(myFrame) {
        myFrameDoc = myFrame.contentDocument;
      }
    }
    if(myFrameDoc) {
      var loadStatus = ( e && (typeof e.type !== 'undefined')?e.type:myFrameDoc.readyState);
      if(("load" == loadStatus)||("complete" == loadStatus)) {
        // Set timeout 
        createTO(10000);
        nbApi.tagCloudFromPii(
               "nextBioViewer", 
	       piiValue,
               searchTerms, 
               function(id, bLoaded){tagCloudCallBack(id, true);},
               null, 
               null, 
               null,
               "tagCloudDummyIframe"
        );
      } 
    } 
  }
  catch(e)
  {}
  return true;
}
function nextBio()
{
  //Third party content 

  var myFrame = document.createElement("iframe");
  myFrame.id="tagCloudDummyIframe";
  myFrame.style.display = 'none';
  myFrame.setAttribute("name", "tagCloudDummyIframe");
  myFrame.onload = iframeContentLoaded;
  myFrame.onreadystatechange = iframeContentLoaded;
  if(!document.frames)
  {
    myFrame.src=iFrameHtml;
  }
  document.getElementById('nextBioViewer').appendChild(myFrame);
}
function tagCloudCallBack(id, bLoaded)
{
  if(bLoaded) {
    cancelTO();
    var nbid = document.getElementById('nextBioViewer');
    if(nbid != null) {
      nbid.style.display = 'inline';
    }
  }
}
//-->
