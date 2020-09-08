/* Last Updated 29th Sept 2011 */
var wileyJobs = wileyJobs || {};

wileyJobs.currentLocationID = (function() {
    var loc = [
        {id:0, list:[]}, //restOfTheWorld
        {id:1, list:["CA","BM","GL"]}, //northAmerica
        {id:2, list:{
            "US" : [
                {id:3, list:["IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "SD", "WI"]}, //midwest
                {id:4, list:["CT", "ME", "MA", "NH", "NJ", "NY", "PA", "RI", "VT"]}, //northeast
                {id:5, list:["ID", "MT", "OR", "WA", "WY"]}, //northwest
                {id:6, list:["AK", "HI"]}, //pacific
                {id:7, list:["AL", "AR", "DE", "DC", "FL", "GA", "KY", "LA", "MD", "MS", "NC", "OK", "SC", "TN", "TX", "VA", "WV"]}, //south
                {id:8, list:["AZ", "CA", "CO", "NV", "NM","UT"]} //southwest
               ]
            }
        }, //unitedStates
        {id:9, list:["AD","AN","BE","BV","CH","CS","DK","FO","FR","GI","GR","GS","HU","IE","IS","LI","LU","MC","MD","MK","MT","NL","NO","PL","PM","RE","RO","SE","SH","SI","SJ","SK","SM","TF","UA","VA","GG","JE","ME","RS","GG","JE","ME","RS","AT"]}, //europe
        {id:10, list:["UK", "IO", "VG", "IM", "GB"]}, //unitedKingdom
        {id:11, list:["DE"]}, //germany
        {id:12, list:["AS","AU","CX","CC","CK","FJ","PF","GU","HM","KI","MH","FM","NR","NC","NZ","NU","NF","MP","PW","PG","PN","WS","SB","TK","TO","TV","VU","WF"]}, //oceania
        {id:13, list:["AF","AM","AZ","BH","BD","BT","BN","KH","CN","CY","TL","HK","IN","ID","IQ","IL","JP","JO","KZ","KW","KG","LA","LB","MO","MY","MV","MN","NP","OM","PK","PS","PH","QA","SA","SG","KR","LK","TW","TJ","TH","TR","TM","AE","UZ","VN","YE","IR","KP","MM","NT","SY"]}, //asia
        {id:14, list:["DZ","AO","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CD","CI","DJ","EG","GQ","ER","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML","MR","MU","YT","MA","MZ","NA","NE","NG","RW","ST","SN","SC","SL","SO","ZA","SZ","TZ","TG","TN","UG","EH","ZM","ZW","SD","ZR"]}, //africa
        {id:15, list:["AI","AQ","AG","AR","AW","BS","BB","BZ","BO","BR","KY","CL","CO","CR","DM","DO","EC","SV","FK","GF","GD","GP","GT","GY","HT","HN","JM","MQ","MX","MS","NI","PA","PY","PE","PR","KN","LC","VC","SR","TT","TC","UY","VE","CU"]}, //scAmerica
        {id:16, list:["AL","BA","BG","BY","CZ","HR","RU","GE"]}, //eastEurope
        {id:17, list:["EE","FI","LT","LV","AX","AX"]}, //balticCtries
        {id:18, list:["ES"]}, //spain
        {id:19, list:["PT"]}, //portugal
        {id:20, list:["IT"]} //italy
    ];

    var splitGeoData = dfpGeo.split("&");
    var myLoc = {country : splitGeoData[0].split("=")[1], region : splitGeoData[1].split("=")[1]};

    var getLocId = function(myLoc) {
        var ret = 0;

        if(myLoc.country == "UM" || myLoc.country == "VI") {
            ret = 6;
        } else {
            outer:for(var i=0, l=loc.length; i<l; i++) {
                if(myLoc.country in loc[i].list) {
                    ret = loc[i].id, list = loc[i].list[myLoc.country];
                    for(var i3=0, l3=list.length; i3<l3; i3++) {
                        for(var zone in list[i3].list) {             
                            if(myLoc.region == list[i3].list[zone]) {
                                ret = list[i3].id;
                                break outer;
                            }
                        }
                    }
                } else {
                    for(var i2=0, l2=loc[i].list.length; i2<=l2; i2++) {
                        if(myLoc.country == loc[i].list[i2]) {
                            ret = loc[i].id;
                            break outer;
                        }
                    }
                }
            }
        }
        return ret;
    };

    return getLocId(myLoc);
})();
