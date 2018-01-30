
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

	manager.pageInit();
});

var dataBox;
var managerName;
var pageNum = 1;
var manager = {
	//获取数据
	managerList:function() {
		managerName = $('#manager_name').val();
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum,
  			userName:managerName,
  			createDate:createTime
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.manager.getManager(), 'POST', json, function(res){
  			$('#pages-box').html('');
  			dataBox = res.data;
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#managerList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#managerList').show();
  					$('#noData').hide();
  					$("#managerList").html(template('managerUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//选择角色
	checkRoleList:function(){
		$('.sel_productTag').select2();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.manager.getRoleList(), 'POST', json, function(res){
  			if(res.code == 0){
  				var selectBox = res.data.list;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.id+'">'+v.roleName+'</option>').appendTo('.sel_productTag');
	            });
  			}
  		});
	},
	//添加
	addManger:function() {
		var UpURL = path+'admin/qiniuUpload';
		$('#upPhoto').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('upPhoto').files.length;i++){
		        file = document.getElementById('upPhoto').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upPhoto').val('');
		            return;
		        }
		    }
			$('#upPhotoForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('#addPhoto').val(data.data.fileName);
		        		layer.msg('上传成功');
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		$('.user-add').on('click',function(){
			$("#addDate-manager").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#upPhoto').val('');
		});
		$('#add-manager').on('click',function(){
			var selectRole = $('.sel_productTag').val();
			$('#selectRoleName').val(selectRole);
			var ManagerForm = $('#addManagerForm').serializeArray();
			var addData = {};
		    $.each(ManagerForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.manager.addUser(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					manager.managerList();
					layer.msg('添加成功', {icon: 1});
					$("#addDate-manager").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteManager:function() {
		$('#managerList').on('click','#deleteM',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.manager.deleteUser()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					manager.managerList();
				}
	  		});
		});
	},
	//批量删除
	batchDelete:function(){
		$('.del-info').on('click',function(){
			var ids = getIds();
	        if(null == ids || "" == ids || "undefined" == typeof ids) {
	            layer.msg('请选择至少一项!');
	            return;
	        };
			RequestService(ToURL.manager.batchDelete()+ids, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					manager.managerList();
				}
	  		});
		});
	},
	//修改
	updateManager:function() {
		var changeId = -1;
		var UpURL = path+'admin/qiniuUpload';
		$('#upDataPhoto').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('upDataPhoto').files.length;i++){
		        file = document.getElementById('upDataPhoto').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upDataPhoto').val('');
		            return;
		        }
		    }
			$('#upDataPhotoForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('#newPhoto').val(data.data.fileName);
		        		layer.msg('上传成功');
		        		$('#oldPhoto').hide();
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		$('#managerList').on('click','#upDateM',function(){
			$("#update-manager").modal('show');
			changeId = $(this).attr('change-id');
			$(".showImg img").remove();
			$('#upDataPhoto').val('');
			$('#oldPhoto').show();
			RequestService(ToURL.manager.detailUser()+changeId, 'GET', null, function(res){
				console.log(res)
				var arr = [];
				$.each(res.mRole,function(i,v){
					arr.push(v.id);
				});
				$(".sel_productTag").val(arr).trigger('change');
				loadData(res);
				$('#oldPhoto').attr('src',res.photo)
	  		});
		});
		$('#update').on('click',function(){
			var checkRole = $('#checkRole1').val();
			$('#checkRoleName').val(checkRole);
			console.log(checkRole);
			var upDateForm = $('#updateManagerForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.manager.updateUser()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					manager.managerList();
					layer.msg('修改成功', {icon: 1});
					$("#update-manager").modal('hide');
				}
	  		});
		})
	},
	//查询
	searchManager:function(){
		$('#search').on('click',function(){
			manager.managerList();
	    });
	},
	//返回
	backManager:function(){
		$('#backdate').on('click',function(){
			$('#manager_name').val('');
			$('#create_time').val('');
			pageNum = 1;
			manager.managerList();
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
			manager.managerList();
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
			manager.managerList();
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
				manager.managerList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		manager.managerList();
		//选择角色
		manager.checkRoleList();
		//添加
		manager.addManger();
		//删除
		manager.deleteManager();
		//修改
		manager.updateManager();
		//批量删除
		manager.batchDelete();
		//查询
		manager.searchManager();
		//返回
		manager.backManager();
		//点击页码
		manager.queryClickPageNO();
		//下一页
		manager.nextPage();
		//上一页
		manager.prePage();
	}
}