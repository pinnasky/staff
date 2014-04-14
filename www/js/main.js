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
$.ui.splitview=false;
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
//  $.bind(caseListScroll, 'scrollend', function () {
//      console.log("scroll end");
//  });
//
//  $.bind(caseListScroll, 'scrollstart', function () {
//      console.log("scroll start");
//  });
//  $.bind(caseListScroll,"scroll",function(position){
//      
//  })
//  $.bind(caseListScroll, "refresh-trigger", function () {
//      console.log("Refresh trigger");
//  });
    var hideClose;
    $.bind(caseListScroll, "refresh-release", function () {
        var that = this;
//      console.log("Refresh release");
        caseList();//reload case list
        clearTimeout(hideClose);
        hideClose = setTimeout(function () {
//          console.log("hiding manually refresh");
            that.hideRefresh();
        }, 1000);
        return false; //tells it to not auto-cancel the refresh
    });

    $.bind(caseListScroll, "refresh-cancel", function () {
        clearTimeout(hideClose);
//      console.log("cancelled");
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

function toggleSideMenu(){
    //if($("#hdnSID").val())
        af.ui.toggleSideMenu();
}
var logUsrUid,httpUrl = 'http://222.92.80.83:8034/plugin/edManagement/',logWs,logIsAudit;
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
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=caseList',
        data: {w:logWs,u:logUsrUid},
        crossDomain : true,
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        	scope = angular.element(document.getElementById('caselist')).scope();
        	scope.$apply(function() {
	  	        scope.cases = res.data;
	  	    });
//	  	    scopeNav = angular.element(document.getElementById('caselist_side')).scope();
//      	scopeNav.$apply(function() {
//	  	        scopeNav.menus = res.menu.menu;
//	  	        scopeNav.menu_roots = res.menu.menu_root;
//	  	    });
        	$.query(".afui_panel_mask").hide();
        },
        error:function(){
        	$.query(".afui_panel_mask").hide();
        }
    });
}
function menuList(){
	$.query(".afui_panel_mask").show();
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=menuList',
        data: {w:logWs,u:logUsrUid},
        crossDomain : true,
        dataType: 'json',
        timeout:5000,
        success: function (res) {
	  	    scopeNav = angular.element(document.getElementById('caselist_side')).scope();
        	scopeNav.$apply(function() {
	  	        scopeNav.menus = res;
	  	        scopeNav.isAudit = logIsAudit;
	  	    }); 
        	$.query(".afui_panel_mask").hide();
        },
        error:function(){
        	$.query(".afui_panel_mask").hide();
        }
    });
}

function userList(obj){
	console.log(obj);
	console.log(obj.getAttribute('cat_id'));
	$.ui.loadContent('userList',false,true,'flip');
	//load user list
	$.query(".afui_panel_mask").show();
	$.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=userList',
        data: {w:logWs,u:logUsrUid,SCH_ID:'2',WY_CATEGORY:'NT',SCH_YEAR:'2013-2014',USER_TYPE:'TEACHER'},
        crossDomain : true,
        dataType: 'json',
        timeout:5000,
        success: function (res) {
        		console.log(res);
	  	    scopeUserList = angular.element(document.getElementById('userList')).scope();
        	scopeUserList.$apply(function() {
	  	        scopeUserList.users = res;
	  	        $.ui.loadContent('userList',false,true,'flip');
	  	    }); 
        	$.query(".afui_panel_mask").hide();
        },
        error:function(){
        	$.query(".afui_panel_mask").hide();
        }
    });
	
	
}