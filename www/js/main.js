function toArray(elements){
	var values = [],key;
    if ($.isArray(elements)){
    	return elements;
    } else if ($.isObject(elements)){
        for (key in elements) {
        	values[key] = elements[key];
        }
    }
    return values;
}
function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
loadCss("css/ema.css");
loadCss("css/main.css");
loadCss("css/appframework.css");
loadCss("css/badges.css");
loadCss("css/buttons.css");
loadCss("css/lists.css");
loadCss("css/forms.css");
loadCss("css/grid.css");
loadCss("css/android.css");
loadCss("css/icons.css");
//requirejs.config({
//  baseUrl: 'js',
//  paths: {
//      phonegap:'../phonegap'
//  },
//	shim: {
//		'angular': {
//		  exports: 'angular'
//		}
//	}
//});
var os = '';
//var reqJs = ['appframework','appframework.ui','af.css3animate','af.scroller','af.desktopBrowsers','angular','controllers'];
//if(!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/))
//  reqJs = ['phonegap','appframework','appframework.ui','angular','controllers'];
//requirejs(reqJs,function($,_,angular){
//  
//});
//$.ui.splitview=false;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	document.addEventListener("backbutton", function(){return false;}, false);
	
	$( "#txtPwd" ).keypress(function( event ) {
	    if ( event.which === 13 ) {
	        $( "#btnLogin").click();
	    }
	});
	if($.os.android)
	    os='android';
	else if($.os.blackberry)
	    os='blackberry';
	else if($.os.webkit)
	    os='webkit';
	else if($.os.fennec)
	    os='fennec';
	else if($.os.ipad)
	    os='ipad';
	else if($.os.iphone)
	    os='iphone';
	else if($.os.webos)
	    os='webos';
	$.ui.autoLaunch = false;
	$.ui.openLinksNewTab = false;
	$(document).ready(function(){
    $.ui.launch();//portrait landscape
        
    });
}

var caseListScroll;
$.ui.ready(function(){
	//caseListScroll start
	caseListScroll = $('#caselist').scroller();
	caseListScroll.addInfinite();
    caseListScroll.addPullToRefresh();
    caseListScroll.runCB=true;
    var hideClose;
    $.bind(caseListScroll, "refresh-release", function () {
        var that = this;
        caseList();//reload case list
        clearTimeout(hideClose);
        hideClose = setTimeout(function () {
            that.hideRefresh();
        }, 1000);
        return false; //tells it to not auto-cancel the refresh
    });

    $.bind(caseListScroll, "refresh-cancel", function () {
        clearTimeout(hideClose);
    });
    caseListScroll.enable();
    
//  $.bind(caseListScroll, "infinite-scroll", function () {
//	    var self = this;
//	    console.log("infinite triggered");
//	    $(this.el).append("<div id='infinite' style='border:2px solid black;margin-top:10px;width:100%;height:20px'>Fetching content...</div>");
//	    $.bind(caseListScroll, "infinite-scroll-end", function () {
//	        $.unbind(caseListScroll, "infinite-scroll-end");
//	        self.scrollToBottom();
//	        setTimeout(function () {
//	            $(self.el).find("#infinite").remove();
//	            self.clearInfinite();
//	            $(self.el).append("<div>This was loaded via inifinite scroll<br>More Content</div>");
//	            self.scrollToBottom();
//	        }, 3000);
//	    });
//	});
	$("#caselist").css("overflow", "auto");
	//caseListScroll end
});

var logUsrUid,httpUrl = 'http://222.92.80.83:8034/plugin/edManagement/',
logWs,
logIsAudit,
logSchId,
logUserTypes,
logSchYear,
logWyCat,
logSegment,
logRatingColor,
logNeedUpgrade = 0
;

