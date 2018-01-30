
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

    $(".checkHomeWork").on('click',function(){
		var workType = $(this).val()
		if(workType == '视频'){
			$('.videoBox').show();
			$('.coverBox').hide();
			$('.soundBox').hide();
		}else if(workType == '图片'){
			$('.coverBox').show();
			$('.soundBox').hide();
			$('.videoBox').hide();
		}else if(workType == '音频'){
			$('.soundBox').show();
			$('.coverBox').hide();
			$('.videoBox').hide();
		}
	});

	work.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;
var workType;
var workSource;

var work = {
	//获取数据
	workList:function() {
		createTime = $('#create_time').val();
		workType = $('#work_type').val();
		workSource = $('#work_source').val();
 		var data = {
 			page:pageNum,
 			createDate:createTime,
 			source:workSource,
 			worksType:workType
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.work.workList(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#workList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#workList').show();
  					$('#noData').hide();
  					$("#workList").html(template('workUI',{item:res.data.list}));
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
	//选择专业
	checkMajor:function(){
		$('.sel_productTag').select2({
			placeholder:'请选择...'
		});
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
	//删除
	deleteWork:function() {
		$('#workList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.work.deleteWorkData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					work.workList();
				}
	  		});
		});
	},
	addWork:function(){
		//上传图片
		var UpURL = path+'admin/qiniuUpload';
		$('#upCoverImg').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('upCoverImg').files.length;i++){
		        file = document.getElementById('upCoverImg').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upCoverImg').val('');
		            return;
		        }
		    }
			$('#upCoverImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('.pathSrc').val(data.data.fileName);
		        		layer.msg('上传成功');
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		//上传视频
		var UpURL = path+'admin/qiniuMp4';
		$('#upVideo').change( function() {
			$('#upVideoForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	$('.video').show();
		        	$(".video").attr("src",data.data.fileName);
		        	layer.msg('上传成功');
		        	$('.pathSrc').val(data.data.fileName);
		        }
		    });
			return false;
		});
		//上传音频
		var UpURL = path+'admin/qiniuMp4';
		$('#upSound').change( function() {
			$('#upSoundForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	$('.mp3Box').show();
		        	$('.mp3').attr('src',data.data.fileName);
		        	$('.mp3Box').load();
		        	layer.msg('上传成功');
		        	$('.pathSrc').val(data.data.fileName);
		        }
		    });
			return false;
		});
		$('.user-add').on('click',function(){
			$("#add-work").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#upCoverImg').val('');
			$('.video').hide();
			$('#upVideo').val('');
			$('.mp3Box').hide();
			$('#upSound').val('');
		});
		$('#addBtn').on('click',function(){
			if($('.workImg').val() == ''){
				layer.msg('请先上传作业类型');
				return
			}else if($('#homeworkCon').val() == ''){
				layer.msg('请先上传作业内容');
				return
			}else if($('.checkMajor').val() == null){
				layer.msg('请先上传专业');
				return
			};
			var selectMaior = $('.checkMajor').val();
			$('#selectMaiorName').val(selectMaior);
			var addForm = $('#addWorkForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.work.addWorkData(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					work.workList();
					layer.msg('添加成功', {icon: 1});
					$("#add-work").modal('hide');
				}
	  		});
		})
	},
	//查看更多
	lookMore:function(){
		var lookId;
		$('#workList').on('click','#lookDetail',function(){
			layui.use('element', function(){
				var $ = layui.jquery,element = layui.element;
			});
			$('.layui-tab-title').find('li').eq(0).addClass('layui-this').siblings().removeClass('layui-this');
			$("#look-detail").modal('show');
			lookId = $(this).attr('look-id');
			$('#user_major').html('');
			$('#user_school').html('');
			RequestService(ToURL.work.detailWorkData()+lookId, 'POST', null, function(res){
				console.log(res);
				if(res.code == 0){
	  				$("#workDetail").html(template('workDetailUI',{item:res.data}));
	  			};
	  			$('#artcircle_nick').html(res.data.nickname);
				var majorList = res.data.majorIds;
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
                };
	  		});
		});
	},
	//修改
	upDataWork:function(){
		var changeId = -1;
		var str = '';
		var arr = [];
		//上传图片
		var UpURL = path+'admin/qiniuUpload';
		$('#newImg').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('newImg').files.length;i++){
		        file = document.getElementById('newImg').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upCoverImg').val('');
		            return;
		        }
		    }
			$('#newImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('.newPathSrc').val(data.data.fileName);
		        		layer.msg('上传成功');
		        		$('.oldImg').hide();
						$('.oldSound').hide();
						$('.oldVideo').hide();
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		//上传视频
		var UpURL = path+'admin/qiniuMp4';
		$('#newVideo').change( function() {
			$('#newVideoForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	$('.video').show();
		        	$(".video").attr("src",data.data.fileName);
		        	layer.msg('上传成功');
		        	$('.newPathSrc').val(data.data.fileName);
		        	$('.oldImg').hide();
					$('.oldSound').hide();
					$('.oldVideo').hide();
		        }
		    });
			return false;
		});
		//上传音频
		var UpURL = path+'admin/qiniuMp4';
		$('#newSound').change( function() {
			$('#newSoundForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	$('.mp3Box').show();
		        	$('.mp3').attr('src',data.data.fileName);
		        	$('.mp3Box').load();
		        	layer.msg('上传成功');
		        	$('.newPathSrc').val(data.data.fileName);
		        	$('.oldImg').hide();
					$('.oldSound').hide();
					$('.oldVideo').hide();
		        }
		    });
			return false;
		});
		$('#workList').on('click','#upDateM',function(){
			$("#updata-work").modal('show');
			changeId = $(this).attr('change-id');
			$(".showImg img").remove();
			$('#newImg').val('');
			$('.video').hide();
			$('#newVideo').val('');
			$('#newSound').val('');
			$('.mp3Box').hide();
			$('.oldImg').hide();
			$('.oldSound').hide();
			$('.oldVideo').hide();
			RequestService(ToURL.work.detailWorkData()+changeId, 'POST', null, function(res){
				//console.log(res.data);
				if(res.message == '成功'){
					if(res.data.worksType == '图片'){
						$('.oldImg').show();
						$('.oldImg img').attr('src',res.data.coverImg);
					}else if(res.data.worksType == '音频'){
						$('.oldSound').show();
						$('.oldmp3 .mp3').attr('src',res.data.path);
						$('.oldmp3').load();
					}else if(res.data.worksType == '视频'){
						$('.oldVideo').show();
						$('.oldVideo video').attr('src',res.data.path);
					};
					str = res.data.majorIds;
					if(str != null){
						arr = str.split(",");
						$(".checkMajor").val(arr).trigger('change');
					};
					$('#userNick').html(res.data.nickname);
					var teacher = res.data.teacherId;
					loadData(res.data);
				}else{
					layer.msg('数据获取失败');
				}
	  		});
		});
		$('#update').on('click',function(){
			var checkMajor = $('#updataMajor').val();
			$('#newselectMaiorName').val(checkMajor);
			var upDateForm = $('#upDataWorkForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.work.updateWorkData()+changeId, 'POST', finalData, function(res){
				//console.log(res)
				if(res.code == 0){
					work.workList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-work").modal('hide');
				}
	  		});
		})
	},
	toHome:function(){
		var listCurr;
		var listId;
		var listNowCon;
		$('tbody').on('click','.tolist',function(){
			listId = $(this).attr("list-id");
			listNowCon = $(this).html();
			if(listNowCon == '推至首页'){
				listCurr = 1;
				RequestService(ToURL.work.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('推送成功', {icon: 1});
						work.workList();
					}
	  			});
			}else if(listNowCon == '取消推送'){
				listCurr = 0;
				RequestService(ToURL.work.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('取消成功', {icon: 1});
						work.workList();
					}
  				});
			}
		});
	},
	//置顶
	workTop:function(){
		var topId;
		var topCon;
		$('tbody').on('click','#totop',function(){
			topId = $(this).attr("top-id");
			topCon = $(this).html();
			if(topCon == '置顶'){
				RequestService(ToURL.work.ToTop()+topId, 'POST', null, function(res){
		  			console.log(res);
		  			if(res.code == 0){
						layer.msg('置顶成功', {icon: 1});
						work.workList();
					}
		  		});
			}else if(topCon == '取消置顶'){
				RequestService(ToURL.work.cancelTop()+topId, 'POST', null, function(res){
		  			console.log(res);
		  			if(res.code == 0){
						layer.msg('取消成功', {icon: 1});
						work.workList();
					}
		  		});
			}
		})
	},
	//查询
	searchWork:function(){
		$('#search').on('click',function(){
			work.workList();
	    });
	},
	//返回
	backWorkList:function(){
		$('#backdate').on('click',function(){
			$('#create_time').val('');
			$('#work_type').val('');
			$('#work_source').val('');
			pageNum = 1;
			work.workList();
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
			work.workList();
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
			work.workList();
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
				work.workList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		work.workList();
		work.userData();
		//老师列表
		work.teacherData();
		//选择专业
		work.checkMajor();
		work.deleteWork();
		//添加
		work.addWork();
		//查看更多
		work.lookMore();
		//修改
		work.upDataWork();
		//推送到首页
		work.toHome();
		//置顶
		work.workTop();
		//查询
		work.searchWork();
		//返回
		work.backWorkList();
		//点击页码
		work.queryClickPageNO();
		//下一页
		work.nextPage();
		//上一页
		work.prePage();
	}
}