
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

	art.pageInit();
});

var dataBox;
var pageNum = 1;
var createTime;

var art = {
	//获取数据
	artList:function() {
		createTime = $('#create_time').val();
 		var data = {
 			page:pageNum,
 			createData:createTime
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.art.artList(), 'POST', json, function(res){
  			//console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#artList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#artList').show();
  					$('#noData').hide();
  					$("#artList").html(template('artUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchCourse:function(){
		$('#search').on('click',function(){
			art.artList();
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
	//用户列表
	userData:function(){
		$('.js-example-basic-single').select2({
	        width:'333px',
	        height:'33px'
	    });
		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.member.getMember(), 'POST', json, function(res){
  			//console.log(res);
  			if(res.code == 0){
  				$("#checkuser").html(template('userList',{item:res.data.list}));
  			}
  		});
	},
	addArt:function(){
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
		var E;
		var editor;
		E = window.wangEditor
		editor = new E('#editor');
		editor.customConfig.uploadImgServer = path+'admin/kindEditorUpload';
		editor.customConfig.uploadFileName = 'myFileName';
		editor.customConfig.debug = true;
		editor.create();
		$('.user-add').on('click',function(){
			$("#add-art").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#upCoverImg').val('');
			$('.video').hide();
			$('#upVideo').val('');
			$('#upSound').val('');
			$('.mp3Box').hide();
		});
		$('#addBtn').on('click',function(){
			if($('.artImg').val() == ''){
				layer.msg('请先上传文章类型');
				return
			}else if($('#artTit').val() == ''){
				layer.msg('请先上传文章标题');
				return
			}else if($('.checkMajor').val() == null){
				layer.msg('请先选择专业');
				return
			};
			var html = editor.txt.html();
			$('#artCont').val(html);
			console.log(html)
			var selectMaior = $('.checkMajor').val();
			$('#selectMaiorName').val(selectMaior);
			var addForm = $('#addArtForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.art.addArtData(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					art.artList();
					layer.msg('添加成功', {icon: 1});
					$("#add-art").modal('hide');
				}
	  		});
		})
	},
	//查看更多
	lookMore:function(){
		var lookId;
		$('#artList').on('click','#lookDetail',function(){
			layui.use('element', function(){
				var $ = layui.jquery,element = layui.element;
			});
			$('.layui-tab-title').find('li').eq(0).addClass('layui-this').siblings().removeClass('layui-this');
			$("#look-detail").modal('show');
			lookId = $(this).attr('look-id');
			$('#user_major').html('');
			$('#user_school').html('');
			RequestService(ToURL.art.detailArt()+lookId, 'POST', null, function(res){
				console.log(res);
				if(res.code == 0){
	  				$("#artDetail").html(template('artDetailUI',{item:res.data}));
	  			};
	  			$('#artTop').html(res.data.title);
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
	//返回
	backCourseList:function(){
		$('#backdate').on('click',function(){
			$('#create_time').val('');
			pageNum = 1;
			art.artList();
	    });
	},
	//删除
	deleteArt:function() {
		$('#artList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.art.deleteArtData()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					art.artList();
				}
	  		});
		});
	},
	//修改
	upDataArt:function(){
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
		var E1;
		var editor1;
		E1 = window.wangEditor;
		editor1 = new E1('#editor1');
		editor1.customConfig.uploadImgServer = path+'admin/kindEditorUpload';
		editor1.customConfig.uploadFileName = 'myFileName';
		editor1.customConfig.debug = true;
		editor1.create();
		$('#artList').on('click','#upDateM',function(){
			$("#updata-art").modal('show');
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
			RequestService(ToURL.art.detailArt()+changeId, 'POST', null, function(res){
				console.log(res);
				if(res.message == '成功'){
					$('#userNick').html(res.data.nickname);
					loadData(res.data);
					editor1.txt.html(res.data.content);
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
				}else{
					layer.msg('数据获取失败')
				}
	  		});
		});
		$('#update').on('click',function(){
			var html1 = editor1.txt.html();
			$('#newArtContent').val(html1);
			var checkMajor = $('#updataMajor').val();
			$('#newselectMaiorName').val(checkMajor);
			var upDateForm = $('#upDataArtForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.art.updateArtData()+changeId, 'POST', finalData, function(res){
				console.log(res)
				if(res.code == 0){
					art.artList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-art").modal('hide');
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
				RequestService(ToURL.art.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('推送成功', {icon: 1});
						art.artList();
					}
	  			});
			}else if(listNowCon == '取消推送'){
				listCurr = 0;
				RequestService(ToURL.art.ToHomePage()+listCurr+'/'+listId, 'POST', null, function(res){
					if(res.code == 0){
						layer.msg('取消成功', {icon: 1});
						art.artList();
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
			art.artList();
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
			art.artList();
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
				art.artList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		art.artList();
		//查询
		art.searchCourse();
		//删除
		art.deleteArt();
		//用户列表
		art.userData();
		art.upDataArt();
		//选择专业
		art.checkMajor();
		//添加
		art.addArt();
		//查看更多
		art.lookMore();
		//返回
		art.backCourseList();
		//推送
		art.toHome();
		//点击页码
		art.queryClickPageNO();
		//下一页
		art.nextPage();
		//上一页
		art.prePage();
	}
}