function verifyLogin(){
    $.query("#content,  #header, #navbar").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    $.ui.showMask("Login...");
    $("#txtName").attr('disabled','disabled');
    $("#txtPwd").attr('disabled','disabled');
    $("#btnLogin").val('Login...');
    $("#btnLogin").attr('disabled','disabled');
    
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=isAuth',
        data: {w:$("#txtWs").val(),u:$("#txtName").val(),p:$("#txtPwd").val(),o:os},
        crossDomain : true,
        dataType: 'json',
        timeout:5000,
        success: function (data) {
        	$.ui.enableSideMenu();
            if(data.r === "0"){
                $("#spName").html(data.n);
                $("#hdnSID").val(data.s);
                logUsrUid = data.uid;
                logWs = $("#txtWs").val();
                logIsAudit = data.isAudit;
                $.ui.loadContent('caselist',false,true,'flip');
                $.ui.hideMask();
                $.query(".afui_panel_mask").remove();
				localStorage.setItem("ws", $("#txtWs").val());
			    if($("#login_rem").is(':checked')){
			    	localStorage.setItem("username", $("#txtName").val());
					localStorage.setItem("password", $("#txtPwd").val());
					localStorage.setItem("login_rem", true);
			    }else
					localStorage.setItem("login_rem", false);
            }else{
            	if(data.m)
                	$.ui.showMask(data.m);
                else
                	$.ui.showMask('Login name or password error.');
                setTimeout('$.ui.hideMask(); $.query(".afui_panel_mask").remove();$("#hdnSID").val("");$("#btnLogin").val("Login");$("#txtName").removeAttr("disabled"); $("#txtPwd").removeAttr("disabled");$("#btnLogin").removeAttr("disabled");',2000);
            }
        },
        error:function(){
            $.ui.toggleSideMenu(false);
            $.ui.showMask("Connection Error!");
            setTimeout('$.ui.hideMask(); $.query(".afui_panel_mask").remove();$("#hdnSID").val("");$("#btnLogin").val("Login");$("#txtName").removeAttr("disabled"); $("#txtPwd").removeAttr("disabled");$("#btnLogin").removeAttr("disabled");',2000);
        }
    });
    return false;
}
function loadedLogin(what) {
    $.ui.handheldMinWidth = 9999;
    $.ui.disableSideMenu();
    if($("#hdnSID").val()){
        if(what.id == 'login'){
            $("#hdnSID").val("");
            $.ui.showMask("Login Out...");
            setTimeout('$.ui.hideMask();$("#btnLogin").val("Login");$("#txtName").removeAttr("disabled"); $("#txtPwd").removeAttr("disabled");$("#btnLogin").removeAttr("disabled");',2000);
        }
    }else{
        $.ui.loadContent('login',false,true,'flip');
        $.ui.toggleNavMenu(false);
    }
    //We are going to set the badge as the number of li elements inside the target
    $.ui.updateBadge("#tester", $("#af").find("li").length);
    
}
function caseList(){
	$.query(".afui_panel_mask").show();
	
	menuList();
	userInfo();
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=caseList',
        data: {w:logWs,u:logUsrUid},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        	scope = angular.element(document.getElementById('caselist')).scope();
        	scope.$apply(function() {
	  	        scope.cases = res.data;
	  	    });
	  	    $.query('#caselist_header_pageTitle').html('Case List ' + '<span class="af-badge" style="position:relative;top:5px;left:1px;background-color:#777;">'+res.totalCount+'</span>');
	  	    $.ui.scrollToTop('caselist');
        	$.query(".afui_panel_mask").remove();
        },
        error:function(){
        	$.query(".afui_panel_mask").remove();
        }
    });
}
function menuList(){
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=menuList',
        data: {w:logWs,u:logUsrUid,SCH_ID:'2'},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
	  	    scopeNav = angular.element(document.getElementById('caselist_side')).scope();
        	scopeNav.$apply(function() {
	  	        scopeNav.menus = res;
	  	        scopeNav.isAudit = logIsAudit;
	  	    }); 
        },
        error:function(){
        }
    });
}

function userList(obj){
	$("#userListSearch").val('');//clear search area
	$("#userListSearch").trigger('change');//trigger angular filter to reload data after clear the search area
	var wy_cat = obj.getAttribute('wy_cat');
	logWyCat = wy_cat;
	//load user list
	$.query(".afui_panel_mask").show();
	segmentInfo();
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=userList',
        data: {w:logWs,u:logUsrUid,SCH_ID:logSchId,WY_CATEGORY:wy_cat,SCH_YEAR:logSchYear},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
	  	    scopeUserList = angular.element(document.getElementById('userList')).scope();
        	scopeUserList.$apply(function() {
	  	        scopeUserList.users = res.data;
	  	        scopeUserList.ratcolor = logRatingColor;
	  	        $.ui.loadContent('userList',false,true,'flip');
				$.ui.scrollToTop('userList');
	  	        $.query('#userList_pageTitle').html(obj.innerHTML + ' List ' + '<span class="af-badge" style="position:relative;top:5px;left:1px;background-color:#777;">'+res.totalCount+'</span>');
	  	    }); 
        	$.query(".afui_panel_mask").remove();
        },
        error:function(){
        	$.query(".afui_panel_mask").remove();
        }
    });
}

function userInfo(){
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=userInfo',
        data: {w:logWs,u:logUsrUid},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        	logSchId = res.SCH_IDS;
        	logUserTypes = res.USER_TYPES;
        	logSchYear = res.SCH_YEAR;
        	logRatingColor = res.RATING_COLORS;
        },
        error:function(){
        }
    });
}

function segmentInfo(){
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=segmentList',
        data: {w:logWs,WY_CATEGORY:logWyCat},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        	logSegment = res;
        },
        error:function(){
        }
    });
}

