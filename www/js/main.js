String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, i) {
      return typeof args[i] != 'undefined' ? args[i] : match;
    });
};

window.addEventListener('message',function(e){
if(e.data!='afm-asap'){
    var oRes = $.parseJSON(e.data);
    if($('#form_post_type')) $('#form_post_type').val(oRes.POST_TYPE);
    switch (oRes.POST_TYPE){
        case 'save':
            saveOK(oRes);
            break;
        case 'submit':
            submitOK(oRes);
            break;
        case 'derivation':
            derivateOK(oRes);
            break;
        default :
        //TODO
    }
}
},false);

String.format = function(template) {
    if(0 == arguments.length) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return String.prototype.format.apply(template, args);
}
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
function evalJs( jsCode ){
    var scpt = document.getElementById('scpt_form_js')
    if(!scpt){
        var scpt = document.createElement('script');
        scpt.id = 'scpt_form_js';
    }
    var head = document.getElementsByTagName('head')[0]; 
    scpt.text += jsCode;   
    head.insertBefore( scpt ,head.lastChild );   
    head.removeChild( scpt );   
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
// loadCss("css/forms.css");
loadCss("css/grid.css");
loadCss("css/android.css");
loadCss("css/icons.css");
loadCss("view/ui/bootstrap.css");

//requirejs.config({
//  baseUrl: 'js',
//  paths: {
//      phonegap:'../phonegap'
//  },
//  shim: {
//      'angular': {
//        exports: 'angular'
//      }
//  }
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
$("#txtPwd").keypress(function( event ) {
    if ( event.which === 13 ) {
        $( "#btnLogin").click();
    }
});
$("#txtName").keypress(function( event ) {
    if ( event.which === 13 ) {
        $( "#btnLogin").click();
    }
});
function onDeviceReady() {
    document.addEventListener("backbutton", function(){return false;}, false);
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
//      var self = this;
//      console.log("infinite triggered");
//      $(this.el).append("<div id='infinite' style='border:2px solid black;margin-top:10px;width:100%;height:20px'>Fetching content...</div>");
//      $.bind(caseListScroll, "infinite-scroll-end", function () {
//          $.unbind(caseListScroll, "infinite-scroll-end");
//          self.scrollToBottom();
//          setTimeout(function () {
//              $(self.el).find("#infinite").remove();
//              self.clearInfinite();
//              $(self.el).append("<div>This was loaded via inifinite scroll<br>More Content</div>");
//              self.scrollToBottom();
//          }, 3000);
//      });
//  });
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
logNeedUpgrade = 0,
logUserRole
;
/************************ Handel Form Events ***********************************/
function openCase(obj){
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    var sAppNumber = obj.getAttribute('data-app_number');
    var sAppTitle = obj.getAttribute('data-app_title');
    var sAppUid = obj.getAttribute('data-app_uid');
    var iDelIndex = obj.getAttribute('data-del_index');
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=openCase',
        data: {w:logWs,u:logUsrUid,APP_UID:sAppUid,DEL_INDEX:iDelIndex},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            $('#case_save_form').attr('action',httpUrl+'appDo/ema.php?action='+res.FORM_ACTION);
            scopeRunCase = angular.element($('#openCase')).scope();
            scopeRunCase.$apply(function() {
                scopeRunCase.sFormContent = res.DYNAFORM;
                scopeRunCase.sAppUid = res.APP_UID;
                scopeRunCase.iDelIndex = res.DEL_INDEX;
                scopeRunCase.iPosition = res.POSITION;
                scopeRunCase.sProUid = res.PRO_UID;
                if(res.PREVIOUS_STEP){
                    scopeRunCase.sPreviousStep = '';
                    scopeRunCase.sPreviousStepUrl = res.PREVIOUS_STEP;
                }
                else{
                    scopeRunCase.sPreviousStep = 'none';
                    scopeRunCase.sPreviousStepUrl = '';
                }
                //assign value
                for( key in res.FORM_VARS){
                    eval('scopeRunCase.'+key+'="'+res.FORM_VARS[key]+'"');
                }
                $.ui.showModal("#openCase","fade");
                $.ui.scrollToTop('openCase');
                $('#modalHeader > header > h1').attr('style','overflow:visible;');
                $('#modalHeader > header > h1').html('<span style="font-size:14px;">Case #: '+sAppNumber + '&nbsp;&nbsp;&nbsp;' + sAppTitle + '</span>');
                $.query(".afui_panel_mask").remove();
            });
            evalJs(res.FORM_JS);
        },
        error:function(){
            $.query(".afui_panel_mask").remove();
        }
    });
}

