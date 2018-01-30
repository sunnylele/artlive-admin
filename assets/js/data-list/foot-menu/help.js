
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

	help.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var help = {
	//获取数据
	helpList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.footMenu.helpData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#helpList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#helpList').show();
  					$('#noData').hide();
  					$("#helpList").html(template('helpUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchAbout:function(){
		$('#search').on('click',function(){
			help.aboutList();
	    });
	},
	//返回
	backAboutList:function(){
		$('#backdate').on('click',function(){
			createTime = $('#create_time').val('');
			pageNum = 1;
			help.helpList();
	    });
	},
	//添加
	addHelp:function(){
		$('.user-add').on('click',function(){
			$("#add-help").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addHelpForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      	addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.footMenu.addHelp(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					help.helpList();
					layer.msg('添加成功', {icon: 1});
					$("#add-help").modal('hide');
				}
	  		});
		});
	},
	//修改
	upDataHelp:function(){
		var changeId = -1;
		$('#helpList').on('click','#upDateM',function(){
			$("#update-help").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.footMenu.detailHelp()+changeId, 'POST', null, function(res){
				loadData(res.data);
	  		});
		});
		$('#updateH').on('click',function(){
			var upDateForm = $('#updateHelpForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var params = JSON.stringify(upData);
			RequestService(ToURL.footMenu.updateHelp()+changeId, 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					help.helpList();
					layer.msg('修改成功', {icon: 1});
					$("#update-help").modal('hide');
				}
	  		});
		})
	},
	//删除
	deleteHelp:function() {
		$('#helpList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.footMenu.deleteHelp()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					help.helpList();
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
			help.helpList();
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
			help.helpList();
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
				help.helpList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		help.helpList();
		//查询
		help.searchAbout();
		//返回
		help.backAboutList();
		//添加
		help.addHelp();
		//修改
		help.upDataHelp();
		//删除
		help.deleteHelp();
		//点击页码
		help.queryClickPageNO();
		//下一页
		help.nextPage();
		//上一页
		help.prePage();
	}
}