function tagList(obj){
	var sUsrUid = obj.getAttribute('data-usruid');
	var iSchId = obj.getAttribute('data-schid');
	//load user list
	$.query(".afui_panel_mask").show();
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=tagList',
        data: {w:logWs,u:sUsrUid,SCH_ID:iSchId,WY_CATEGORY:logWyCat,SCH_YEAR:logSchYear},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        	res.data[0].RATING_COLORS = eval('logRatingColor.'+res.data[0].RATING+'.RAT_COLOR');
        	segments = renderFormTag(res.data[0], logSegment);
	  	    scopeTagList = angular.element(document.getElementById('tagList')).scope();
        	scopeTagList.$apply(function() {
  	  	        scopeTagList.segments = segments;
  	  	        scopeTagList.tags = res.data[0];
  	  	        $.ui.loadContent('tagList',false,true,'flip');
  				$.ui.scrollToTop('tagList');
  	  	        $.query('#tagList_pageTitle').html(res.data[0].USR_FIRSTNAME + ' ' + res.data[0].USR_LASTNAME);
	  	    }); 
        	$.query(".afui_panel_mask").remove();
        },
        error:function(){
        	$.query(".afui_panel_mask").remove();
        }
    });
}

function assignBtn(obj){
	console.log(obj);
}

function renderFormTag(oRecord, oSegs) {
	console.log((oRecord));
	var aRecord = toArray(oRecord);
	for(var i in oSegs){
		var tags = '';
  		var seg = aRecord[oSegs[i].SEG_SEM_UID];
  	    var formTags = seg.split(',');    
  	    for(var j=0; j< formTags.length; j++){
  	        var formInfo = formTags[j].split('_');
  	        var fontStyle = 'cursor:pointer;';
            if(formInfo[1] == 1){
                fontStyle += 'font-style:italic;';
            }
            var color = formInfo[0]=='TODO'?'black':(formInfo[0]=='ING'?'green':'red');
            if(formInfo[0] == 'TODO' && formInfo[1] == 1){
                color = 'blue';
            }
            var delStyle = 'text-decoration: none;';
            var dataIndex = oSegs[i].SEG_NAME;
            if( formInfo[2] == 0 || (formInfo[0] == 'TODO' && ((aRecord['RATING'] == 'U' || (aRecord['RATING'] == 'N' && aRecord['IS_NEXTYEAR'] == 1))) && dataIndex != 'TNI' && dataIndex != 'TUS')){
                delStyle = 'text-decoration: line-through; color: red;';
            }
  	        if(formInfo[3]){
	  	        tags += '<div class="form-tag-div" onclick="caseInfo(this);" '+
	  	        'data-USR_UID="'+aRecord['USR_UID']+'" '+
	  	        'data-TAG="'+formTags+'" '+
	  	        'data-HAVE_UPGRADE="'+aRecord['HAVE_UPGRADE']+'" '+
	  	        'data-WY_UID="'+aRecord['WY_UID']+'" '+
	  	        'style="'+fontStyle+'">' +
	  	        '<span style="'+delStyle+'">'+
	  	        '<span style="color:'+color+';font-weight:bold;" >' + formInfo[3] + '</span>'+
	  	        '</span>' +
	  	        '</div>'
	  	        ;
  	        }
  	    }
    	oSegs[i].sTag = tags;
	}
    return oSegs;
}

function caseInfo(obj){
//	$.query("#content,  #header, #navbar").append('<div class="afui_panel_mask"></div>');
//	$.query(".afui_panel_mask").show();
	var sUsrUid = obj.getAttribute('data-USR_UID');
	var iHaveUpgrade = obj.getAttribute('data-HAVE_UPGRADE');
	var sTag = obj.getAttribute('data-TAG');
	var sWyUid = obj.getAttribute('data-WY_UID');
	
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=getCaseInfo',
        data: {w:logWs,
        	USR_UID: sUsrUid,
            TAG : sTag,
            TYPE: logWyCat,
            SCH_YEAR: logSchYear,
            SCH_ID: logSchId,
            HAVE_UPGRADE: iHaveUpgrade,
            NEED_UPGRADE: logNeedUpgrade,
            WY_UID: sWyUid,
            CANT_START: 0,
            USER_ROLE : 'EDMGR_PRINCIPAL'
        },
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        	res.data[0].RATING_COLORS = eval('logRatingColor.'+res.data[0].RATING+'.RAT_COLOR');
        	segments = renderFormTag(res.data[0], logSegment);
	  	    scopeTagList = angular.element(document.getElementById('tagList')).scope();
        	scopeTagList.$apply(function() {
  	  	        scopeTagList.segments = segments;
  	  	        scopeTagList.tags = res.data[0];
  	  	        $.ui.loadContent('tagList',false,true,'flip');
  				$.ui.scrollToTop('tagList');
  	  	        $.query('#tagList_pageTitle').html(res.data[0].USR_FIRSTNAME + ' ' + res.data[0].USR_LASTNAME);
	  	    }); 
        	$.query(".afui_panel_mask").remove();
        },
        error:function(){
        	$.query(".afui_panel_mask").remove();
        }
    });
	
//	$.ui.loadContent('caseInfo',false,true,'flip');
}
