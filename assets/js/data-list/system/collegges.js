
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

	colleges.pageInit();
});

var dataBox;
var pageNum = 1;

var colleges = {
	//获取数据
	collegesList:function() {
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.collegesData(), 'POST', json, function(res){
  			//console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#colleggesList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#colleggesList').show();
  					$('#noData').hide();
  					$("#colleggesList").html(template('colleggesUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//添加
	addColleges:function(){
		$('.user-add').on('click',function(){
			$("#add-collegges").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addColleggesForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.member.addCollegges(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					colleges.collegesList();
					layer.msg('添加成功', {icon: 1});
					$("#add-collegges").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteColleges:function(){
		$('#colleggesList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.member.deleteCollegges()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					colleges.collegesList();
				}
	  		});
		});
	},
	//修改
	upDataColleges:function(){
		var changeId = -1;
		$('#colleggesList').on('click','#upDateM',function(){
			$("#updata-collegges").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.member.detailCollegges()+changeId, 'POST', null, function(res){
				loadData(res.data);
	  		});
		});
		$('#upDataBtn').on('click',function(){
			var upDateForm = $('#upDatacolleggesForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.member.updateCollegges()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					colleges.collegesList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-collegges").modal('hide');
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
			colleges.collegesList();
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
			colleges.collegesList();
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
				colleges.collegesList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		colleges.collegesList();
		//添加
		colleges.addColleges();
		//删除
		colleges.deleteColleges();
		//修改
		colleges.upDataColleges();
		//点击页码
		colleges.queryClickPageNO();
		//下一页
		colleges.nextPage();
		//上一页
		colleges.prePage();
	}
}