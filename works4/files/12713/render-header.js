var baseUrl = "https://programmatic.doceree.com";

(function () {
    if (typeof (hcpContext) != 'undefined') {
        setDocereeContext(hcpContext);
    }
    initializeDocereeCookie();
})();

function initializeDocereeCookie(context) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", baseUrl + "/render/init", true);
    xhttp.setRequestHeader('Content-type', 'text/plain; charset=utf-8');
    xhttp.withCredentials = true;
    xhttp.crossDomain = true;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const uniqueId = xhttp.responseText;
            if(uniqueId) {
                const throtleUrl = `https://thrtle.com/insync?vxii_pid=10069&vxii_pdid=${uniqueId}&vxii_r=${encodeURIComponent(baseUrl)}%2Fsync%2FthrotleCookie%3Fpartner%3DThrotle%26partner_deviceid%3D%24%7Btid%7D%26doceree_id%3D${uniqueId}`;
                let imgElem = document.createElement('img');
                imgElem.src = throtleUrl;
            }
        }
    };
    xhttp.send();
}

function setDocereeContext(userObj) {
    var cookieContext = {};

    if (userObj['email'] !== undefined) {
        cookieContext.email = userObj['email'];
    }

    if (userObj['firstName'] !== undefined) {
        cookieContext.firstName = userObj['firstName'];
    }

    if (userObj['lastName'] !== undefined) {
        cookieContext.lastName = userObj['lastName'];
    }

    if (userObj['specialization'] !== undefined) {
        cookieContext.specialization = userObj['specialization'];
    }

    if (userObj['gender'] !== undefined) {
        cookieContext.gender = userObj['gender'];
    }

    if (userObj['city'] !== undefined) {
        cookieContext.city = userObj['city'];
    }

    if (userObj['npi'] !== undefined) {
        cookieContext.npi = userObj['npi'];
    }

    if (userObj['zipCode'] !== undefined) {
        cookieContext.zipCode = userObj['zipCode'];
    }

    if (userObj['mciRegistrationNumber'] !== undefined) {
        cookieContext.mciRegistrationNumber = userObj['mciRegistrationNumber'];
    }

    if (userObj['hashedNPI'] !== undefined) {
        cookieContext.hashedNPI = userObj['hashedNPI'];
    }

    if (userObj['hashedEmail'] !== undefined) {
        cookieContext.hashedEmail = userObj['hashedEmail'];
    }

    // set dmdData here

    var encryptedHCP = btoa(encodeURIComponent(JSON.stringify(cookieContext)));
    document.cookie = "_docereeContext=" + encryptedHCP + "; path=/";
}

function removeDocereeContext() {
    document.cookie = '_docereeContext=; Max-Age=-99999999;';
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

function docereeLogMessage(baseUrl, message) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", baseUrl + "/render/logMessage", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(JSON.stringify({
        'message': message
    }));
}

if (!window.AdButler) { 
    (function () { 
        var s = document.createElement("script"); 
        s.async = true; 
        s.type = "text/javascript"; 
        s.src = 'https://adbserver.doceree.com/app.js'; 
        var n = document.getElementsByTagName("script")[0]; 
        n.parentNode.insertBefore(s, n);
    }()); 
}
(function(w,d,s,m,n,t){
    w[m]=w[m]||{init:function(){(w[m].q=w[m].q||[]).push(arguments);},ready:function(c){if('function'!=typeof c){return;}(w[m].c=w[m].c||[]).push(c);c=w[m].c;
    n.onload=n.onreadystatechange=function(){if(!n.readyState||/loaded|complete/.test(n.readyState)){n.onload=n.onreadystatechange=null;
    if(t.parentNode&&n.parentNode){t.parentNode.removeChild(n);}while(c.length){(c.shift())();}}};}},w[m].d=1*new Date();n=d.createElement(s);t=d.getElementsByTagName(s)[0];
    n.async=1;n.src='https://www.medtargetsystem.com/javascript/beacon.js?'+Date.now().toString();n.setAttribute("data-aim",m);t.parentNode.insertBefore(n,t);
})(window,document,'script','AIM_160');

AIM_160.init('160-2655-D7D48E5B');

AIM_160.ready(function () {
    let fetchData = AIM_160.fetch()
    if (fetchData) {
        sendDmdData(fetchData, 'fetch', new Date());
    } 
    AIM_160.ondetect(function (userObj) {
        sendDmdData(userObj, 'ondetect', new Date());
    });
});

function sendDmdData(userObj, operation, aimReadyInvoked) {
    try {
        let aimOnDetectInvoked = new Date();
        if (userObj && JSON.stringify(userObj).length > 5) {
            let message = 'Ready invoked at: ' + aimReadyInvoked.toUTCString() + ', ' + operation + ' invoked at: ' + aimOnDetectInvoked.toUTCString()
            + ', payload received: ' + JSON.stringify(userObj) + ', origin: ' + window.location.origin;
            docereeLogMessage('https://programmatic.doceree.com', message);
        }
        let overwrite = true;
        let existingData = getCookie('_docereeDmdContext');
        if (existingData) {
            existingData = JSON.parse(decodeURIComponent(atob(existingData)));
            if (existingData.npi_number && existingData.npi_number.length === 10) {
                overwrite = false;
            }
        }

        if (overwrite) {
            let encryptedHCP = btoa(encodeURIComponent(JSON.stringify(userObj)));
            let date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.cookie = "_docereeDmdContext=" + encryptedHCP + "; expires=" + date.toGMTString() + "; path=/";
            if (typeof initDocereeSlotRenderer === "function") {
                initDocereeSlotRenderer();
            }
        }
    } catch (err) {
        if (err && err.message) {
            let message = 'Error message ' + err.message + ', origin: ' + window.location.origin;
            docereeLogMessage('https://programmatic.doceree.com', message);
        }
    }
}
