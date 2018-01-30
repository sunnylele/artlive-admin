
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

	homeWork.pageInit();
});

var dataBox;
var pageNum = 1;
var teacherWorkTitle;

var homeWork = {
	//获取数据
	homeWorkList:function() {
		teacherWorkTitle = $('#homeWork_title').val();
 		var data = {
 			page:pageNum,
 			title:teacherWorkTitle
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.live.homeworkData(), 'POST', json, function(res){
  			console.log(res)
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#homeWorkList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#homeWorkList').show();
  					$('#noData').hide();
  					$("#homeWorkList").html(template('homeWorkUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchHomeWork:function(){
		$('#search').on('click',function(){
			homeWork.homeWorkList();
	    });
	},
	//返回
	backHomeWork:function(){
		$('#backdate').on('click',function(){
			$('#homeWork_title').val('');
			pageNum = 1;
			homeWork.homeWorkList();
	    });
	},
	//选择专业
	checkMajor:function(){
		$('.sel_productTag').select2();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.live.majorList(), 'GET', json, function(res){
  			//console.log(res);
  			if(res.code == 0){
  				var selectBox = res.data.majors;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('.checkMajor');
	            });
  			}
  		});
	},
	//选择学院
	checkSchool:function(){
		$('.sel_productTag').select2();
		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.live.majorList(), 'GET', json, function(res){
  			if(res.code == 0){
  				var selectSchool = res.data.colleges;
				$.each(selectSchool,function(i,v){
					$('<option value="'+v.id+'">'+v.name+'</option>').appendTo('.SchoolList');
	            });
  			}
  		});
	},
	//老师列表
	teacherData:function(){
		$('.js-example-basic-single').select2({
	        width:'333px',
	        height:'33px'
	    });
		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.live.teacherList(), 'POST', json, function(res){
  			console.log(res);
  			if(res.code == 0){
  				var selectBox = res.data.list;
				$.each(selectBox,function(i,v){
					$('<option value="'+v.teacherId+'">'+v.realname+'</option>').appendTo('#checkTeacher');
	            });
  			}
  		});
	},
	//添加
	addHomeWork:function(){
		$('.user-add').on('click',function(){
			$("#add-homework").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
		});
		$('#addBtn').on('click',function(){
			var selectMaior = $('.checkMajor').val();
			$('#selectMaiorName').val(selectMaior);
			var selectColleges = $('.SchoolList').val();
			$('#selectSchoolName').val(selectColleges);
			var addForm = $('#addHomeWorkForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.live.addTeacherWork(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					homeWork.homeWorkList();
					layer.msg('添加成功', {icon: 1});
					$("#add-homework").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteHomeWork:function() {
		$('#homeWorkList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.live.deleteTeacherWork()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					homeWork.homeWorkList();
				}
	  		});
		});
	},
	//修改
	updataHomeWork:function(){
		var changeId = -1;
		var str = '';
		var arr = [];
		var str1 = '';
		var arr1 = [];
		$('#homeWorkList').on('click','#upDateM',function(){
			$("#update-homework").modal('show');
			changeId = $(this).attr('change-id');
			RequestService(ToURL.live.detailTeacherWork()+changeId, 'POST', null, function(res){
				console.log(res)
				if(res.data){
					$('#teacherName').html(res.data.realname);
					loadData(res.data);
					str = res.data.majorIds;
					str1 = res.data.collegeIds;
					if(str != null){
						arr = str.split(",");
						$(".checkMajor").val(arr).trigger('change');
					};
				}else{
					layer.msy('数据加载失败')
				}
	  		});
		});
		$('#update').on('click',function(){
			var checkMajor = $('#updataMajor').val();
			$('#checkMajorName').val(checkMajor);
			var upDateForm = $('#updateHomeWorkForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.live.updateTeacherWork()+changeId, 'POST', finalData, function(res){
				console.log(res)
				if(res.code == 0){
					homeWork.homeWorkList();
					layer.msg('修改成功', {icon: 1});
					$("#update-homework").modal('hide');
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
			gift.giftList();
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
			homeWork.homeWorkList();
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
				homeWork.homeWorkList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		homeWork.homeWorkList();
		//查询
		homeWork.searchHomeWork();
		//返回
		homeWork.backHomeWork();
		//老师
		homeWork.teacherData();
		//选择专业
		homeWork.checkMajor();
		//选择学院
		homeWork.checkSchool();
		//添加
		homeWork.addHomeWork();
		//删除
		homeWork.deleteHomeWork();
		//修改
		homeWork.updataHomeWork();
		//点击页码
		homeWork.queryClickPageNO();
		//下一页
		homeWork.nextPage();
		//上一页
		homeWork.prePage();
	}
}