
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

	major.pageInit();
});

var dataBox;
var pageNum = 1;

var major = {
	//获取数据
	majorList:function() {
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.majorData(), 'POST', json, function(res){
  			//console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#majorList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#majorList').show();
  					$('#noData').hide();
  					$("#majorList").html(template('majorUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//添加
	addMajor:function(){
		$('.user-add').on('click',function(){
			$("#add-major").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addMajorForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.member.addMajorData(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					major.majorList();
					layer.msg('添加成功', {icon: 1});
					$("#add-major").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteMajor:function(){
		$('#majorList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.member.deleteMajorData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					major.majorList();
				}
	  		});
		});
	},
	//修改
	upDataMajor:function(){
		var changeId = -1;
		$('#majorList').on('click','#upDateM',function(){
			$("#updata-major").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.member.detailMajor()+changeId, 'POST', null, function(res){
				loadData(res.data);
	  		});
		});
		$('#upDataBtn').on('click',function(){
			var upDateForm = $('#upDataMajorForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.member.updateMajor()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					major.majorList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-major").modal('hide');
				}
	  		});
		})
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
			major.majorList();
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
			major.majorList();
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
				major.majorList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		major.majorList();
		//添加
		major.addMajor();
		//删除
		major.deleteMajor();
		//
		major.upDataMajor();
		//点击页码
		major.queryClickPageNO();
		//下一页
		major.nextPage();
		//上一页
		major.prePage();
	}
}