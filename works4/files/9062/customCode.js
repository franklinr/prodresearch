/* Last Updated 23 Feb 2012 */
// -------------------------------------------------------------------
// Madgex Limited
// Copyright (c) 2006-2007 Madgex Limited. All Rights Reserved.
// JobAdvertWidget, version 1.1
// Glenn Jones
// 18 June 2007
// -------------------------------------------------------------------

var baseCSSLoaded = true;

function JobAdvertWidget(objectName) {
	var me;
	var data;

	if (this.constructor == JobAdvertWidget) {
		me = this;
	} else {
		me = arguments[arguments.length - 1];
	}

	// Public properties
	me.dataUrl = ''; 					// The Json data url
	me.insertIntoId = ''; 				// String id of dom node to insert widget into
	me.insertAfterId = ''; 				// String id of dom node to insert widget after
	me.title = ''; 						// The widget title;
	me.jobNumber = 3; 					// Number of jobs [0-20];
	me.truncateDescription = 250; 		// The number of charters display in the description
	me.displayTitle = true; 				// Display the title
	me.displaySearch = true; 			// Display the search feature
	me.display = {
		Description: true, 				//Display the job description
		Location: true, 				//display the LocationDescription
		SalaryDescription: true			//display the SalaryDescription
	};
	me.cssUrl = ''; 						// CSS Url
	me.breakChar = '-'; 					// The break char
	me.searchInputWidth = '13em'; 		    // The width property of the search input box

	// Internal properties
	me.objectName = objectName;
	me.insertNode;
	me.afterNode;
	me.containingNode;
	me.siteUrl = '';
	me.baseCSSUrl = '';
	me.detailUrl = '';
	me.SearchUrl = '';
	me.keywordField = "keywords";
	me.formVerb = "get";
	me.listeners = [];
	me.h3Hide = 4;	// the HeadingAndUrl in all_mapping_variables.js value that needs to be hide 
	me.footerLabelHide = 4; // the HeadingAndUrl in all_mapping_variables.js value that needs to be hide 


	me.config = function(jsonData) {
		me.setURls();
		if (me.cssUrl != '') {
			me.addCSS(me.cssUrl);
		}
		else if (baseCSSLoaded == false) {
			me.addCSS(me.baseCSSUrl);
			baseCSSLoaded = true;
		}

		if (document.getElementById) {
			if (!document.location.href.indexOf("file:///") > -1) {
				me.addScript(me.dataUrl + (me.dataUrl.indexOf('?') > -1 ? '&' : '?') + 'callback=' + objectName + '.loadJobData' + '&WidgetDomain=' + location.hostname);
			}
		}
	}

	me.loadJobData = function(jsonData) {
		data = jsonData.JobAdverts;
		me.siteUrl = data.SiteURL + '/';
		me.setURls();
		me.build();
	}

	me.setURls = function() {
		me.baseCSSUrl = me.siteUrl + 'jobadvertwidget.css';
		me.detailUrl = me.siteUrl + 'job/';
		me.SearchUrl = me.siteUrl + 'searchjobs/';
	}

	me.build = function() {
		if (me.insertAfterId != '' || me.insertIntoId != '') {

			me.containingNode = document.createElement('div');
			me.containingNode.setAttribute('id', me.objectName);
			me.containingNode.className = 'jobAdvertWidget';

			if (me.displayTitle)
				me.buildTitle();
			if (me.displaySearch)
				me.containingNode.appendChild(me.buildForm());
			if (me.jobNumber > data.Jobs.length)
				me.jobNumber = data.Jobs.length;
			for (var i = 0; i < me.jobNumber; i++) {
				me.buildJobItem(data.Jobs[i]);
			}
			me.buildFooterLinks();


			if (me.insertAfterId != '') {
				me.afterNode = document.getElementById(me.insertAfterId);
				me.insertAfter(me.afterNode.parentNode, me.containingNode, me.afterNode);
			} else if (me.insertIntoId != '') {
				me.insertNode = document.getElementById(me.insertIntoId);
				me.insertNode.appendChild(me.containingNode);
			} else {
				document.write(me.containingNode.innerHtml);
			}
		}

	}

	me.buildTitle = function() {

		if (me.title != '') {
			var h3 = document.createElement('h3');
			h3.appendChild(document.createTextNode(me.title));
			me.containingNode.appendChild(h3);
		}
	}

	me.buildForm = function() {

		var form = document.createElement('form');
		var fieldset = document.createElement('fieldset');
		form.setAttribute('action', me.SearchUrl);
		form.setAttribute('method', me.formVerb);

		var textInput = document.createElement('input');
		textInput.setAttribute('id', 'keyword');
		textInput.setAttribute('name', 'keyword');
		textInput.setAttribute('type', 'text');
		textInput.setAttribute('name', me.keywordField);
		textInput.setAttribute('width', me.searchInputWidth);
		fieldset.appendChild(textInput);

		var hiddenInput = document.createElement('input');
		hiddenInput.setAttribute('type', 'hidden');
		hiddenInput.setAttribute('name', 'widget');
		hiddenInput.setAttribute('value', 'true');
		fieldset.appendChild(hiddenInput);

		var submit = document.createElement('input');
		submit.setAttribute('id', 'Search');
		submit.setAttribute('type', 'submit');
		submit.setAttribute('value', 'go');
		submit.setAttribute('name', 'Search');
		fieldset.appendChild(submit);

		form.appendChild(fieldset);

		return form;
	}


	me.buildJobItem = function(Job) {
		var a = document.createElement('a');
		a.setAttribute('href', Job.DetailsUrl);
		a.setAttribute('target', '_blank');
		a.appendChild(document.createTextNode(Job.Title));
		me.containingNode.appendChild(a);

		var description
		if (Job.Description.length > me.truncateDescription)
			description = Job.Description.substr(0, 50) + '\u2026';
		else
			description = Job.Description;

		var ul = document.createElement('ul');
		ul.appendChild(me.buildLI(description + ' ' + me.breakChar, 'madgexJobsWidgetJobDesc'));
		ul.appendChild(me.buildLI(Job.SalaryDescription + ' ' + me.breakChar));
		ul.appendChild(me.buildLI(Job.Location));
		me.containingNode.appendChild(ul);

	}

	me.buildLI = function(text, theclass) {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(text));
		if (typeof (theclass) != 'undefined' && theclass != '') {
			li.className = theclass;
		}
		return li
	}

	me.buildFooterLinks = function() {

	}

	me.addScript = function(url) {
		newScript = document.createElement("script");
		newScript.setAttribute('id', 'tackerloadimg');
		newScript.setAttribute("type", "text/javascript");
		newScript.setAttribute("charset", "utf-8");
		if (url.indexOf('?') > -1)
			url += '&';
		else
			url += '?';
		url += 'rand=' + Math.random()
		newScript.setAttribute("src", url);
		document.getElementsByTagName('head')[0].appendChild(newScript);
		return newScript;
	}

	me.addCSS = function(url) {
		var newCSS = document.createElement("link");
		newCSS.setAttribute('rel', "stylesheet");
		newCSS.setAttribute('media', "all");
		newCSS.setAttribute('type', "text/css");
		if (url.indexOf('?') > -1)
			url += '&';
		else
			url += '?';

		url += 'rand=' + Math.random()

		//james suggestion newCSS.setAttribute('href', '/JBV2Web/widget/' + url);

		newCSS.setAttribute('href', url);
		document.getElementsByTagName('head')[0].appendChild(newCSS);
	}

	me.addEvent = function(elm, evType, fn, useCapture) {
		// Updated version which captures passed events 
		if (elm.AddEventListener) {
			elm.AddEventListener(evType, fn, useCapture);
			return true;
		} else if (elm.attachEvent) {
			var r = elm.attachEvent('on' + evType, fn);
			me.listeners[me.listeners.length] = [elm, evType, fn];
			return r;
		} else {
			var xEventFn = elm['on' + evType];
			if (typeof elm['on' + evType] != 'function') {
				elm['on' + evType] = fn;
			} else {
				elm['on' + evType] = function(e) { xEventFn(e); fn(e); };
			}
		}
	}

	me.insertAfter = function(parent, node, referenceNode) {
		parent.insertBefore(node, referenceNode.nextSibling);
	}

	me.addEvent(window, 'load', me.config, false)
}

