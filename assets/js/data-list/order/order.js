
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

	order.pageInit();
});

var dataBox;
var pageNum = 1;
var orderNum = 0;

var order = {
	//获取数据
	orderDataList:function() {
		var data = {
	 			page:pageNum,
	 			orderStatus:orderNum
	  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.order.orderData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#orderList').hide();
  					$('.noData').show();
  					return
  				}else{
  					$('#orderList').show();
  					$('.noData').hide();
  					$("#orderList").html(template('orderUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//分类信息
	payType:function(){
	    $(".tabTitle ul li").click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			orderNum = $(this).html();
			if(orderNum == '待支付'){
				orderNum = 0;
				pageNum = 1;
				$('#admin-title').html('待支付信息')
				order.orderDataList();
			}else if(orderNum == '已支付'){
				orderNum = 1;
				pageNum = 1;
				$('#admin-title').html('已支付信息')
				order.orderDataList();
			}else if(orderNum == '已取消'){
				orderNum = 2;
				pageNum = 1;
				$('#admin-title').html('已取消信息')
				order.orderDataList();
			}else if(orderNum == '已完成'){
				orderNum = 3;
				pageNum = 1;
				$('#admin-title').html('已完成信息')
				order.orderDataList();
			}else if(orderNum == '已退款'){
				orderNum = 4;
				pageNum = 1;
				$('#admin-title').html('已信息')
				order.orderDataList();
			}
		});
	},
	//修改
	upDataOrder:function(){
		var changeId = -1;
		$('tbody').on('click','.upDateM',function(){
			$("#updata-order").modal('show');
			$('#dingdanNo').html('');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.order.detailOrder()+changeId, 'POST', null, function(res){
				console.log(res)
				$('#dingdanNo').html(res.data.orderNo);
				loadData(res.data);
	  		});
		});
		$('#upDataBtn').on('click',function(){
			var upDateForm = $('#upDataOrderForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.order.updateOrder()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					order.orderDataList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-order").modal('hide');
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
			order.orderDataList();
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
			order.orderDataList();
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
				order.orderDataList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		order.orderDataList();
		//支付状态
		order.payType();
		//修改
		order.upDataOrder();
		//点击页码
		order.queryClickPageNO();
		//下一页
		order.nextPage();
		//上一页
		order.prePage();
	}
}