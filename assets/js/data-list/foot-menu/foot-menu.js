
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

	footMenu.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var footMenu = {
	//获取数据
	footMenuList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.footMenu.footMenuData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#footMenuList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#footMenuList').show();
  					$('#noData').hide();
  					$("#footMenuList").html(template('footMenuUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchFootMenu:function(){
		$('#search').on('click',function(){
			footMenu.footMenuList();
	    });
	},
	//返回
	backFootMenuList:function(){
		$('#backdate').on('click',function(){
			createTime = $('#create_time').val('');
			pageNum = 1;
			footMenu.footMenuList();
	    });
	},
	//添加
	addFootMen:function(){
		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.system.dictData(), 'POST', json, function(res){
  			if(res.code == 0){
  				$("#checkDic").html(template('checkDicUI',{item:res.data.list}));
  			}
  		});
		$('.user-add').on('click',function(){
			$("#add-footM").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addFootMenuForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      	addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.footMenu.addFootMenu(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					footMenu.footMenuList();
					layer.msg('添加成功', {icon: 1});
					$("#add-footM").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteFootMen:function() {
		$('#footMenuList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.footMenu.deleteFootMenu()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					footMenu.footMenuList();
				}
	  		});
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
			footMenu.footMenuList();
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
			footMenu.footMenuList();
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
				footMenu.footMenuList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		footMenu.footMenuList();
		//查询
		footMenu.searchFootMenu();
		//返回
		footMenu.backFootMenuList();
		//添加
		footMenu.addFootMen();
		//删除
		footMenu.deleteFootMen();
		//点击页码
		footMenu.queryClickPageNO();
		//下一页
		footMenu.nextPage();
		//上一页
		footMenu.prePage();
	}
}