
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

	refund.pageInit();
});

var dataBox;
var pageNum = 1;

var refund = {
	//获取数据
	refundDataList:function() {
		var data = {
	 			page:pageNum
	  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.order.refundData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#refundList').hide();
  					$('.noData').show();
  					return
  				}else{
  					$('#refundList').show();
  					$('.noData').hide();
  					$("#refundList").html(template('refundListUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//退款审核
	toAuthRefund:function(){
		//审核
		var refundId;
		var outRefundNo;
		var orderNo;
		var refundStatus;
		var payType;
		$('#refundList').on('click','.toAuth',function(){
			refundId = $(this).attr('refund-id');
			if($(this).html() == '待审核'){				
				$("#auth-order").modal('show');
				$.each(dataBox.list,function(i,v){
					if(v.id == refundId){
						outRefundNo = v.outRefundNo;
						orderNo = v.orderNo;
						refundStatus = v.refundAuth;
						payType = v.bankType;
						$('.user_name').html(v.userId);
						$('.user_order').html(v.orderNo);
						$('.user_refund').html(v.outRefundNo);
						$('.user_fee').html(v.totalFee);
						$('.user_refundFee').html(v.refundFee);
						$('.user_refundDesc').html(v.refundDesc);
					};
				});
			};
		});
		//通过
		$('#authSuccess').on('click',function(){
			if($(this).html() == '通过'){				
				refundStatus = 2;
				RequestService(ToURL.order.toAuthOrder()+`?outRefundNo=${outRefundNo}&orderNo=${orderNo}&refundAuth=${refundStatus}`, 'POST', null, function(res){
		  			console.log(res);
		  			if(res.code == 0){		  				
			  			$("#auth-order").modal('hide');
			  			refund.refundDataList();
			  			layer.msg('审核通过', {icon: 6});
		  			}else{
		  				layer.msg('审核失败', {icon: 5});
		  			}	  			
		  		});
			};
		});
		//不通过
		$('#authFail').on('click',function(){
			if($(this).html() == '不通过'){				
				refundStatus = 1;
				RequestService(ToURL.order.toAuthOrder()+`?outRefundNo=${outRefundNo}&orderNo=${orderNo}&refundAuth=${refundStatus}`, 'POST', null, function(res){
		  			console.log(res);
		  			if(res.code == 0){		  				
			  			$("#auth-order").modal('hide');
			  			refund.refundDataList();
			  			layer.msg('审核不通过', {icon: 5});
		  			}else{
		  				layer.msg('审核失败', {icon: 5});
		  			}	
		  		});
			};
		});	
	},
	//退款
	payRefund:function(){
		//退款
		var payId;
		var payNo;
		var payIntro;
		var refundType;
		$('#refundList').on('click','.payRefund',function(){
			payId = $(this).attr('pay-id');
			$.each(dataBox.list,function(i,v){
				if(v.id == payId){
					payNo = v.orderNo;
					payIntro = v.refundDesc;
					refundType = v.bankType;
				};
			});
			console.log(refundType);
			if(refundType == "WeChat"){
				RequestService(ToURL.order.wechatPay()+`?orderNo=${payNo}&refundDesc=${payIntro}`, 'POST', null, function(res){
		  			console.log(res);
		  			if(res.code == 0){
			  			refund.refundDataList();
			  			layer.msg('退款成功', {icon: 6});
		  			}else{
		  				layer.msg('退款失败', {icon: 5});
		  			}	
		  		});
			}else if(refundType == "Alipay"){
				RequestService(ToURL.order.aliPay()+`?orderNo=${payNo}`, 'POST', null, function(res){
		  			console.log(res);
		  			if(res.code == 0){
			  			refund.refundDataList();
			  			layer.msg('退款成功', {icon: 6});
		  			}else{
		  				layer.msg('退款失败', {icon: 5});
		  			}	
		  		});
			}
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
			refund.refundDataList();
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
			refund.refundDataList();
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
				refund.refundDataList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		refund.refundDataList();
		//审核
		refund.toAuthRefund();
		//退款
		refund.payRefund();
		//点击页码
		refund.queryClickPageNO();
		//下一页
		refund.nextPage();
		//上一页
		refund.prePage();
	}
}