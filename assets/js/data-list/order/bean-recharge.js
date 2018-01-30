
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

	bean.pageInit();
});

var dataBox;
var pageNum = 1;
var orderNum = 0;

var bean = {
	//获取数据
	beanRechargeList:function() {
		var data = {
	 			page:pageNum,
	 			orderStatus:orderNum
	  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.order.beanRechargeData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#beanRechargeList').hide();
  					$('.noData').show();
  					return
  				}else{
  					$('#beanRechargeList').show();
  					$('.noData').hide();
  					$("#beanRechargeList").html(template('beanRechargeUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//用户列表
	userData:function(){
		$('#checkuser').select2({
	        width:'333px',
	        height:'33px'
	    });
		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.findStudent(), 'GET', json, function(res){
  			//console.log(res);
  			if(res.code == 0){
  				$("#checkuser").html(template('userList',{item:res.data}));
  			}
  		});
	},
	//添加
	addBeanRecharge:function(){
		$('.user-add').on('click',function(){
			$("#add-bean").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addBeanForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.order.addBeanRechargeData(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					bean.beanRechargeList();
					layer.msg('添加成功', {icon: 1});
					$("#add-bean").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteBeanRecharge:function(){
		$('#beanRechargeList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.order.deleteBeanRechargeData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					bean.beanRechargeList();
				}
	  		});
		});
	},
	//修改
	upDataBeanRecharge:function(){
		var changeId = -1;
		$('#beanRechargeList').on('click','#upDateM',function(){
			$("#updata-bean").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.order.detailBeanRechargeData()+changeId, 'POST', null, function(res){
				console.log(res);
				$('#orderNum').html(res.data.orderNo);
				$('#orderUser').html(res.data.nickname);
				loadData(res.data);
	  		});
		});
		$('#upDataBtn').on('click',function(){
			var upDateForm = $('#upDataBeanForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.order.updateBeanRechargeData()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					bean.beanRechargeList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-bean").modal('hide');
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
			bean.beanRechargeList();
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
			bean.beanRechargeList();
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
				bean.beanRechargeList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		bean.beanRechargeList();
		bean.userData();
		//添加
		bean.addBeanRecharge();
		//删除
		bean.deleteBeanRecharge();
		//修改
		bean.upDataBeanRecharge();
		//点击页码
		bean.queryClickPageNO();
		//下一页
		bean.nextPage();
		//上一页
		bean.prePage();
	}
}