// An Inherited version 2
// ---------------------------------------------------------------------
function JobAdvertWidget2(objectName) {
	var me;
	if (this.constructor == JobAdvertWidget2) {
		me = this;
	} else {
		me = arguments[arguments.length - 1];
	}
	JobAdvertWidget(objectName, me);
	me.breakChar = '|';

	// Override
	me.buildFooterLinks = function() {
		var p = document.createElement('p');
		var a = document.createElement('a');
		a.setAttribute('href', me.siteUrl + 'jobs/');
		a.setAttribute('target', '_blank');
		a.appendChild(document.createTextNode('Browse'));
		p.appendChild(a);
		me.containingNode.appendChild(p);
	}

	// Override
	me.buildJobItem = function(Job) {
		var a = document.createElement('a');

		a.setAttribute('href', Job.DetailsUrl);
		a.setAttribute('target', '_blank');
		a.appendChild(document.createTextNode(Job.Title));
		me.containingNode.appendChild(a);

		var ul = document.createElement('ul');
		ul.appendChild(me.buildLI(Job.SalaryDescription + ' ' + me.breakChar));
		ul.appendChild(me.buildLI(Job.Location));
		me.containingNode.appendChild(ul);

	}
}
Inherit(JobAdvertWidget, JobAdvertWidget2)



