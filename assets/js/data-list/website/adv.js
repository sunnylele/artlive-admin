
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

	adv.pageInit();
});

var dataBox;
var pageNum = 1;
var titleAdv;
var typeAdv;

var adv = {
	//获取数据
	advList:function() {
		titleAdv = $('#title_adv').val();
		typeAdv = $('#type_adv').val();
 		var data = {
 			page:pageNum,
 			title:titleAdv,
 			type:typeAdv
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.site.advList(), 'POST', json, function(res){
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#advList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#advList').show();
  					$('#noData').hide();
  					$("#advList").html(template('advUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchAdv:function(){
		$('#search').on('click',function(){
			adv.advList();
	    });
	},
	//返回
	backAdvList:function(){
		$('#backdate').on('click',function(){
			$('#title_adv').val('');
			$('#type_adv').val('');
			pageNum = 1;
			adv.advList();
	    });
	},
	//删除
	deleteAdv:function() {
		$('#advList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.site.deleteAdv()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					adv.advList();
				}
	  		});
		});
	},
	//添加
	addAdvList:function(){
		var UpURL = path+'admin/qiniuUpload';
		// $('#pcFileImg').change( function() {
		// 	var file;
		//     for(var i=0; i<document.getElementById('pcFileImg').files.length;i++){
		//         file = document.getElementById('pcFileImg').files[i];
		//         if(!/image\/\w+/.test(file.type)){
		//             layer.msg('上传失败，请上传图片类型');
		//             $('#pcFileImg').val('');
		//             return;
		//         }
		//     }
		// 	$('#pcImgForm').ajaxSubmit({
		// 	    type: 'POST',
		// 	    url: UpURL,
		// 		dataType : 'json',
		//         success: function(data) {
		//             console.log(data);
		//             layer.msg('上传成功');
		//             $('#upPcimgSrc').val(data.data.fileName);
		//         }
		//     });
		//     selectionImg($(this));
		// 	return false;
		// });
		$('#mobileImg').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('mobileImg').files.length;i++){
		        file = document.getElementById('mobileImg').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#mobileImg').val('');
		            return;
		        }
		    }
			$('#phoneImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            layer.msg('上传成功');
		            $('#upMobileimgSrc').val(data.data.fileName);
		        }
		    });
		    selectionImg($(this));
		    return false;
		});
		$('.user-add').on('click',function(){
			$("#add-adv").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#pcFileImg').val('');
			$('#mobileImg').val('');
		});
		$('#addAddBtn').on('click',function(){
			var addForm = $('#addAdvForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService('system/addSystemAd', 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					adv.advList();
					layer.msg('添加成功', {icon: 1});
					$("#add-adv").modal('hide');
				}
	  		});
		});
	},
	//修改
	upDataAdv:function(){
		var changeId = -1;
		var str = '';
		var arr = [];
		//上传图片
		var UpURL = path+'admin/qiniuUpload';
		$('#newMobileImg').change( function() {
			var file;
		    for(var i=0; i<document.getElementById('newMobileImg').files.length;i++){
		        file = document.getElementById('newMobileImg').files[i];
		        if(!/image\/\w+/.test(file.type)){
		            layer.msg('上传失败，请上传图片类型');
		            $('#newMobileImg').val('');
		            return;
		        }
		    }
			$('#newPhoneImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		        	console.log(data)
		        	if(data.code == 0){
		        		$('#newMobileimgSrc').val(data.data.fileName);
		        		layer.msg('上传成功');
		        		$('.oldImg').hide();
		        	}
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		$('#advList').on('click','#upDateM',function(){
			$("#updata-adv").modal('show');
			changeId = $(this).attr('change-id');
			$(".showImg img").remove();
			$('#newMobileImg').val('');
			$('.oldImg').show();
			RequestService(ToURL.site.detailAdvData()+changeId, 'POST', null, function(res){
				console.log(res);
				if(res.message == '成功'){
					loadData(res.data);
					$('.oldImg img').attr('src',res.data.mobileImgUrl);
				}else{
					layer.msg('数据获取失败')
				}
	  		});
		});
		$('#update').on('click',function(){
			var upDateForm = $('#upDataAdvForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.site.updateAdvData()+changeId, 'POST', finalData, function(res){
				console.log(res)
				if(res.code == 0){
					adv.advList();
					layer.msg('修改成功', {icon: 1});
					$("#updata-adv").modal('hide');
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
			adv.advList();
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
			adv.advList();
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
				adv.advList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		adv.advList();
		//查询
		adv.searchAdv();
		//返回
		adv.backAdvList();
		//删除
		adv.deleteAdv();
		//添加
		adv.addAdvList();
		//修改
		adv.upDataAdv();
		//点击页码
		adv.queryClickPageNO();
		//下一页
		adv.nextPage();
		//上一页
		adv.prePage();
	}
}