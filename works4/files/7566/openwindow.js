function openNS(url, width, height) {
    if ((navigator.appName == "Microsoft Internet Explorer") &&
        (parseFloat(navigator.appVersion) < 4 ))
    {
        return false;
    }
     
    if (!width) var width = 600;
    if (!height) var height = 400;

    var newX=width,newY=height,xOffset=10,yOffset=10;
    var parms = 'width=' + newX +
            ',height=' + newY +
            ',screenX='+ xOffset +
            ',screenY=' + yOffset +
            ',status=yes,toolbar=yes,menubar=yes' +
            ',scrollbars=yes,resizable=yes,location=yes';
    nsWin = window.open(url,'displayWindow',parms);
    nsWin.focus();
    return false;
}

function openStrippedNS(url) {
    if ((navigator.appName == "Microsoft Internet Explorer") &&
        (parseFloat(navigator.appVersion) < 4 ))
    {
        return false;
    }

    var xOffset=25,yOffset=25;
    var parms = 'left='+ xOffset +
            ',top=' + yOffset +
            ',status=yes,toolbar=no,menubar=no' +
            ',scrollbars=yes,resizable=yes,location=no';
    nsWin = window.open(url,'displayWindow',parms);
    nsWin.focus();
    return false;
}

function openPopup(url, windowName, width, height) {
  if ((navigator.appName == "Microsoft Internet Explorer") &&
    (parseFloat(navigator.appVersion) < 4 )) { return false; }
     
  var xOffset=25,yOffset=25;
  var parms = 'width=' + width +
        ',height=' + height +
        ',left=' + xOffset +
        ',top=' + yOffset +
        ',status=no,toolbar=no,menubar=no' +
        ',scrollbars=yes,resizable=yes';
  var displayName = windowName;

  nsWin = window.open(url, displayName, parms);
  nsWin.focus();
  return false;
}

function displayAds() {

  var lbZone = document.getElementById('leaderboard');
  var lbContent = document.getElementById('leaderboard2');
  if(lbZone && lbContent) {
    lbZone.innerHTML = lbContent.innerHTML;
  }

  var skyZone = document.getElementById('skyscraper');
  var skyContent = document.getElementById('skyscraper2');
  if(skyZone && skyContent) {
    skyZone.innerHTML = skyContent.innerHTML;
  }

  var boomZone = document.getElementById('boombox');
  var boomContent = document.getElementById('boombox2');
  if(boomZone && boomContent) {
    boomZone.innerHTML = boomContent.innerHTML;
  }
}
