
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

	feedBack.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var feedBack = {
	//获取数据
	feedBackList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.site.feedbackData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#feedBackList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#feedbackList').show();
  					$('#noData').hide();
  					$("#feedbackList").html(template('feedbackUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchFeedBack:function(){
		$('#search').on('click',function(){
			feedBack.feedBackList();
	    });
	},
	//返回
	backFeedBackList:function(){
		$('#backdate').on('click',function(){
			createTime = $('#create_time').val('');
			pageNum = 1;
			feedBack.feedBackList();
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
			feedBack.feedBackList();
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
			feedBack.feedBackList();
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
				feedBack.feedBackList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		feedBack.feedBackList();
		//查询
		feedBack.searchFeedBack();
		//返回
		feedBack.backFeedBackList();
		//点击页码
		feedBack.queryClickPageNO();
		//下一页
		feedBack.nextPage();
		//上一页
		feedBack.prePage();
	}
}