function openCase_before(){
}
function openCase_after(){
    //clear form content
    scopeRunCase = angular.element($('#openCase')).scope();
    scopeRunCase.$apply(function() {
        scopeRunCase.sFormContent = '';
    });
    //business function after close form modal
    var sPostType = $('#form_post_type').val();
    switch (sPostType){
        case 'save':
            caseList(0);
            break;
        case 'derivation':
            caseList(0);
            break;
        default :
    }
    $.query('#form[btnSave]').removeClass('disabled');
    $.query('#form[btnSubmit]').removeClass('disabled');
    $.query('#btnContinue').removeClass('disabled');
    $('#modalHeader > header > a').attr('style','');
}

function submitForm(){
    document.getElementById("case_save_form").submit();
    $.query('#form[btnSave]').addClass('disabled');
    $.query('#form[btnSubmit]').addClass('disabled');
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
}

function submitOK(res){
    var modal = $.query('#modalContainer > div')[0];
    modal.setAttribute('style','transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);-webkit-transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    $('#case_save_form').attr('action',httpUrl+'appDo/ema.php?action='+res.FORM_ACTION);
    scopeSubmitOk = angular.element($('#openCase')).scope();
    scopeSubmitOk.$apply(function() {
        scopeSubmitOk.sFormContent = res.DYNAFORM;
        scopeSubmitOk.sAppUid = res.APP_UID;
        scopeSubmitOk.iDelIndex = res.DEL_INDEX;
        scopeSubmitOk.iPosition = res.POSITION;
        scopeSubmitOk.sProUid = res.PRO_UID;
        if(res.PREVIOUS_STEP){
            scopeSubmitOk.sPreviousStep = '';
            scopeSubmitOk.sPreviousStepUrl = res.PREVIOUS_STEP;
        }
        else{
            scopeSubmitOk.sPreviousStep = 'none';
            scopeSubmitOk.sPreviousStepUrl = '';
        }
        //assign value
        for( key in res.FORM_VARS){
            eval('scopeSubmitOk.'+key+'="'+res.FORM_VARS[key]+'"');
        }
        $('#modalHeader > header > h1').attr('style','overflow:visible;');
        $.query(".afui_panel_mask").remove();
    });
    evalJs(res.FORM_JS);
}

function derivateForm(){
    document.getElementById("case_save_form").submit();
    $.query('#btnContinue').addClass('disabled');
    $('#modalHeader > header > a').attr('style','pointer-events:none;opacity:0.6;cursor:not-allowed;');
    $.query('#btnContinue').val('Processing ...');
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
}

function derivateOK(res){
    $.ui.hideModal("#openCase","fade");
    $.ui.hideMask();
}

function saveForm(){
    var sAction = $('#case_save_form').attr('action');
    $('#case_save_form').attr('action',sAction+'&_AUTOSAVING_=1');
    
    document.getElementById("case_save_form").submit();
    $.ui.showMask('Saving Data...');
    $.query('#form[btnSave]').addClass('disabled');
    $.query('#form[btnSubmit]').addClass('disabled');
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
}

function saveOK(res){
    $.ui.hideModal("#openCase","fade");
    $.ui.hideMask();
}

function previousStep(){
    var sAction = $('#PREVIOUS_STEP').val();
    $('#case_save_form').attr('action',httpUrl+'appDo/ema.php?action='+sAction);
    document.getElementById("case_save_form").submit();
}

/*******************************Business Logic************************************/
/**
 * show messages for comments history on touch devices
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
function showMsg(msg){
    $('#modal-dialog-body').html(msg);
    $('#modal-dialog').show();
}
function hideMsg(){
    $('#modal-dialog').hide();
}

function verifyLogin(){
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
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
                }else{
                    localStorage.setItem("username", '');
                    localStorage.setItem("password", '');
                    localStorage.setItem("login_rem", false);
                }
            }else{
                $.ui.disableSideMenu();
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
    $("#txtName").focus();
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

function caseList(needInit){
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    
    if(needInit != 0)    userInfo();
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=caseList',
        data: {w:logWs,u:logUsrUid},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            scope = angular.element($('#caselist')).scope();
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
        data: {w:logWs,u:logUsrUid,SCH_ID:logSchId},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            scopeNav = angular.element($('#caselist_side')).scope();
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
    var wy_cat = obj.getAttribute('wy_cat');
    logWyCat = wy_cat;
    segmentInfo();
    currentRole();
    if(logIsAudit == 1){
        $("#userListSearch").val('');//clear search area
        $("#userListSearch").trigger('change');//trigger angular filter to reload data after clear the search area
        document.getElementById('userListSearch').blur();
        userListAjax(obj);
    }else{
        userTags();
    }
}

function userListAjax(obj){
    //load user list
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=userList',
        data: {w:logWs,u:logUsrUid,SCH_ID:logSchId,WY_CATEGORY:logWyCat,SCH_YEAR:logSchYear},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            scopeUserList = angular.element($('#userList')).scope();
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

function userTags(){
    //load tag list for one user
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=tagList',
        data: {w:logWs,USR_UID:logUsrUid,SCH_ID:logSchId,WY_CATEGORY:logWyCat,SCH_YEAR:logSchYear},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            res.data[0].RATING_COLORS = eval('logRatingColor.'+res.data[0].RATING+'.RAT_COLOR');
            segments = renderFormTag(res.data[0], logSegment);
            scopeTagList = angular.element($('#tagList')).scope();
            scopeTagList.$apply(function() {
                scopeTagList.segments = segments;
                scopeTagList.tags = res.data[0];
                $.ui.loadContent('userTags',false,true,'flip');
                $.ui.scrollToTop('userTags');
                $.query('#userTags_pageTitle').html(res.data[0].USR_FIRSTNAME + ' ' + res.data[0].USR_LASTNAME);
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
        url: httpUrl+'appDo/ema.php?action=getUserInfo',
        data: {w:logWs,u:logUsrUid},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            logSchId = res.SCH_IDS;
            logUserTypes = res.USER_TYPES;
            logSchYear = res.SCH_YEAR;
            logRatingColor = res.RATING_COLORS;
            menuList();
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

function currentRole(){
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=getCurrentRole',
        data: {w:logWs,u:logUsrUid,WY_CATEGORY:logWyCat,SCH_ID:logSchId},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            logUserRole = res.CURRENT_ROLE;
            logNeedUpgrade = res.NEED_UPGRADE;
        },
        error:function(){
        }
    });
}

function tagList(obj){
    var sUsrUid = obj.getAttribute('data-usruid');
    var iSchId = obj.getAttribute('data-schid');
    //load tag list for one user
    tagListAjax(sUsrUid,iSchId);
}

function tagListAjax(sUsrUid,iSchId){
    //load tag list for one user
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=tagList',
        data: {w:logWs,USR_UID:sUsrUid,SCH_ID:iSchId,WY_CATEGORY:logWyCat,SCH_YEAR:logSchYear},
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            res.data[0].RATING_COLORS = eval('logRatingColor.'+res.data[0].RATING+'.RAT_COLOR');
            segments = renderFormTag(res.data[0], logSegment);
            scopeTagList = angular.element($('#tagList')).scope();
            scopeTagList.$apply(function() {
                scopeTagList.segments = segments;
                scopeTagList.tags = res.data[0];
                $.ui.loadContent('tagList',false,true,'flip');
                $.ui.scrollToTop('tagList');
                $.query('#tagList_back_btn').html('<a id="backButton" onclick="'+"$.ui.loadContent('userList',false,true,'flip');"+'" class="button">Back</a>');
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
                'data-OPERATOR_UID="'+aRecord['OPERATOR_UID']+'" '+
                'data-IS_NEXTYEAR="'+aRecord['IS_NEXTYEAR']+'" '+
                'data-RATING="'+aRecord['RATING']+'" '+
                'data-TAG="'+formTags[j]+'" '+
                'data-HAVE_UPGRADE="'+aRecord['HAVE_UPGRADE']+'" '+
                'data-WY_UID="'+aRecord['WY_UID']+'" '+
                'data-SEG_NAME="'+dataIndex+'" '+
                'data-FORM_INFO="'+formTags[j]+'" '+
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
    $.query("#afui").append('<div class="afui_panel_mask"></div>');
    $.query(".afui_panel_mask").show();
    var sUsrUid = obj.getAttribute('data-USR_UID');
    var iHaveUpgrade = obj.getAttribute('data-HAVE_UPGRADE');
    var sTag = obj.getAttribute('data-TAG');
    var sWyUid = obj.getAttribute('data-WY_UID');
    var sSegName = obj.getAttribute('data-SEG_NAME');
    var sOperatorUid = obj.getAttribute('data-OPERATOR_UID');
    var sRating = obj.getAttribute('data-RATING');
    var isNextYear = obj.getAttribute('data-IS_NEXTYEAR');
    var sFormInfo = obj.getAttribute('data-FORM_INFO');
    
    var cantStart = (sSegName != 'TNI' &&  sSegName != 'TUS') ? (sRating == 'U' || (sRating == 'N' && isNextYear == 1) ? 1 : 0) :0;
    if(logWyCat == 'OT_PRINCIPAL' && logUserRole == 'EDMGR_SUPER_ASSISTANT' && logUsrUid != sOperatorUid)//v1.9.4 for super assistant in principal menu
        cantStart = 1;
    $.ajax({
        type: 'post',
        url: httpUrl+'appDo/ema.php?action=getCaseInfo',
        data: {w:logWs,
            u: sUsrUid,
            TAG : sTag,
            TYPE: logWyCat,
            SCH_YEAR: logSchYear,
            SCH_ID: logSchId,
            HAVE_UPGRADE: iHaveUpgrade,
            NEED_UPGRADE: logNeedUpgrade,
            WY_UID: sWyUid,
            CANT_START: cantStart,
            USER_ROLE : logUserRole
        },
        dataType: 'json',
        timeout:5000,
        success: function (res) {
            showCaseInfo(res,sFormInfo,sTag,iHaveUpgrade,sUsrUid,sWyUid,sOperatorUid);
            $.query(".afui_panel_mask").remove();
        },
        error:function(){
            $.query(".afui_panel_mask").remove();
        }
    });
    
    
}

function showCaseInfo(result,sFormInfo,sTag,iHaveUpgrade,sUsrUid,sWyUid,sOperatorUid){
    //build form name
    var aTag = sFormInfo.split('_');
    var extraMark = '',startCase = '',formNameStyle = '',backBtn = '';
    var color = 'black';
    var isOnGoing = result.CASE_INFO.STATUS.indexOf('ONGOING') !== -1 ? 1 : 0;
    var showAbandon = false;//v1.9.4
    if(logUserRole == 'EDMGR_SUPER'){
        if(logWyCat=='OT_PRINCIPAL')
            showAbandon = true;
    }else if(logUserRole == 'EDMGR_PRINCIPAL'){
        if(logWyCat=='US')
      showAbandon = false;
    else if(logWyCat!='OT_PRINCIPAL')
        showAbandon = true;
    }else if(logUserRole == 'EDMGR_SUPER_ASSISTANT'){
        if(logWyCat=='OT_PRINCIPAL'){//v1.9.4 super assist can only extra principal
            showAbandon = true;
            if(logUsrUid != sOperatorUid)//v1.9.4 for principal menu with both super assistant and principal role
                showAbandon = false;//v1.9.4 instead of response parameter CAN_ABANDON in principal menu
                }
    }else if(logUserRole == 'PM_ADMIN'){
        showAbandon = true;
    }else{
        if(sOperatorUid){
            if( sOperatorUid == logUsrUid )
                showAbandon = true;
        }else{
            if(logUserRole != staffGrid.MAPPING_ROLE['ASSIST_ROLE'])
            showAbandon = true;
        }
    }

    if(result.CASE_INFO.STATUS == 'DONE'){
        color = 'red';
    }else if(isOnGoing === 1){
        color = 'green';
    }
    if(aTag[1] == 1)
        extraMark = "<span style='color:blue;font-style:italic;'>(Extra Form)</span> ";
    if(result.CASE_INFO.STATUS == 'TODO' && result.CASE_INFO.CAN_START == 1)
        startCase = '<button class="ED-EDM-btn ED-EDM-btn-primary ED-EDM-btn-xs">Start Case</button>';
    if(aTag[2] == 0)
        formNameStyle = 'text-decoration: line-through;color: red;';
    if(logIsAudit == 1)
        backBtn = 'tagListAjax(\''+sUsrUid+'\',\''+logSchId+'\');';
    else
        backBtn = 'userTags();';
    var header = '<div class="ED-EDM-panel-heading">'+
                    '   <a style="color: #53575E;height:34px;" id="backButton" onclick="'+backBtn+'" class="button">Back</a>'+
                    '   <div align="center" style="'+formNameStyle+'">'+
                    '       <span title="" style="color: '+color+';" id="ft'+sFormInfo+'">'+result.CASE_INFO.FORM_NAME+'</span> '+
                    extraMark +
                    startCase +
                    '   </div>'+
                    '</div>';
    var body='<div class="ED-EDM-panel-body" style="background-color:white;"><dl class="ED-EDM-dl-horizontal">';//--ED-EDM-panel-body start
    body += String.format("<dt>From:</dt><dd>{0}</dd>", result.CASE_INFO.FROM);
    body += String.format("<dt>Status:</dt><dd style='color:{0}'>{1}</dd>", color, result.CASE_INFO.STATUS);
    body += String.format("<dt>School Year:</dt><dd>{0}</dd>", result.CASE_INFO.SCH_YEAR ? result.CASE_INFO.SCH_YEAR : logSchYear);
    if(result.CASE_INFO.DEPEND_FORM)
        body += String.format("<dt>Dependency:</dt><dd style='color: black;'>{0}</dd>", result.CASE_INFO.DEPEND_FORM);
    //Preview Case:
    if(result.CASE_INFO.APP_NUMBER && isOnGoing === 1 && result.CASE_INFO.CAN_PREVIEW == 1)
        body += String.format("<dt>Preview Case:</dt><dd title='Click to preview case!' style='color: blue;cursor:pointer;' onclick='previewCase(\"{1}\",\"{0}\");'><a>Case # {0}</a></dd>", result.CASE_INFO.APP_NUMBER, result.CASE_INFO.APP_UID);
    //Current User:
    if(result.CASE_INFO.CRT_USER)
        body += String.format("<dt>Current User:</dt><dd>{0}</dd>", result.CASE_INFO.CRT_USER);
    //Evaluator:
    if(result.CASE_INFO.OTHER_EVALUATOR_UID || result.CASE_INFO.EVALUATOR_UID){
        body += String.format("<dt>Evaluator:</dt><dd>{0} ", result.CASE_INFO.EVALUATOR_NAME);
        if(logIsAudit ==1 && result.CASE_INFO.STATUS == 'TODO' && result.CASE_INFO.CHANGE_EVALUATOR == 1 && logWyCat != 'OT_PRINCIPAL')
            body += String.format(" <button class='ED-EDM-btn ED-EDM-btn-primary ED-EDM-btn-xs' onclick='changeEvaluator(this,\"{1}\",\"{2}\",\"{3}\",\"{4}\",\"{5}\",\"{0}\")' title='Change'><span>Change</span></button>", sTag, sUsrUid, result.CASE_INFO.CREATED_DATE, sWyUid, iHaveUpgrade, result.CASE_INFO.EVALUATOR_UID);
        body += "</dd>";
    }
    //File(.pdf):
    if(result.CASE_INFO.PDF){
        var pdfHtml = '<dt>File(.pdf):</dt><dd><div style="font-size:11px;">';
        for(var i=0; i<result.CASE_INFO.PDF.length; i++){
            var pdfInfo = result.CASE_INFO.PDF[i];
            var rand = Math.round(Math.random() * 100000)
            // pdfHtml += String.format("<a href='../cases/cases_ShowOutputDocument?a={0}&v={1}&ext={2}&random={3}'>{4}</a><br>", pdfInfo.APP_DOC_UID, pdfInfo.DOC_VERSION, pdfInfo.FILE_TYPE, rand, pdfInfo.FILE_NAME);
             pdfHtml += String.format("<a href='javascript:void(0)'>{0}</a><br>", pdfInfo.FILE_NAME);
        }
        pdfHtml += '</div></dd>';
        body += pdfHtml;
    }
    if(result.CASE_INFO.ATTACHMENT){
        var attHtml = '';
        var indexAtt = 0;
        for(var i=0; i<result.CASE_INFO.ATTACHMENT.length; i++){
            var attInfo = result.CASE_INFO.ATTACHMENT[i];
            var rand = Math.round(Math.random() * 100000)
            if(indexAtt < 150)
                indexAtt+=15;
            // attHtml +=  String.format("<a href='../cases/cases_ShowDocument?a={0}&v={1}&ext={2}&random={3}'>{4}</a><br>", attInfo.APP_DOC_UID, attInfo.DOC_VERSION, attInfo.FILE_TYPE, rand, attInfo.FILE_NAME);
            attHtml +=  String.format("<a href='javascript:void(0)'>{0}</a><br>", attInfo.FILE_NAME);
        }
        if(result.CASE_INFO.ATTACHMENT.length > 0)
            body += '<dt>Attachment:</dt><dd><div style="height:' + indexAtt + 'px; overflow:auto;font-size:11px;">' + attHtml + '</div></dd>';
    }
    if(result.CASE_INFO.UPDATE_DATE)
        body += String.format("<dt>Update Date:</dt><dd>{0}</dd>",result.CASE_INFO.UPDATE_DATE);
    if(result.CASE_INFO.START_DATE)
        body += String.format("<dt>Start Date:</dt><dd>{0}</dd>", result.CASE_INFO.START_DATE);
        
    body += '</dl></div>';//--ED-EDM-panel-body end
    body += '<div class="ED-EDM-panel-footer" style="background-color: white;border: none;">';//--ED-EDM-panel-footer start
    if(showAbandon && (aTag[1] == 1 && result.CASE_INFO.STATUS == 'TODO' && (result.CASE_INFO.CAN_ABANDON ==1 && logIsAudit ==1 && logWyCat != 'OT_PRINCIPAL' || (logWyCat == 'OT_PRINCIPAL' && (logUserRole == 'EDMGR_SUPER_ASSISTANT' || logUserRole == 'EDMGR_SUPER'))))){
        //delete
        body += String.format("<button class='ED-EDM-btn ED-EDM-btn-danger ED-EDM-btn-xs' onclick='deleteExtra(this,\"{1}\",\"{2}\",\"{3}\",\"{4}\",\"{0}\")' title='Delete'><span>Delete</span></button>", sTag, sUsrUid, result.CASE_INFO.CREATED_DATE, sWyUid, result.CASE_INFO.EVALUATOR_UID);
    }
    var addReopen = false;
    if(result.CASE_INFO.STATUS != 'DONE'){
        if(aTag[2] == 1){
            if( aTag[1] == 0 || isOnGoing === 1){
                //abandon
                if(showAbandon && (logIsAudit ==1 && result.CASE_INFO.CAN_ABANDON ==1 && logWyCat != 'OT_PRINCIPAL' || (logWyCat == 'OT_PRINCIPAL' && (logUserRole == 'EDMGR_SUPER_ASSISTANT' || logUserRole == 'EDMGR_SUPER'))))
                    body +=  String.format("<button class='ED-EDM-btn ED-EDM-btn-danger ED-EDM-btn-xs' onclick='abandonCase(this,\"{1}\",\"{2}\",\"{3}\",\"{0}\",\"{4}\")' title=\"Abandon\"><span>Abandon</span></button>", sTag, sUsrUid, result.CASE_INFO.CREATED_DATE, sWyUid, result.CASE_INFO.EVALUATOR_UID, iHaveUpgrade);
                body += String.format("<div id='txtReasonDiv{0}{1}' style='display:none;'><dt>Abandon Reason:</dt><textarea id='txtReason{0}{1}' style='width:100%'></textarea></div>", sTag, logWyCat);
            }
        }else{
            addReopen = true;
            if(showAbandon && ((logIsAudit ==1 && result.CASE_INFO.CAN_ABANDON ==1 && logWyCat != 'OT_PRINCIPAL') || (logWyCat == 'OT_PRINCIPAL' && (logUserRole == 'PM_ADMIN' || logUserRole == 'EDMGR_SUPER_ASSISTANT' || logUserRole == 'EDMGR_SUPER'))))
                body +=  String.format("<button class='ED-EDM-btn ED-EDM-btn-danger ED-EDM-btn-xs' onclick='reopenCase(this,\"{0}\",\"{1}\",\"{2}\")' title=\"Reopen\"><span>Reopen</span></button>", sUsrUid, aTag[3], result.CASE_INFO.CREATED_DATE);
            body += String.format("<div><dt>Abandon Reason:</dt><textarea readonly style='width:100%'>{0}</textarea></div>", result.CASE_INFO.INACTIVE_REASON);
        }
    }
    if(logIsAudit ==1 && result.CASE_INFO.CAN_ABANDON ==1 && !addReopen){
        if(showAbandon && ((aTag[2] == 0 && result.CASE_INFO.STATUS != 'DONE' && logWyCat != 'OT_PRINCIPAL') || (aTag[2] == 1 && result.CASE_INFO.STATUS == 'DONE' && logUserRole == 'PM_ADMIN'))){
            body +=  String.format("<button class='ED-EDM-btn ED-EDM-btn-danger ED-EDM-btn-xs' onclick='reopenCase(this,\"{0}\",\"{1}\",\"{2}\")' title=\"Reopen\"><span>Reopen</span></button>", sUsrUid, aTag[3], result.CASE_INFO.CREATED_DATE);
        }
    }
    body += '</div>';//--ED-EDM-panel-footer end
    
    var caseInfo = header + body;
    scopeCaseInfo = angular.element($('#caseInfo')).scope();
    scopeCaseInfo.$apply(function() {
        scopeCaseInfo.caseInfo = caseInfo;
        $.ui.loadContent('caseInfo',false,true,'flip');
        $.ui.scrollToTop('caseInfo');
    });
}
function changeEvaluator(obj, usrUid, createdDate, wyUid, haveUpgrade, evaUid, tag){
    
}
