/**
 * ming.jia
 * @type {string}
 */
// var path = 'http://192.168.0.45/v1/';
var path = 'https://www.univstar.com/v1/';
var aToken   = sessionStorage.getItem('COOKIE_NAME');
var appToken = sessionStorage.getItem('APPTOKEN');
var RequestService = function(method, type, params, callBack, async) {
	$.ajax({
		url:  path+method,
		type: type,
		data: params,
		async: async === undefined ? true : async,
		cache: false, //清除缓存
		dataType:'json',
        contentType:"application/json;charset=UTF-8",
        beforeSend: function (request) {
	        request.setRequestHeader("apptoken",appToken);
	        request.setRequestHeader("Authorization","Artlive "+aToken);
	    },
		success: function(data) {
			if(callBack) {
				callBack(data);
			}
			$("*[data-txt]").hover(function(e) {
				//var eve = e || window.event;
				var string = $(this).data('txt');
				if($(this).attr("data-maxlengts")) {
					var mylength = $(this).attr("data-maxlengts");
				} else {
					var mylength = 10;
				}
				if(string.length >= mylength) {
					layer.tips(string, $(this), {
						tips: [1, '#f8f8f8'],
						area: ['auto', 'auto']
					});
				}
			}, function() {
				layer.closeAll()
			});
		}
	});
};

//获取url地址参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return decodeURI(r[2]);
	return null; //返回参数值
}

//分页信息
var nextPage ; //下一页页码
var prePage; //上一页页码
var currPage; //当前页码
var totalPages; //总页数

function rendPage(dataBox){
    prePage  = dataBox.prePage;
    nextPage = dataBox.nextPage;
    currPage = dataBox.pageNum;

    //第一页默认一直存在
    $(   '<li class="pageA" id="active_1">'
        +   '<a href="javascript:;">1</a>'
        +'</li>').appendTo('#pages-box');

    //判断data.pages大于8 创建最后一页
    totalPages = dataBox.pages;
    if( totalPages > 8) {
        //循环navigatepageNums.length，创建分页按钮
        for(var i=1; i< dataBox.navigatepageNums.length-1; i++){
            $(   '<li class="pageA" id="active_'+dataBox.navigatepageNums[i]+'">'
                +   '<a href="javascript:;" >'+dataBox.navigatepageNums[i]+'</a>'
                +'</li>').appendTo('#pages-box');
        }
        $(   '<li class="pageA" id="active_'+totalPages+'">'
            +   '<a href="javascript:;">尾页</a>'
            +'</li>').appendTo('#pages-box');
    }else{
        //循环navigatepageNums.length，创建分页按钮
        for(var i=1; i< dataBox.navigatepageNums.length; i++){
            $(   '<li class="pageA" id="active_'+dataBox.navigatepageNums[i]+'">'
                +   '<a href="javascript:;" >'+dataBox.navigatepageNums[i]+'</a>'
                +'</li>').appendTo('#pages-box');
        }
    }
    var prve = $('<li class="prve"><a href="javascript:;">上一页</a></li>');
    var next = $('<li class="next"><a href="javascript:;">下一页</a></li>');

    $('#pages-box').prepend(prve);
    $('#pages-box').append(next);
    $('#active_'+currPage).addClass('active');
};


//获取列表id数据
function getIds(){
    var ids = "";
    var objs = $("input[type=checkbox][class='ace']:checked");
    if (0 < objs.length) {
        var i = 0;
        if (objs.eq(i).val() == "on") {
            i++;
        }
        ids += objs.eq(i).val();
        for (i++;i < objs.length;i++) {
            ids += "," + objs.eq(i).val();
        }
    }
    return ids;
}

//获取表单数据
function loadData(obj){
    var key,value,tagName,type,arr;
    for(x in obj){
        key = x;
        value = obj[x];
        $("[name='"+key+"'],[name='"+key+"[]']").each(function(){
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if(tagName=='INPUT'){
                if(type=='radio'){
                    $(this).attr('checked',$(this).val()==value);
                }else if(type=='checkbox'){
                    arr = value.split(',');
                    for(var i =0;i<arr.length;i++){
                        if($(this).val()==arr[i]){
                            $(this).attr('checked',true);
                            break;
                        }
                    }
                }else{
                    $(this).val(value);
                }
            }else if(tagName=='SELECT' || tagName=='TEXTAREA'){
                $(this).val(value);
            }
        });
    }
};

//选取图片
function selectionImg(el){
    var fileList = el.prop('files');
    var imgUrl = window.URL.createObjectURL(fileList[0]);
    if(el.parent().prev().find('img').length){
        el.parent().prev().find('img').attr('src',imgUrl);
    }else{
        var creteImg = $('<img />');
        creteImg.attr('src',imgUrl);
        el.parent().prev().append(creteImg);
    }
};

//时间戳转换日期对象
function toDu(n){
     return n<10?'0'+n:''+n;
}
function toTime(time) {
    var oDate = new Date(parseInt(time));
    var Y = oDate.getFullYear();
    var M = oDate.getMonth()+1;
    var D = oDate.getDate();
    var h = oDate.getHours();
    var m = oDate.getMinutes();
    var s = oDate.getSeconds();
    return Y+'-'+toDu(M)+'-'+toDu(D)+'  '+toDu(h)+':'+toDu(m)+':'+toDu(s);
}
toTime();

$(function(){
    //图片放大
    $('tbody').on('click','img.headImg',function(ev){
        $(event.target).next().toggle("slow");
        $(event.target).parents('tr').siblings().find('.zoomImg').fadeOut();
    });
});

//个人资料
$(function(){
    $('#personalData').on('click',function(){
        $('.admin_roleBox').html('');
        $('.admin_authBox').html('');
        $('#person-data').modal('show');
        var str = sessionStorage.manager;
        var obj = JSON.parse(str);
        console.log(obj);
        $('#admin_photo').attr('src',obj.photo);
        $('#admin_nick').html(obj.userName);
        $('#admin_name').html(obj.trueName);
        $('#admin_tel').html(obj.phone);
        $('#admin_emil').html(obj.email);
        $('#admin_adress').html(obj.address);
        $('#admin_intro').html(obj.note);
        $.each(obj.mRole,function(i,v){
            $('<span>'+v.roleName+'</span>').appendTo('.admin_roleBox');
        });
        $.each(obj.auths,function(i,v){
            $('<span>'+v.name+'</span>').appendTo('.admin_authBox');
        });
    });
    $('#login_back').on('click',function(){
        window.sessionStorage.removeItem("APPTOKEN");
        window.sessionStorage.clear();
        window.location.href='../../login.html';
    });
});

//随机数
function rnd(n,m) {
    return parseInt(Math.random()*(m-n)+n);
}
//生成的随机数是否已存在
function findInArray(arr,iNow) {
    for(var i=0;i<arr.length;i++) {
        if (arr[i]==iNow){
            return true;
        }
    }
    return false;
}
