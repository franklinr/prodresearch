  /* Last Updated 23rd Sept 2011 */    
  madgexJobsWidget = new WileyJobWidget( 'madgexJobsWidget' );
  madgexJobsWidget.dataUrl = "http://" + getJobDomain(dfpZoneID, 1) + "///jobsjson/?NumDisplayResults=50&" + getParamMappingCode(dfpZoneID, 'Sector', wileyJobs.mapping.busSector) + getParamMappingCode(wileyJobs.currentLocationID, 'Location', wileyJobs.mapping.madgexLocId);
  madgexJobsWidget.insertAfterId = 'wileyJobWidget';  
  madgexJobsWidget.truncateDescription = 125;
  madgexJobsWidget.displaySearch = false;  
  madgexJobsWidget.jobNumber = 5;
  madgexJobsWidget.zoneId = dfpZoneID;  