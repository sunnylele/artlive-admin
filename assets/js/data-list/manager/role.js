
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

	role.pageInit();
});

var settings = {
		view: {
			selectedMulti: true,
			showLine:false,
			showIcon: true
		},
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		check : {
			enable: true
		},
		data: {
			keep: {
				parent:true,
				leaf:true
			},
			simpleData: {
				enable: true
			},
			key:{
				open:true
			}
		}
	};


var dataBox;
var roleName;
var pageNum = 1;

var role = {
	//获取数据
	roleList:function() {
		roleName = $('#role_name').val();
 		var data = {
 			page:pageNum,
  			roleName:roleName
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.manager.getRoleList(), 'POST', json, function(res){
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#roleList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#roleList').show();
  					$('#noData').hide();
  					$("#roleList").html(template('roleUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchRole:function(){
		$('#search').on('click',function(){
			role.roleList();
	    });
	},
	//返回
	backRoleList:function(){
		$('#backdate').on('click',function(){
			$('#role_name').val('');
			pageNum = 1;
			role.roleList();
	    });
	},
	//选择权限
	checkAuth:function(){
		str = sessionStorage.manager;
		obj = JSON.parse(str)
		var Id = obj.id;
	 	var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.manager.checkAuthList()+Id, 'GET', json, function(res){
  			var nodes = res.data
  			$.fn.zTree.init($("#ztree"),settings,res.data);
  			var treeObj = $.fn.zTree.getZTreeObj("ztree");
  			treeObj.expandAll(true);
  		});
	},
	//添加
	addRole:function() {
		$('.user-add').on('click',function(){
			$("#role-manager").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#add-role').on('click',function(){
			var checkId = '';
			var checkNodes;
			var treeObj = $.fn.zTree.getZTreeObj("ztree");
			checkNodes = treeObj.getCheckedNodes(true);
		    for(var i=0;i<checkNodes.length;i++){
		       	checkId += checkNodes[i].id + ",";
		    }
		   	checkId = checkId.substring(0,checkId.length - 1);
		    $('#checkList').val(checkId)
			var roleForm = $('#addRoleForm').serializeArray();
			var addData = {};
		    $.each(roleForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.manager.addRole(), 'POST', params, function(res){
				if(res.code == 0){
					role.roleList();
					layer.msg('添加成功', {icon: 1});
					$("#role-manager").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteRole:function() {
		$('#roleList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.manager.deleteRole()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					role.roleList();
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
			role.roleList();
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
			role.roleList();
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
				role.roleList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		role.roleList();
		//选择权限
		role.checkAuth();
		//添加
		role.addRole();
		//删除
		role.deleteRole();
		//查询
		role.searchRole();
		//返回
		role.backRoleList();
		//点击页码
		role.queryClickPageNO();
		//下一页
		role.nextPage();
		//上一页
		role.prePage();
	}
}