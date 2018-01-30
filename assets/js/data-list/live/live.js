
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

	live.pageInit();
});

var dataBox;
var pageNum = 1;
var courseName;
var createTime;
var startTime;

var live = {
	//获取数据
	liveList:function() {
		courseName = $('#course_name').val();
		createTime = $('#create_time').val();
		startTime = $('#start_time').val();
 		var data = {
 			page:pageNum,
 			title:courseName,
 			createData:createTime,
 			startDate:startTime
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.live.liveList(), 'POST', json, function(res){
  			console.log(res)
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#liveList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#liveList').show();
  					$('#noData').hide();
  					$("#liveList").html(template('liveUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchLive:function(){
		$('#search').on('click',function(){
			live.liveList();
	    });
	},
	//返回
	backLiveList:function(){
		$('#backdate').on('click',function(){
			$('#course_name').val('');
			$('#create_time').val('');
			$('#start_time').val('');
			pageNum = 1;
			live.liveList();
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
  		RequestService(ToURL.member.findTeacher(), 'GET', json, function(res){
  			//console.log(res);
  			if(res.code == 0){
  				$("#checkTeacher").html(template('TeacherList',{item:res.data}));
  			}
  		});
	},
	//选择专业
	checkMajor:function(){
		$('.checkMajor').select2();
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
		$('.SchoolList').select2();
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
	//添加
	addLiveCourse:function(){
		var UpURL = path+'admin/qiniuUpload';
		$('#upCoverImg').change( function() {
			$('#upCoverImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            $('#upImgSrc').val(data.data.fileName);
		            layer.msg('上传成功');
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		var E;
		var editor;
		E = window.wangEditor
		editor = new E('#editor');
		editor.customConfig.uploadImgServer = path+'admin/kindEditorUpload';
		editor.customConfig.uploadFileName = 'myFileName';
		editor.customConfig.debug = true;
		editor.create();
		$('.user-add').on('click',function(){
			$("#add-live").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#upCoverImg').val('');
			$('#video').hide();
			$('#upVideo').val('');
		});
		$('#addBtn').on('click',function(){
			if($('#upCoverImg').val() == ''){
				layer.msg('请先上传课程封面');
				return
			}else if($('#liveName').val() == ''){
				layer.msg('请先输入直播名称');
				$('#liveName').focus();
				return
			}else if($('#livePrice').val() == ''){
				layer.msg('请先输入直播价格');
				$('#livePrice').focus();
				return
			}else  if($('#liveStart').val() == ''){
				layer.msg('请先选择直播开始时间');
				$('#liveStart').focus();
				return
			}else if($('.checkMajor').val() == null){
				layer.msg('请先选择专业');
				return
			}else if($('.SchoolList').val() == null){
				layer.msg('请先选择学院');
				return
			}
			var html = editor.txt.html();
			$('#liveCon').val(html);
			var selectMaior = $('.checkMajor').val();
			$('#selectMaiorName').val(selectMaior);
			var selectColleges = $('.SchoolList').val();
			$('#selectSchoolName').val(selectColleges);
			var addForm = $('#addLiveForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.live.addLive(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					live.liveList();
					layer.msg('添加成功', {icon: 1});
					$("#add-live").modal('hide');
				}
	  		});
		});
	},

	lookMore:function(){
		var lookId;
		$('#liveList').on('click','#lookDetail',function(){
			layui.use('element', function(){
				var $ = layui.jquery,element = layui.element;
			});
			$('.layui-tab-title').find('li').eq(0).addClass('layui-this').siblings().removeClass('layui-this');
			$("#look-detail").modal('show');
			lookId = $(this).attr('look-id');
			$('#user_major').html('');
			$('#user_school').html('');
			$('.noHave').hide();
			RequestService(ToURL.live.detailLive()+lookId, 'POST', null, function(res){
				console.log(res);
				if(res.code == 0){
	  				$("#courseDetail").html(template('courseDetailUI',{item:res.data}));
	  			};
				$('#lookCourse_start').html(res.data.startDate);
				$('#lookCourse_end').html(res.data.endDate);
				$('#lookcourseContent').html(res.data.content);
				var majorList = res.data.majorIds;
				var school = res.data.collegeIds;
				if(majorList != null){
                	var data = {
			 			page:pageNum
			  		};
			  		var json = JSON.stringify(data);
			  		RequestService(ToURL.member.majorData(), 'POST', json, function(res){
			  			//console.log(res);
			  			var majorData = res.data.list;
			  			$.each(majorData,function(i,v){
			  				for(var i=0; i<majorList.length; i++){
			  					if(majorList[i] == v.id){
			  						$('<span>'+v.name+'</span>').appendTo('#user_major');
			  					}
			  				}
			  			})
			  		});
                }
                if(school != null){
                	var data = {
			 			page:pageNum
			  		};
			  		var json = JSON.stringify(data);
			  		RequestService(ToURL.member.collegesData(), 'POST', json, function(res){
			  			//console.log(res);
			  			var schoolData = res.data.list;
			  			$.each(schoolData,function(i,v){
			  				for(var i=0; i<school.length; i++){
			  					if(school[i] == v.id){
			  						$('<span>'+v.name+'</span>').appendTo('#user_school');
			  					}
			  				}
			  			})
			  		});
                };
	  		});
		});
	},
	//推送
	toHome:function(){
		var listCurr;
		var listId;
		var listNowCon;
		$('tbody').on('click','.tolist',function(){
			listId = $(this).attr("list-id");
			listNowCon = $(this).html();
			if(listNowCon == '推至列表'){
				listCurr = 1;
				RequestService(ToURL.live.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('推送成功', {icon: 1});
						live.liveList();
					}
	  			});
			}else if(listNowCon == '推至首页'){
				listCurr = 2;
				RequestService(ToURL.live.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('推送成功', {icon: 1});
						live.liveList();
					}
  				});
			}else if(listNowCon == '取消推送'){
				listCurr = 0;
				RequestService(ToURL.live.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('推送成功', {icon: 1});
						live.liveList();
					}
  				});
			}
			else if(listNowCon == '撤至列表'){
				listCurr = 1;
				RequestService(ToURL.live.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('撤销成功', {icon: 1});
						live.liveList();
					}
  				});
			}
		});
	},
	//删除
	deleteLive:function() {
		$('#liveList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.live.deleteLiveData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					live.liveList();
				}
	  		});
		});
	},
	//修改
	updataLive:function(){
		var changeId = -1;
		var str = '';
		var arr = [];
		var str1 = '';
		var arr1 = [];
		var UpURL = path+'admin/qiniuUpload';
		$('#upDataCoverImg').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('upDataCoverImg').files.length;i++){
		        file = document.getElementById('upDataCoverImg').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upDataCoverImg').val('');
		            return;
		        }
		    }
			$('#upDataCoverImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('#newImgSrc').val(data.data.fileName);
		        		layer.msg('上传成功');
		        		$('#oldCoverImg').hide();
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		var E1;
		var editor1;
		E1 = window.wangEditor;
		editor1 = new E1('#editor1');
		editor1.customConfig.uploadImgServer = path+'admin/kindEditorUpload';
		editor1.customConfig.uploadFileName = 'myFileName';
		editor1.customConfig.debug = true;
		editor1.create();
		$('#liveList').on('click','#upDateM',function(){
			$("#update-live").modal('show');
			changeId = $(this).attr('change-id');
			$(".showImg img").remove();
			$('#upDataCoverImg').val('');
			$('#oldCoverImg').show();
			RequestService(ToURL.live.detailLive()+changeId, 'POST', null, function(res){
				console.log(res.data)
				if(res.data){
					editor1.txt.html(res.data.content);
					$('#teacherName').html(res.data.nickname);
					$('#startTime').val(res.data.startDate);
					$('#endTime').val(res.data.endDate);
					str = res.data.majorIds;
					str1 = res.data.collegeIds;
					if(str != null){
						arr = str.split(",");
						$(".checkMajor").val(arr).trigger('change');
					};
					if(str1 != null){
						arr1 = str1.split(",");
						$(".SchoolList").val(arr1).trigger('change');
					};
					$('#oldCoverImg').attr('src',res.data.coverImg);
					loadData(res.data);
				}
	  		});
		});
		$('#update').on('click',function(){
			var html1 = editor1.txt.html();
			$('#newCourseCon').val(html1);
			var newStart = $('#startTime').val();
			$('#newStartData').val(newStart);
			var newEnd = $('#endTime').val();
			$('#newEndData').val(newEnd);
			var checkMajor = $('#updataMajor').val();
			$('#checkMajorName').val(checkMajor);
			var checkColleges = $('#updataColleges').val();
			$('#checkSchoolName').val(checkColleges);
			var upDateForm = $('#updateliveForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.live.updateLiveData()+changeId, 'POST', finalData, function(res){
				console.log(res)
				if(res.code == 0){
					live.liveList();
					layer.msg('修改成功', {icon: 1});
					$("#update-live").modal('hide');
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
			live.liveList();
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
			live.liveList();
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
				live.liveList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		live.liveList();
		//查询
		live.searchLive();
		//返回
		live.backLiveList();
		//老师列表
		live.teacherData();
		//选择专业
		live.checkMajor();
		//选择学院
		live.checkSchool();
		//添加
		live.addLiveCourse();
		//查看更多
		live.lookMore();
		//删除
		live.deleteLive();
		//修改
		live.updataLive();
		//推送
		live.toHome();
		//点击页码
		live.queryClickPageNO();
		//下一页
		live.nextPage();
		//上一页
		live.prePage();
	}
}