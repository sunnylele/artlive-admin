
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

	member.pageInit();
});

var dataBox;
var pageNum = 1;
var nickName;
var telPhone;
var createTime;
var userType;
var member = {
	//获取数据
	memberList:function() {
		nickName = $('#nick_name').val();
		telPhone = $('#tel_phone').val();
		createTime = $('#create_time').val();
		userType = $('#user_type').val();
		if(userType == '普通用户'){
			userType = 1;
		}else if(userType == '达人'){
			userType = 2;
		}else if(userType == '名师'){
			userType = 3;
		}else if(userType == '大师'){
			userType = 4;
		}else if(userType == '官方管理员'){
			userType = 5;
		}
 		var data = {
 			page:pageNum,
  			nickname:nickName,
  			mobile:telPhone,
  			createDate:createTime,
  			userType:userType
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.getMember(), 'POST', json, function(res){
  			//console.log(res)
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#memberList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#memberList').show();
  					$('#noData').hide();
  					$("#memberList").html(template('memberUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchMember:function(){
		$('#search').on('click',function(){
			member.memberList();
	    });
	},
	//返回
	backMemberList:function(){
		$('#backdate').on('click',function(){
			$('#nick_name').val('');
			$('#tel_phone').val('');
			$('#create_time').val('');
			$('#user_type').val('');
			pageNum = 1;
			member.memberList();
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
	//添加
	addMember:function(){
		var UpURL = path+'admin/qiniuUpload';
		$('#upPhoto').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('upPhoto').files.length;i++){
		        file = document.getElementById('upPhoto').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upPhoto').val('');
		            return;
		        }
		    }
			$('#upPhotoForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('#addPhoto').val(data.data.fileName);
		        		layer.msg('上传成功');
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		$('.js-example-basic-single').select2({
	        width:'330px',
	        height:'33px'
	    });
		$('.user-add').on('click',function(){
			$("#add-member").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#upPhoto').val('');
		});
		$('#addBtn').on('click',function(){
			if($('#upPhoto').val() == ''){
				layer.msg('请先上传头像');
				return
			}else if($('#realName').val() == ''){
				layer.msg('请先输入真实姓名');
				$('#realName').focus();
				return
			}else if($('#nickName').val() == ''){
				layer.msg('请先输入昵称');
				$('#nickName').focus();
				return
			}else  if($('#telPhone').val() == ''){
				layer.msg('请先输入手机号码');
				$('#telPhone').focus();
				return
			}else if($('.checkMajor').val() == null){
				layer.msg('请先选择专业');
				return
			}else if($('.SchoolList').val() == null){
				layer.msg('请先选择学院');
				return
			}else if($('#mess').val() == ''){
				layer.msg('请先输入头衔');
				$('#mess').focus();
				return
			}else if($('#details').val() == ''){
				layer.msg('请先输入个人简介');
				$('#details').focus();
				return
			}
			var addMaior = $('.addMajorList').val();
			$('#addMaiorName').val(addMaior);
			var addColleges = $('.addSchoolList').val();
			$('#addSchoolName').val(addColleges);
			var addForm = $('#addMemberForm').serializeArray();
			var addData = {};
		    $.each(addForm, function(){
		      	addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
		    //console.log(params);
			RequestService(ToURL.member.addMember(), 'POST', params, function(res){
				if(res.code == 0){
					member.memberList();
					layer.msg('添加成功', {icon: 1});
					$("#add-member").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteCourse:function() {
		$('#memberList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.member.deleteMember()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					member.memberList();
				}
	  		});
		});
	},
	//修改
	updateMember:function() {
		var changeId = -1;
		var str = '';
		var arr = [];
		var str1 = '';
		var arr1 = [];
		var UpURL = path+'admin/qiniuUpload';
		$('#upDataPhoto').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('upDataPhoto').files.length;i++){
		        file = document.getElementById('upDataPhoto').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#upDataPhoto').val('');
		            return;
		        }
		    }
			$('#upDataPhotoForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('#newPhoto').val(data.data.fileName);
		        		layer.msg('上传成功');
		        		$('#oldPhoto').hide();
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		$('#memberList').on('click','#upDateM',function(){
			$("#update-member").modal('show');
			changeId = $(this).attr('change-id');
			$(".showImg img").remove();
			$('#upDataPhoto').val('');
			$('#oldPhoto').show();
			RequestService(ToURL.member.detailMember()+changeId, 'GET', null, function(res){
				console.log(res)
				if(res.data){
					$('#oldPhoto').attr('src',res.data.photo);
					loadData(res.data);
					$('#birth').val(toTime(res.data.birthday));
					str = res.data.major;
					str1 = res.data.college;
					if(str != null){
						arr = str.split(",");
						$(".checkMajor").val(arr).trigger('change');
					};
					if(str1 != null){
						arr1 = str1.split(",");
						$(".SchoolList").val(arr1).trigger('change');
					};
					var numType = res.data.userType;
					$("#updataUserType").val(numType).trigger('change');
				}
	  		});
		});
		$('#update').on('click',function(){
			var newBirth = $('#birth').val();
			$('#updataBirth').val(newBirth);
			var checkMajor = $('#updataMajor').val();
			$('#checkMajorName').val(checkMajor);
			var checkColleges = $('#updataColleges').val();
			$('#checkSchoolName').val(checkColleges);
			var upDateForm = $('#updateMemberForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.member.updateMember()+changeId, 'POST', finalData, function(res){
				if(res.code == 0){
					member.memberList();
					layer.msg('修改成功', {icon: 1});
					$("#update-member").modal('hide');
				}
	  		});
		})
	},
	//查看更多
	lookMore:function(){
		var lookId;
		$('#memberList').on('click','#lookDetail',function(){
			$("#look-detail").modal('show');
			lookId = $(this).attr('look-id');
			$('#user_major').html('');
			$('#user_school').html('');
			RequestService(ToURL.member.detailMember()+lookId, 'GET', null, function(res){
				console.log(res);
				$('#user_nick').html(res.data.nickname);
				$('#user_name').html(res.data.realname);
				if(res.data.sex == 0){
					$('#user_sex').html('男');
				}else if(res.data.sex == 1){
					$('#user_sex').html('女');
				}else if(res.data.sex == 2){
					$('#user_sex').html('保密');
				}
				$('#user_birth').html(toTime(res.data.birthday));
				$('#user_tel').html(res.data.mobile);
				$('#user_emil').html(res.data.email);
				$('#user_intro').html(res.data.intro);
				$('#user_country').html(res.data.country);
				$('#user_city').html(res.data.city);
				$('#myselfPhoto').attr('src',res.data.photo);
				$('#userDetailCont').html(res.data.details);
				var majorList = res.data.major;
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
				var school = res.data.college;
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
                }
				if(res.data.userType == 1){
					$('#typeColor').html('普通用户');
				}else if(res.data.userType == 2){
					$('#typeColor').html('达人');
				}else if(res.data.userType == 3){
					$('#typeColor').html('名师');
				}else if(res.data.userType == 4){
					$('#typeColor').html('大师');
				};
	  		});
		});
	},
	//审核
	authUser:function(){
		function authList(){
			RequestService(ToURL.member.authUserDetail()+authId, 'POST', null, function(res){
				console.log(res)
				$("#auth-user").modal('show');
				$('.user_id').html(res.data.id);
				$('.user_nick').html(res.data.nickname);
				$('.user_name').html(res.data.realname);
				$('.user_realm').html(res.data.realm);
				$('.user_intro').html(res.data.intro);
				$('.user_pic').html(res.data.pic);
				$('#userAuthId').val(res.data.id);
				$('#usersId').val(res.data.userId);
	  		});
		};
		function authListDetail(){
			RequestService(ToURL.member.authUserDetail()+authId, 'POST', null, function(res){
				console.log(res)
				$("#auth-user-detail").modal('show');
				$('.user_id').html(res.data.id);
				$('.user_nick').html(res.data.nickname);
				$('.user_name').html(res.data.realname);
				$('.user_realm').html(res.data.realm);
				$('.user_intro').html(res.data.intro);
				$('.user_pic').html(res.data.pic);
	  		});
		};
		var authId;
		var authCon;
		var apply;
		$('tbody').on('click','#authBtn',function(){
			authId = $(this).attr('auth-id');
			authCon = $(this).html();
			if(authCon == '未认证'){
				layer.msg('该用户未上传认证资料');
			}else if(authCon == '待审核'){
				authList();
			}else if(authCon == '审核通过'){
				authListDetail();
			}else if(authCon == '审核不通过'){
				authList();
			}
		});
		$('#authSuccess').on('click',function(){
			var authBtn = $(this).html();
			if(authBtn == '通过'){
				authBtn = 1;
			}
			$('#authStatus').val(authBtn);
			str = sessionStorage.manager;
			obj = JSON.parse(str);
			$('#adminId').val(obj.id);
			var authForm = $('#authForm').serializeArray();
			var authData = {};
		    $.each(authForm, function() {
		      authData[this.name] = this.value;
		    });
		    var params = JSON.stringify(authData);
			RequestService(ToURL.member.authUser(), 'POST', params, function(res){
				console.log(res)
				if(res.code == 0){
					layer.msg('审核通过', {icon: 6});
					$("#auth-user").modal('hide');
					member.memberList();
				}
	  		});
		});
		$('#authFail').on('click',function(){
			var authBtn = $(this).html();
			if(authBtn == '不通过'){
				authBtn = 2;
			}
			$('#authStatus').val(authBtn);
			str = sessionStorage.manager;
			obj = JSON.parse(str);
			$('#adminId').val(obj.id);
			var authForm = $('#authForm').serializeArray();
			var authData = {};
		    $.each(authForm, function() {
		      authData[this.name] = this.value;
		    });
		    var params = JSON.stringify(authData);
			RequestService(ToURL.member.authUser(), 'POST', params, function(res){
				if(res.code == 0){
					layer.msg('审核不通过', {icon: 5});
					$("#auth-user").modal('hide');
					member.memberList();
				}
	  		});
		});
	},
	//打标签
	labelList:function(){
		var labelId = -1;
		$('#memberList').on('click','#labelBtn',function(){
			$("#add-label").modal('show');
			labelId = $(this).attr('label-id');
		});
		$('#addLabelBtn').on('click',function(){
			var selectMajor = $('.selectMajor').val();
			$('#selectMaiorName').val(selectMajor);
			var selectCollegs = $('.selectCollegs').val();
			$('#selectCollegsName').val(selectCollegs);
			var labelForm = $('#addlabelForm').serializeArray();
			var addData = {};
		    $.each(labelForm, function(){
		      	addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
		    //console.log(params);
			RequestService(ToURL.member.labelData()+labelId, 'POST', params, function(res){
				if(res.code == 0){
					member.memberList();
					layer.msg('添加成功', {icon: 1});
					$("#add-label").modal('hide');
				}
	  		});
		});
	},
	//上传作品
	uploadWorks:function(){
		var teacherId;
		var bflag;
		$('tbody').on('click','.upload',function(){
			bflag = $(this).html();
			console.log(bflag);
			if(bflag == '上传作品'){
				$('#video').hide();
				$(".showImg img").remove();
				$('#upVideo').val('');
				$('#ImageShine').val('');
				$("#upload-works").modal('show');
				teacherId = $(this).attr('upload-id');
				$('#teacher_id').val(teacherId);
				RequestService(ToURL.member.detailMember()+teacherId, 'GET', null, function(res){
					$('#teacherName').html(res.data.realname);
		  		});
		  		//形象照
		  		var UpURL = path+'admin/qiniuUpload';
				$('#ImageShine').change( function() {
					var file;
				    for(var i=0; i<document.getElementById('ImageShine').files.length;i++){
				        file = document.getElementById('ImageShine').files[i];
				        if(!/image\/\w+/.test(file.type)){
				            layer.msg('上传失败，请上传图片类型');
				            $('#ImageShine').val('');
				            return;
				        }
				    }
					$('#ImageShineForm').ajaxSubmit({
					    type: 'POST',
					    url: UpURL,
						dataType : 'json',
				        success: function(data) {
				        	console.log(data)
				        	if(data.code == 0){
				        		$('#ImageShineSrc').val(data.data.fileName);
				        		layer.msg('上传成功');
				        	}
				        }
				    });
				    selectionImg($(this));
					return false;
				});
				//上传视频
				var UpURL = path+'qiniuMp4';
				$('#upVideo').change( function() {
					$('#upVideoForm').ajaxSubmit({
					    type: 'POST',
					    url: UpURL,
						dataType : 'json',
				        success: function(data) {
				        	$('#video').show();
				        	$("#video").attr("src",data.data.fileName);
				        	layer.msg('上传成功');
				        	$('#videoSrc').val(data.data.fileName);
				        }
				    });
					return false;
				});
				$('#uploadBtn').on('click',function(){
					var uploadWorksList = $('#uploadWorksForm').serializeArray();
					var uploadData = {};
				    $.each(uploadWorksList, function() {
				      uploadData[this.name] = this.value;
				    });
				    var params = JSON.stringify(uploadData);
					RequestService(ToURL.member.updateMember()+teacherId, 'POST', params, function(res){
						if(res.code == 0){
							member.memberList();
							layer.msg('上传成功', {icon: 1});
							$("#upload-works").modal('hide');
						}
			  		});
				});
			}
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
			if(listNowCon == '推至首页'){
				listCurr = 1;
				RequestService(ToURL.member.ToHomePage()+listId+'/'+listCurr, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('推送成功', {icon: 1});
						member.memberList();
					}
	  			});
			}else if(listNowCon == '取消推送'){
				listCurr = 0;
				RequestService(ToURL.member.ToHomePage()+listId+'/'+listCurr, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('取消成功', {icon: 1});
						member.memberList();
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
			member.memberList();
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
			member.memberList();
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
				member.memberList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		member.memberList();
		//查询
		member.searchMember();
		//返回
		member.backMemberList();
		//专业
		member.checkMajor();
		//院校
		member.checkSchool();
		//添加
		member.addMember();
		//删除
		member.deleteCourse();
		//修改
		member.updateMember();
		//查看
		member.lookMore();
		//审核
		member.authUser();
		//打标签
		member.labelList();
		member.toHome();
		//上传作品
		member.uploadWorks();
		//点击页码
		member.queryClickPageNO();
		//下一页
		member.nextPage();
		//上一页
		member.prePage();
	}
}