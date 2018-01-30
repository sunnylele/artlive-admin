
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

	cashConsume.pageInit();
});

var dataBox;
var pageNum = 1;
var orderNum = 0;

var cashConsume = {
	//获取数据
	cashConsumeList:function() {
		var data = {
	 			page:pageNum,
	 			orderStatus:orderNum
	  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.order.cashConsumeData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#beanConsumeList').hide();
  					$('.noData').show();
  					return
  				}else{
  					$('#beanConsumeList').show();
  					$('.noData').hide();
  					$("#beanConsumeList").html(template('beanConsumeUI',{item:res.data.list}));
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
	//老师列表
	teacherData:function(){
		$('#checkTeacher').select2({
	        width:'333px',
	        height:'33px'
	    });
		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.findTeacher(), 'GET', json, function(res){
  			//console.log(res);
  			if(res.code == 0){
  				$("#checkTeacher").html(template('TeacherList',{item:res.data}));
  			}
  		});
	},
	//添加
	addCashConsume:function(){
		$('.user-add').on('click',function(){
			$("#add-beanConsume").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addBeanConsumeForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.order.addCashConsumeData(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					cashConsume.cashConsumeList();
					layer.msg('添加成功', {icon: 1});
					$("#add-beanConsume").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteCashConsume:function(){
		$('#beanConsumeList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.order.deleteCashConsumeData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					cashConsume.cashConsumeList();
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
			cashConsume.cashConsumeList();
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
			cashConsume.cashConsumeList();
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
				cashConsume.cashConsumeList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		cashConsume.cashConsumeList();
		cashConsume.userData();
		cashConsume.teacherData();
		//添加
		cashConsume.addCashConsume();
		//删除
		cashConsume.deleteCashConsume();
		//点击页码
		cashConsume.queryClickPageNO();
		//下一页
		cashConsume.nextPage();
		//上一页
		cashConsume.prePage();
	}
}