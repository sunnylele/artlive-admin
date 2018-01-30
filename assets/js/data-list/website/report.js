
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

	report.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var report = {
	//获取数据
	reportList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.site.reportData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#reportList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#reportList').show();
  					$('#noData').hide();
  					$("#reportList").html(template('reportUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchReport:function(){
		$('#search').on('click',function(){
			report.reportList();
	    });
	},
	//返回
	backReportList:function(){
		$('#backdate').on('click',function(){
			createTime = $('#create_time').val('');
			pageNum = 1;
			report.reportList();
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
			report.reportList();
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
			report.reportList();
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
				report.reportList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		report.reportList();
		//查询
		report.searchReport();
		//返回
		report.backReportList();
		//点击页码
		report.queryClickPageNO();
		//下一页
		report.nextPage();
		//上一页
		report.prePage();
	}
}