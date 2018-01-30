
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

	dictionary.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var dictionary = {
	//获取数据
	dictionaryList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.system.dictData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#dictList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#dictList').show();
  					$('#noData').hide();
  					$("#dictList").html(template('dictUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchDictionary:function(){
		$('#search').on('click',function(){
			dictionary.reportList();
	    });
	},
	//返回
	backDictionaryList:function(){
		$('#backdate').on('click',function(){
			createTime = $('#create_time').val('');
			pageNum = 1;
			dictionary.dictionaryList();
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
			dictionary.dictionaryList();
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
			dictionary.dictionaryList();
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
				dictionary.dictionaryList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		dictionary.dictionaryList();
		//查询
		dictionary.searchDictionary();
		//返回
		dictionary.backDictionaryList();
		//点击页码
		dictionary.queryClickPageNO();
		//下一页
		dictionary.nextPage();
		//上一页
		dictionary.prePage();
	}
}