
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

	beanConsume.pageInit();
});

var dataBox;
var pageNum = 1;
var orderNum = 0;

var beanConsume = {
	//获取数据
	BeanConsumeList:function() {
		var data = {
	 			page:pageNum,
	 			orderStatus:orderNum
	  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.order.beanConsumeData(), 'POST', json, function(res){
  			//console.log(res);
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
  			console.log(res);
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
	addBeanConsume:function(){
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
			RequestService(ToURL.order.addBeanData(), 'POST', params, function(res){
				//console.log(res);
				if(res.code == 0){
					beanConsume.BeanConsumeList();
					layer.msg('添加成功', {icon: 1});
					$("#add-beanConsume").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteBeanConsume:function(){
		$('#beanConsumeList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.order.deleteBeanConsumeData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					beanConsume.BeanConsumeList();
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
			beanConsume.BeanConsumeList();
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
			beanConsume.BeanConsumeList();
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
				beanConsume.BeanConsumeList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		beanConsume.BeanConsumeList();
		beanConsume.userData();
		beanConsume.teacherData();
		//添加
		beanConsume.addBeanConsume();
		//删除
		beanConsume.deleteBeanConsume();
		//点击页码
		beanConsume.queryClickPageNO();
		//下一页
		beanConsume.nextPage();
		//上一页
		beanConsume.prePage();
	}
}