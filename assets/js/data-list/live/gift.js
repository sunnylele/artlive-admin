
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

	gift.pageInit();
});

var dataBox;
var pageNum = 1;

var gift = {
	//获取数据
	giftList:function() {
 		var data = {
 			page:pageNum,
  		};
  		var json = JSON.stringify(data);
  		RequestService(ToURL.live.giftData(), 'POST', json, function(res){
  			console.log(res)
  			dataBox = res.data;
  			$('#pages-box').html('');
  			if(res.code == 0){
  				if(res.data.list == '') {
  					$('#giftList').hide();
  					$('#noData').show();
  					return
  				}else{
  					$('#giftList').show();
  					$('#noData').hide();
  					$("#giftList").html(template('giftUI',{item:res.data.list}));
  					rendPage(dataBox);
  				}
  			}
  		});
	},
	//查询
	searchGift:function(){
		$('#search').on('click',function(){
			gift.giftList();
	    });
	},
	//返回
	backGiftList:function(){
		$('#backdate').on('click',function(){
			pageNum = 1;
			gift.giftList();
	    });
	},
	//添加
	addGiftData:function(){
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
		$('.user-add').on('click',function(){
			$("#add-gift").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');
			$(".showImg img").remove();
			$('#upCoverImg').val('');
		});
		$('#addBtn').on('click',function(){
			var addForm = $('#addGiftForm').serializeArray();
			var addData = {};
		    $.each(addForm, function() {
		      addData[this.name] = this.value;
		    });
		    var params = JSON.stringify(addData);
			RequestService(ToURL.live.addGift(), 'POST', params, function(res){
				console.log(res);
				if(res.code == 0){
					gift.giftList();
					layer.msg('添加成功', {icon: 1});
					$("#add-gift").modal('hide');
				}
	  		});
		});
	},
	//删除
	deleteGiftData:function() {
		$('#giftList').on('click','#deleteR',function(){
			var delId = $(this).attr('del-id');
			RequestService(ToURL.live.deleteGift()+delId, 'DELETE', null, function(res){
				if(res.code == 0){
					layer.msg('删除成功', {icon: 1});
					gift.giftList();
				}
	  		});
		});
	},
	//修改
	updataGiftData:function(){
		var changeId = -1;
		var UpURL = path+'admin/qiniuUpload';
		$('#upDataImg').change( function() {
			$('#upDataImgForm').ajaxSubmit({
			    type: 'POST',
			    url: UpURL,
				dataType : 'json',
		        success: function(data) {
		            console.log(data);
		            $('#newImgSrc').val(data.data.fileName);
		            layer.msg('上传成功');
		            $('#oldImg').hide();
		        }
		    });
		    selectionImg($(this));
			return false;
		});
		$('#giftList').on('click','#upDateM',function(){
			$("#update-gift").modal('show');
			changeId = $(this).attr('change-id');
			$(".showImg img").remove();
			$('#upDataImg').val('');
			$('#oldImg').show();
			RequestService(ToURL.live.detailGift()+changeId, 'POST', null, function(res){
				console.log(res)
				if(res.data){
					$('#oldImg').attr('src',res.data.img)
					loadData(res.data);
				}
	  		});
		});
		$('#update').on('click',function(){
			var upDateForm = $('#updateGiftForm').serializeArray();
			var upData = {};
		    $.each(upDateForm, function() {
		      	upData[this.name] = this.value;
		    });
		    var finalData = JSON.stringify(upData);
			RequestService(ToURL.live.updateGift()+changeId, 'POST', finalData, function(res){
				console.log(res)
				if(res.code == 0){
					gift.giftList();
					layer.msg('修改成功', {icon: 1});
					$("#update-gift").modal('hide');
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
			gift.giftList();
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
				gift.giftList();
			}
		});
	},


	pageInit:function() {
		//获取数据
		gift.giftList();
		//查询
		gift.searchGift();
		//返回
		gift.backGiftList();
		//添加
		gift.addGiftData();
		//删除
		gift.deleteGiftData();
		//修改
		gift.updataGiftData();
		//点击页码
		gift.queryClickPageNO();
		//下一页
		gift.nextPage();
		//上一页
		gift.prePage();
	}
}