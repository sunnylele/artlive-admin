
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

	about.pageInit();
});

var dataBox;
var pageNum = 1;
var Vers;

var about = {
	//获取数据
	aboutList:function() {
		Vers = $('#create_time').val();
 		var data = {
 			page:pageNum
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.footMenu.aboutData(), 'POST', json, function(res){
  			console.log(res);
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#aboutList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#aboutList').show();
  					$('#noData').hide();
  					$("#aboutList").html(template('aboutUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchAbout:function(){
		$('#search').on('click',function(){
			about.aboutList();
	    });
	},
	//返回
	backAboutList:function(){
		$('#backdate').on('click',function(){
			Vers = $('#vers').val('');
			pageNum = 1;
			about.aboutList();
	    });
	},
	//删除
	deleteAbout:function() {
		$('#aboutList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.footMenu.deleteAbout()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					about.aboutList();
				}
	  		});
		});
	},
	//添加
	addAbout:function(){
		var UpURL = path+'admin/qiniuUpload';
		$('#logoImg').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('logoImg').files.length;i++){
		        file = document.getElementById('logoImg').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#logoImg').val('');
		            return;
		        }
		    }
			$('#logoImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            $('#upImgSrc').val(data.data.fileName);
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
			$("#add-about").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#logoImg').val('');
		});
		$('#addBtn').on('click',function(){
			var html = editor.txt.html();
			$('#aboutCon').val(html);
			var addForm = $('#addAboutForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService('about/save', 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					about.aboutList();
					layer.msg('添加成功', {icon: 1});
					$("#add-about").modal('hide');
				}
	  		});
		});
	},
	//修改
	updateAbout:function() {
		var E1;
		var editor1;
		E1 = window.wangEditor;
		editor1 = new E1('#editor1');
		editor1.customConfig.uploadImgServer = path+'admin/kindEditorUpload';
		editor1.customConfig.uploadFileName = 'myFileName';
		editor1.customConfig.debug = true;
		editor1.create();
		var changeId = -1;
		$('#aboutList').on('click','#upDateM',function(){
			$("#update-about").modal('show');
			changeId = $(this).attr('change-id');
			editor1.txt.html('');
			RequestService(ToURL.footMenu.detailAbout()+changeId, 'POST', null, function(res){
				loadData(res);
				editor1.txt.html(res.content);
	  		});
		});
		$('#updateA').on('click',function(){
			var html1 = editor1.txt.html();
			$('#newCon').val(html1);
			var upDateForm = $('#updateAboutForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var params = JSON.stringify(upData);
			RequestService(ToURL.footMenu.updateAbout()+changeId, 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					about.aboutList();
					layer.msg('修改成功', {icon: 1});
					$("#update-about").modal('hide');
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
			about.aboutList();
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
			about.aboutList();
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
				about.aboutList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		about.aboutList();
		//查询
		about.searchAbout();
		//返回
		about.backAboutList();
		//删除
		about.deleteAbout();
		//修改
		about.updateAbout();
		//添加
		about.addAbout();
		//点击页码
		about.queryClickPageNO();
		//下一页
		about.nextPage();
		//上一页
		about.prePage();
	}
}