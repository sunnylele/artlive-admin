
//初始化

var cookieToken = sessionStorage.COOKIE_NAME;
if(cookieToken == undefined){
	window.location.href='../../login.html';
};

$(function(){
	str = sessionStorage.manager;
	obj = JSON.parse(str);
	var Id = obj.id;
	var User = obj.trueName;
	var photoSrc = obj.photo;
	$('#master').html(User);
	$('#picSrc').attr('src', photoSrc);
	$('#roleMess').html('');
	$.each(obj.mRole,function(i,v){
        $('<b>'+v.roleName+'</b>').appendTo('#roleMess');
    });

	log.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var log = {
	//获取数据
	logList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.system.logData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#logList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#logList').show();
  					$('#noData').hide();
  					$("#logList").html(template('logUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchLog:function(){
		$('#search').on('click',function(){
			log.logList();
	    });
	},
	//返回
	backLogList:function(){
		$('#backdate').on('click',function(){
			createTime = $('#create_time').val('');
			pageNum = 1;
			log.logList();
	    });
	},
	//点击当前页
	queryClickPageNO:function(){
		$('#pages-box').on('click','li.pageA',function(){
			if($(this).attr('id') == 'active_1'){
				thisNum=1;
			}else if($(this).attr('id') == 'active_'+totalPages){
				thisNum=totalPages;
			}else{
				thisNum = $(this).find('a').text();
			}
			pageNum = thisNum;
			log.logList();
		});
	},
	//点击下一页
	nextPage:function(){
		$('#pages-box').on('click','li.next',function(){
			if(nextPage==0){
				pageNum=totalPages;
				return;
			}else{
				pageNum = nextPage;
			}
			log.logList();
		});
	},
	//点击上一页
	prePage:function(){
		$('#pages-box').on('click','li.prve',function(){
			pageNum = prePage;
			if(pageNum < 1){
				pageNum=1;
				return;
			}else{
				log.logList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		log.logList();
		//查询
		log.searchLog();
		//返回
		log.backLogList();
		//点击页码
		log.queryClickPageNO();
		//下一页
		log.nextPage();
		//上一页
		log.prePage();
	}
}