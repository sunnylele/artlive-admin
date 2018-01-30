
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

	flight.pageInit();
});

var dataBox;
var pageNum = 1;

var flight = {
	//获取数据
	cepingList:function() {
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.system.cepingData(), 'POST', json, function(res){
  			//console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#cepingList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#cepingList').show();
  					$('#noData').hide();
  					$("#cepingList").html(template('cepingUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//删除
	deleteCeping:function(){
		$('#cepingList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.system.deleteCepingData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					flight.cepingList();
				}
	  		});
		});
	},
	//修改
	updataCeping:function(){
		var changeId = -1;
		$('#cepingList').on('click','#upDateM',function(){
			$("#updata-ceping").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.system.detailCepingData()+changeId, 'GET', null, function(res){
				loadData(res.data);
	  		});
		});
		$('#upDataBtn').on('click',function(){
			var upDateForm = $('#upDataCePingForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.system.updateCepingData()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					flight.cepingList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-ceping").modal('hide');
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
			flight.cepingList();
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
			flight.cepingList();
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
				flight.cepingList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		flight.cepingList();
		//删除
		flight.deleteCeping();
		//修改
		flight.updataCeping();
		//点击页码
		flight.queryClickPageNO();
		//下一页
		flight.nextPage();
		//上一页
		flight.prePage();
	}
}