// An Inherited version 3
// ---------------------------------------------------------------------
function JobAdvertWidget3(objectName) {
	var me;
	if (this.constructor == JobAdvertWidget3) {
		me = this;
	} else {
		me = arguments[arguments.length - 1];
	}

	JobAdvertWidget2(objectName, me);


	// Override
	me.buildFooterLinks = function() {
		var p = document.createElement('p');

		var a1 = document.createElement('a');
		a1.setAttribute('href', me.siteUrl + 'profile/');
		a1.appendChild(document.createTextNode('Upload your CV'));
		p.appendChild(a1);

		p.appendChild(document.createTextNode(' and '));

		var a2 = document.createElement('a');
		a2.setAttribute('href', me.siteUrl + 'alerts/');
		a.setAttribute('target', '_blank');
		a2.appendChild(document.createTextNode('get jobs by email'));
		p.appendChild(a2);

		p.appendChild(document.createTextNode('.'));
		me.containingNode.appendChild(p);
	}
}

Inherit(JobAdvertWidget2, JobAdvertWidget3)

function MadgexJobWidget(objectName) {
	var me;
	if (this.constructor == MadgexJobWidget) {
		me = this;
	} else {
		me = arguments[arguments.length - 1];
	}

	JobAdvertWidget(objectName, me);

	me.config = function(jsonData) {
		me.setURls();
		if (me.cssUrl != '') {
			me.addCSS(me.cssUrl);
		}
		else if (baseCSSLoaded == false) {
			me.addCSS(me.baseCSSUrl);
			baseCSSLoaded = true;
		}

		if (document.getElementById) {
			if (!document.location.href.indexOf("file:///") > -1) {
				me.addScript(me.dataUrl + (me.dataUrl.indexOf('?') > -1 ? '&' : '?') + 'callback=' + objectName + '.loadJobData');
			}
		}
	}

	me.loadJobData = function(jsonData) {
		data = jsonData.JobAdverts;
		me.siteUrl = data.SiteURL + '/';
		me.setURls();
		me.build();
	}

	me.setURls = function() {
		me.baseCSSUrl = me.siteUrl + 'jobadvertwidget.css';
		me.detailUrl = me.siteUrl + 'job/';
		me.SearchUrl = me.siteUrl + 'searchjobs/';
	}

	me.build = function() {
		me.containingNode = document.createElement('div');
		me.containingNode.className = me.objectName;

		if (me.displayTitle)
			me.buildTitle();
		if (me.displaySearch)
			me.containingNode.appendChild(me.buildForm());
		if (me.jobNumber > data.Jobs.length)
			me.jobNumber = data.Jobs.length;
		for (var i = 0; i < me.jobNumber; i++) {
			me.buildJobItem(data.Jobs[i]);
		}
		me.buildFooterLinks();

		var inserted = false;

		if (me.insertAfterId != '') {
			me.afterNode = document.getElementById(me.insertAfterId);
			if (me.afterNode != null) {
				me.insertAfter(me.afterNode.parentNode, me.containingNode, me.afterNode);
				inserted = true;
			}
		} else if (me.insertIntoId != '') {
			me.insertNode = document.getElementById(me.insertIntoId);
			if (me.insertNode != null) {
				me.insertNode.appendChild(me.containingNode);
				inserted = true;
			}
		}

		if (!inserted) {
			var scr = document.getElementById('MadgexJobWidgetScript');
			scr.parentNode.insertBefore(me.containingNode, scr);
		}
	}

	me.buildTitle = function() {

		if (me.title != '') {
			var titleDiv = document.createElement('div');
			titleDiv.className = 'madgexJobsWidgetTitle';

			var a = document.createElement('a');
			a.setAttribute('href', me.siteUrl);

			var img = document.createElement('img');
			img.setAttribute('src', me.siteUrl + 'images/logo-jobsSm.gif');
			img.setAttribute('alt', me.displayTitle);

			a.appendChild(img);

			titleDiv.appendChild(a);
			me.containingNode.appendChild(titleDiv);
		}
	}

	// Override
	me.buildJobItem = function(Job) {
		var ul = document.createElement('ul');

		var li = document.createElement('li');
		var a = document.createElement('a');

		//Title + link
		a.setAttribute('href', Job.DetailsUrl);
		a.setAttribute('target', '_blank');
		a.appendChild(document.createTextNode(Job.Title));
		me.containingNode.appendChild(a);
		li.appendChild(a);
		ul.appendChild(li);

		//Salary
		if (me.display.SalaryDescription && Job.SalaryDescription != "")
			ul.appendChild(me.buildLI("Salary: " + Job.SalaryDescription));

		//Location
		if (me.display.Location && Job.Location != "")
			ul.appendChild(me.buildLI("Location: " + Job.Location));

		//Description
		var description;
		var trunc = !isNaN(parseInt(me.truncateDescription)) ? me.truncateDescription * 1 : 0;
		if (trunc > 0 && Job.Description.length > trunc) {
			description = Job.Description.substr(0, trunc) + '\u2026';
		} else {
			description = Job.Description;
		}
		if (me.display.Description && trunc > 0) {
			ul.appendChild(me.buildLI(description, 'madgexJobsWidgetJobDesc'));
		}


		me.containingNode.appendChild(ul);
	}
}

