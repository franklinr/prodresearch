/* Last Updated 23 Feb 2012 */

function getParamMappingCode(passInId, parameterName, mappingVar) {
	var mapIdArray = mappingVar[passInId];

	var paramPairs = "";
	if (mapIdArray) {
		for (var i=0; i<mapIdArray.length; i++) {
			paramPairs += parameterName + "=" + mapIdArray[i] + "&";
		}
	}
	
	return paramPairs;
}

function getZoneHeading(zoneId) {
	var sectorArray = wileyJobs.mapping.busSector[zoneId];
	if (sectorArray) {
		for (var i=0; i < sectorArray.length;i++) {
			if (wileyJobs.mapping.zoneHeading[sectorArray[i]]) {
				return wileyJobs.mapping.zoneHeading[sectorArray[i]];
			}
		}
	}
	
	return wileyJobs.mapping.zoneHeading["undefined"];
}

function getJobDomain(zoneId, arrayPosition) {	
	return wileyJobs.mapping.headingAndUrl[getZoneHeading(zoneId)][arrayPosition];	
}