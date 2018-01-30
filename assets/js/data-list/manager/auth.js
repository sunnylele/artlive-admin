
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

	auth.pageInit();
	//创建树
	function createTree(){
		var data = {
				page:pageNum
			};
		var json = JSON.stringify(data);
		RequestService(ToURL.manager.getAuthList(), 'POST', json, function(res){
			zNodes = res.data.list;
			var treeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var nodes = treeObj.getNodes();
			if(nodes.length > 0){
				for(var i=0; i<nodes.length; i++){
					treeObj.expandNode(nodes[i],true,false,false);
				}
			}
		});
	};
	var setting = {
		view: {
			selectedMulti: true,
			showLine:true,
			showIcon: true
		},
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			keep: {
				parent:true,
				leaf:true
			},
			simpleData: {
				enable: true
			}
		}
	};
	$(document).ready(function(){
		createTree();
	});
});



var dataBox;
var authName;
var pageNum = 1;

var auth = {
	//获取数据
	authList:function() {
		authName = $('#auth_name').val();
 		var data = {
 			page:pageNum,
  			name:authName
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.manager.getAuthList(), 'POST', json, function(res){
  			//console.log(res)
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#authList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#authList').show();
  					$('#noData').hide();
  					$("#authList").html(template('authUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchAuth:function(){
		$('#search').on('click',function(){
			auth.authList();
	    });
	},
	//返回
	backAuthList:function(){
		$('#backdate').on('click',function(){
			$('#auth_name').val('');
			pageNum = 1;
			auth.authList();
	    });
	},
	//选择父节点
	checkPid:function(){
		$('.js-example-basic-single').select2({
	        width:'330px',
	        height:'33px'
	    });
	    var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.manager.getAuthList(), 'POST', json, function(res){
  			if(res.code == 0){
  				var selectBox = res.data.list;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('.selectPidList');
	            });
  			}
  		});
	},
	//添加
	addAuth:function() {
		$('.user-add').on('click',function(){
			$("#auth-manager").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#add-auth').on('click',function(){
			var authForm = $('#addAuthForm').serializeArray();
			var addData = {};
		    $.each(authForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.manager.addAuth(), 'POST', params, function(res){
				console.log(res)
				if(res.code == 0){
					auth.authList();
					layer.msg('添加成功', {icon: 1});
					$("#auth-manager").modal('hide');
				}
	  		});
		});
	},
	//修改
	updateAuth:function() {
		var changeId = -1;
		$('#authList').on('click','#upDateA',function(){
			$("#updata-auth").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.manager.detailAuth()+changeId, 'GET', null, function(res){
				var pid = res.data.pId;
				$("#updataPid").val(pid).trigger('change');
				loadData(res.data);
	  		});
		});
		$('#update-auth').on('click',function(){
			var upDateForm = $('#updataAuthForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var changeParams = JSON.stringify(upData);
			RequestService(ToURL.manager.updateAuth()+changeId, 'POST', changeParams, function(res){
				console.log(res);
				if(res.code == 0){
					auth.authList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-auth").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteAuth:function() {
		$('#authList').on('click','#deleteA',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.manager.deleteAuth()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					auth.authList();
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
			auth.authList();
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
			auth.authList();
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
				auth.authList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		auth.authList();
		//选择父节点
		auth.checkPid();
		//查询
		auth.searchAuth();
		//返回
		auth.backAuthList();
		//修改
		auth.updateAuth();
		//添加
		auth.addAuth();
		//删除
		auth.deleteAuth();
		//点击页码
		auth.queryClickPageNO();
		//下一页
		auth.nextPage();
		//上一页
		auth.prePage();
	}
}