Inherit(JobAdvertWidget, MadgexJobWidget)

function Inherit(base, derived) {
	for (var i in base.prototype) {
		eval('derived.prototype.' + i + '= base.prototype.' + i)
	}
}

// -------------------------------------------------------------------
// Wiley Jobs Overwrite
// -------------------------------------------------------------------
function WileyJobWidget(objectName) {
	var me;
	if (this.constructor == WileyJobWidget) {
		me = this;
	} else {
		me = arguments[arguments.length - 1];
	}

	MadgexJobWidget(objectName, me);
	
	// Public properties
	me.zoneId = ''; 					// Zone ID For Mapping
		
	// Override
	me.build = function() {
		var tmpArray = new Object();
		var randmoResult;
	
		me.containingNode = document.createElement('div');
		me.containingNode.className = 'madgexJobsWidget';
		
		// Amended by Swee Kiang				
		me.buildWileyTitle();	
		if (data.Jobs.length > 0) {
			if (me.displaySearch)
				me.containingNode.appendChild(me.buildForm());
			if (me.jobNumber > data.Jobs.length)
				me.jobNumber = data.Jobs.length;			
			for (var i = 0; i < me.jobNumber; i++) {
				randmoResult = Math.floor(Math.random()*(data.Jobs.length));
				while (tmpArray[randmoResult] == "value exisit") {
					randmoResult = Math.floor(Math.random()*(data.Jobs.length));
				}
				tmpArray[randmoResult] = "value exisit";
				me.buildJobItem(data.Jobs[randmoResult]);
			}
			me.buildWileyFooterLinks();
		}
		else {
			me.buildNoJobsData();
		}

		var inserted = false;

		if (me.insertAfterId != '') {
			me.afterNode = document.getElementById(me.insertAfterId);
			if (me.afterNode != null) {
				me.insertAfter(me.afterNode.parentNode, me.containingNode, me.afterNode);
				inserted = true;
			}
		} else if (me.insertIntoId != '') {
			me.insertNode = document.getElementById(me.insertIntoId);
			if (me.insertNode != null) {
				me.insertNode.appendChild(me.containingNode);
				inserted = true;
			}
		}

		if (!inserted) {
			var scr = document.getElementById('MadgexJobWidgetScript');
			scr.parentNode.insertBefore(me.containingNode, scr);
		}
	}
	
	// Added by Swee Kiang
	me.buildWileyTitle = function() {
		if (me.displayTitleLink != '') {
			var titleDiv = document.createElement('div');
			titleDiv.className = 'madgexJobsWidgetTitle';
			
			var h2 = document.createElement('h2');			
			var ah2 = document.createElement('a');
			ah2.setAttribute('href', "http://www.wileyjobnetwork.com");
			ah2.setAttribute('target', "_blank");
			ah2.appendChild(document.createTextNode('Wiley Job Network'));
			h2.appendChild(ah2);
			titleDiv.appendChild(h2);
			
			if (getZoneHeading(me.zoneId) != me.h3Hide) {
				var h3 = document.createElement('h3');			
				var ah3 = document.createElement('a');
				ah3.setAttribute('href', "http://" + getJobDomain(me.zoneId, 1));
				ah3.setAttribute('target', "_blank");
				ah3.appendChild(document.createTextNode(getJobDomain(me.zoneId, 0)));
				h3.appendChild(ah3);
				titleDiv.appendChild(h3);			
			}
			
			me.containingNode.appendChild(titleDiv);
		}
	}	
	
	// Added by Swee Kiang
	me.buildNoJobsData = function() {
			var noJobsDiv = document.createElement('div');
			noJobsDiv.className = 'wileyJobNoJob';
	
			var pDesc = document.createElement('p');			
						
			var a = document.createElement('a');
			a.setAttribute('href', "http://" + getJobDomain(me.zoneId, 1));
			a.setAttribute('target', "_blank");
			a.appendChild(document.createTextNode('Search thousands of jobs on the Wiley Job Network'));

			pDesc.appendChild(a);
			
			noJobsDiv.appendChild(pDesc);
			
			me.containingNode.appendChild(noJobsDiv);
	}	
	
	// Added by Swee Kiang
	me.buildWileyFooterLinks = function() {
		var p = document.createElement('p');
		
		var a = document.createElement('a');
		a.setAttribute('href', "http://" + getJobDomain(me.zoneId, 1));
		a.setAttribute('target', "_blank");

		var footerSectionDesc = "Jobs";
		if (getZoneHeading(me.zoneId) != me.footerLabelHide) {
			footerSectionDesc = getJobDomain(me.zoneId, 0);
		}
		a.appendChild(document.createTextNode('Find more ' + footerSectionDesc + ' \u00bb'));
		
		p.appendChild(a);
		
		me.containingNode.appendChild(p);
	}	
}

Inherit(MadgexJobWidget, WileyJobWidget)