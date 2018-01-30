
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
	beanDataList:function() {
		var data = {
	 			page:pageNum,
	 			orderStatus:orderNum
	  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.order.beanData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#beanList').hide();
  					$('.noData').show();
  					return
  				}else{
  					$('#beanList').show();
  					$('.noData').hide();
  					$("#beanList").html(template('beanListUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//添加
	addBean:function(){
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
			RequestService(ToURL.order.addBeanData(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					bean.beanDataList();
					layer.msg('添加成功', {icon: 1});
					$("#add-bean").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteBean:function(){
		$('#beanList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.order.deleteBeanData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					bean.beanDataList();
				}
	  		});
		});
	},
	//修改
	upDataBean:function(){
		var changeId = -1;
		$('#beanList').on('click','#upDateM',function(){
			$("#updata-bean").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.order.detailBeanData()+changeId, 'POST', null, function(res){
				console.log(res)
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
			RequestService(ToURL.order.updateBeanData()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					bean.beanDataList();
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
			bean.beanDataList();
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
			bean.beanDataList();
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
				bean.beanDataList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		bean.beanDataList();
		//添加
		bean.addBean();
		//删除
		bean.deleteBean();
		//修改
		bean.upDataBean();
		//点击页码
		bean.queryClickPageNO();
		//下一页
		bean.nextPage();
		//上一页
		bean.prePage();
	}
}