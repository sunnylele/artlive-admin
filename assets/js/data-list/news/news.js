
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

	news.pageInit();
});

var dataBox;
var pageNum = 1;

var news = {
	//获取数据
	newsList:function() {
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.news.newsData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#newsList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#newsList').show();
  					$('#noData').hide();
  					$("#newsList").html(template('newsUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchNews:function(){
		$('#search').on('click',function(){
			news.newsList();
	    });
	},
	//返回
	backNewsList:function(){
		$('#backdate').on('click',function(){
			$('#title_adv').val('');
			pageNum = 1;
			news.newsList();
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
			news.newsList();
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
			news.newsList();
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
				news.newsList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		news.newsList();
		//查询
		news.searchNews();
		//返回
		news.backNewsList();
		//点击页码
		news.queryClickPageNO();
		//下一页
		news.nextPage();
		//上一页
		news.prePage();
	}
}