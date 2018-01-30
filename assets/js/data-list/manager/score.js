
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

	score.pageInit();
});

var dataBox;
var createTime;
var pageNum = 1;

var score = {
	//获取数据
	getScore:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.scoreData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#scoreList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#scoreList').show();
  					$('#noData').hide();
  					$("#scoreList").html(template('scoreUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchScore:function(){
		$('#search').on('click',function(){
			score.getScore();
	    });
	},
	//返回
	backScoreList:function(){
		$('#backdate').on('click',function(){
			$('#create_time').val('');
			pageNum = 1;
			score.getScore();
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
			score.getScore();
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
			score.getScore();
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
				score.getScore();
			}
		});
	},


	pageInit:function() {
		//获取数据
		score.getScore();
		//查询
		score.searchScore();
		//返回
		score.backScoreList();
		//点击页码
		score.queryClickPageNO();
		//下一页
		score.nextPage();
		//上一页
		score.prePage();
	}
}