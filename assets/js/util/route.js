/**
 * Created by jm on 2017/11/7.
 */


//后台系统统一路由配置
var ToURL = {

    //首页
    home:{
        initAppToken:function() {
            return 'admin/security/apptoken';
        }
    },
    //后台管理员管理
    manager:{
        //管理员管理
        getManager:function(){
            return 'admin/manager/list';
        },
        addUser:function(){
            return 'admin/manager/add';
        },
        deleteUser:function(){
            return 'admin/manager/delete/';
        },
        batchDelete:function(){
            return 'admin/manager/deleteByIds/';
        },
        detailUser:function(){
            return 'admin/manager/';
        },
        updateUser:function(){
            return 'admin/manager/update/';
        },
        //角色管理
        getRoleList:function(){
            return 'admin/manager/listRole';
        },
        addRole:function(){
            return 'admin/manager/addRole';
        },
        deleteRole:function(){
            return 'admin/manager/deleteRoleById/';
        },
        findAllRole:function(){
            return 'admin/manager/findAllRole';
        },
        //权限管理
        getAuthList:function(){
            return 'admin/manager/listAuth';
        },
        addAuth:function(){
            return 'admin/manager/addAuth';
        },
        deleteAuth:function(){
            return 'admin/manager/delAuth/';
        },
        detailAuth:function(){
            return 'admin/manager/findAuthById/';
        },
        updateAuth:function(){
            return 'admin/manager/updateAuth/';
        },
        checkAuthList:function(){
            return 'admin/manager/findAuthByMid/';
        }
    },
    //用户管理
    member:{
        //会员管理
        getMember:function() {
            return 'admin/user/selectUserinfoList';
        },
        addMember:function(){
            return 'admin/user/addUser';
        },
        deleteMember:function() {
            return 'admin/user/delUser/';
        },
        detailMember:function(){
            return 'admin/user/showUserById/';
        },
        updateMember:function(){
            return 'admin/user/updateUser/';
        },
        authUser:function(){
            return 'admin/user/identityAuth';
        },
        authUserDetail:function(){
            return 'admin/user/showIdentityAuth/';
        },
        labelData:function(){
            return 'admin/user/teachReplenishInfo/';
        },
        majorData:function(){
            return 'admin/user/selectMajors';
        },
        addMajorData:function(){
            return 'admin/user/addMajors';
        },
        deleteMajorData:function(){
            return 'admin/user/deleteMajors/';
        },
        detailMajor:function(){
            return 'admin/user/showMajors/';
        },
        updateMajor:function(){
            return 'admin/user/updateMajors/';
        },
        collegesData:function(){
            return 'admin/user/selectColleges';
        },
        addCollegges:function(){
            return 'admin/user/addColleges'
        },
        deleteCollegges:function(){
            return 'admin/user/deleteColleges/';
        },
        detailCollegges:function(){
            return 'admin/user/showColleges/';
        },
        updateCollegges:function(){
            return 'admin/user/updateColleges/';
        },
        ToHomePage:function(){
            return 'admin/user/pushHomeUser/';
        },
        findStudent:function(){
            return 'admin/user/findAllStudent';
        },
        findTeacher:function(){
            return 'admin/user/findAllTeacher';
        },
        //积分管理
        scoreData:function(){
            return 'admin/score/list';
        },
        detailScore:function(){
            return 'admin/score/';
        },
        updateScore:function(){
            return 'admin/score/update/';
        }
    },
    //预约课程
    course:{
        getList:function(){
            return 'admin/course/findCourseList';
        },
        addCourse:function(){
            return 'admin/course/addCourse';
        },
        deleteCourse:function(){
            return 'admin/course/deleteCourse/';
        },
        detailCourse:function(){
            return 'admin/course/showCourse/';
        },
        updateCourse:function(){
            return 'admin/course/updateCourse/';
        },
        ToHomePage:function(){
            return 'admin/course/pushHome/';
        }
    },
    art:{
        artList:function(){
            return 'admin/artcircle/selectArtcircleList';
        },
        addArtData:function(){
            return 'admin/artcircle/addArtcircle';
        },
        deleteArtData:function(){
            return 'admin/artcircle/delete/';
        },
        detailArt:function(){
            return 'admin/artcircle/showArtcircle/';
        },
        updateArtData:function(){
            return 'admin/artcircle/updateArtcircle/'
        },
        ToHomePage:function(){
            return 'admin/artcircle/pushHome/';
        }
    },
    work:{
        workList:function(){
            return 'admin/homework/selectHomeworkAdmin';
        },
        addWorkData:function(){
            return 'admin/homework/addHomeWork';
        },
        detailWorkData:function(){
            return 'admin/homework/showHomeWorkAdmin/';
        },
        updateWorkData:function(){
            return 'admin/homework/updateHomeWork/'
        },
        deleteWorkData:function(){
            return 'admin/homework/delete/';
        },
        ToHomePage:function(){
            return 'admin/homework/pushHome/';
        },
        ToTop:function(){
            return 'admin/homework/homeworkTop/';
        },
        cancelTop:function(){
            return 'admin/homework/cancalHomeworkTop/';
        }
    },
    //直播管理
    live:{
        liveList:function() {
            return 'admin/live/findCourseList';
        },
        addLive:function(){
            return 'admin/live/save';
        },
        teacherList:function(){
            return 'admin/live/teacher';
        },
        ToHomePage:function(){
            return 'admin/live/pushHome/';
        },
        majorList:function(){
            return 'admin/preference/collegesMajors';
        },
        deleteLiveData:function(){
            return 'admin/live/deleteLive/';
        },
        detailLive:function(){
            return 'admin/live/showLive/';
        },
        updateLiveData:function(){
            return 'admin/live/updateLive/';
        },
        giftData:function(){
            return 'admin/live/gift/findGiftList';
        },
        addGift:function(){
            return 'admin/live/gift/addGift';
        },
        deleteGift:function(){
            return 'admin/live/gift/deleteGift/';
        },
        detailGift:function(){
            return 'admin/live/gift/showGift/';
        },
        updateGift:function(){
            return 'admin/live/gift/updateGift/';
        },
        homeworkData:function(){
            return 'admin/teacherhomework/selectHomeworkPublicAdmin';
        },
        addTeacherWork:function(){
            return 'admin/teacherhomework/addHomeWorkPublicAdmin';
        },
        deleteTeacherWork:function(){
            return 'admin/teacherhomework/deleteHomeWorkPublicAdmin/';
        },
        detailTeacherWork:function(){
            return 'admin/teacherhomework/showHomeWorkPublicAdmin/';
        },
        updateTeacherWork:function(){
            return 'admin/teacherhomework/updateHomeWorkPublicAdmin/';
        }
    },
    //网站管理
    site:{
        advList:function(){
            return 'admin/system/selectSystemAdAdmin';
        },
        deleteAdv:function(){
            return 'admin/system/delSystemAd/';
        },
        addAdvData:function(){
            return 'admin/system/addSystemAd';
        },
        detailAdvData:function(){
            return 'admin/system/showSystemAd/';
        },
        updateAdvData:function(){
            return 'admin/system/updateSystemAd/'
        },
        feedbackData:function(){
            return 'admin/feedback/list';
        },
        reportData:function(){
            return 'admin/complain/list';
        }

    },
    //系统管理
    news:{
        newsData:function(){
            return 'admin/message/list';
        },
    },
    system:{
        cepingData:function(){
            return 'admin/evaluation/selectList'
        },
        deleteCepingData:function(){
            return 'admin/evaluation/delete/'
        },
        detailCepingData:function(){
            return 'admin/evaluation/showById/'
        },
        updateCepingData:function(){
            return 'admin/evaluation/update/'
        },
        dictData:function(){
            return 'admin/dict/list';
        },
        logData:function(){
            return '';
        },
        coachData:function(){
            return 'admin/usercost/selectUserCost';
        },
        addCoachData:function(){
            return 'admin/usercost/addUserCost';
        },
        deleteCoachData:function(){
            return 'admin/usercost/deleteUserCost/';
        },
        detailCoachData:function(){
            return ''
        },
        updateCoachData:function(){
            return 'admin/usercost/updateUserCost/'
        }
    },
    footMenu:{
        footMenuData:function(){
            return 'admin/footMenu/list'
        },
        addFootMenu:function(){
            return 'admin/footMenu/add'
        },
        deleteFootMenu:function(){
            return 'admin/footMenu/delete/'
        },
        detailFootMenu:function(){
            return 'admin/footMenu/'
        },
        aboutData:function(){
            return 'admin/about/list';
        },
        addAbout:function(){
            return 'admin/about/save';
        },
        deleteAbout:function(){
            return 'admin/about/delete/';
        },
        detailAbout:function(){
            return 'admin/about/';
        },
        updateAbout:function(){
            return 'admin/about/update/'
        },
        helpData:function(){
            return 'admin/help/list';
        },
        addHelp:function(){
            return 'admin/help/addHelp';
        },
        deleteHelp:function(){
            return 'admin/help/delete/';
        },
        detailHelp:function(){
            return 'admin/help/';
        },
        updateHelp:function(){
            return 'admin/help/update/';
        }
    },
    order:{
        orderData:function(){
            return 'admin/orderinfo/list';
        },
        detailOrder:function(){
            return 'admin/orderinfo/showOrderinfo/';
        },
        updateOrder:function(){
            return 'admin/orderinfo/updateOrderinfo/';
        },
        refundData:function(){
            return 'admin/refund/selectRefundOrderList';
        },
        toAuthOrder:function(){
            return 'admin/refund/authRefundOrder';
        },
        wechatPay:function(){
            return 'm/wechat/wxRefund'
        },
        aliPay:function(){
            return 'm/alipay/refund'
        },
        beanData:function(){
            return 'admin/beansetting/selectBeanSetting';
        },
        addBeanData:function(){
            return 'admin/beansetting/addBeanSetting';
        },
        deleteBeanData:function(){
            return 'admin/beansetting/deleteBeanSetting/';
        },
        detailBeanData:function(){
            return 'admin/beansetting/findBeanSetting/';
        },
        updateBeanData:function(){
            return 'admin/beansetting/updateUserCost/';
        },
        beanConsumeData:function(){
            return 'admin/bean/selectBeanRecord';
        },
        addBeanConsumeData:function(){
            return 'admin/bean/addBeanRecord';
        },
        deleteBeanConsumeData:function(){
            return 'admin/bean/deleteBeanRecord/';
        },
        datailBeanConsumeData:function(){
            return 'admin/bean/findBeanRecord';
        },
        updateBeanConsumeData:function(){
            return 'admin/bean/updateBeanRecord/';
        },
        cashConsumeData:function(){
            return 'admin/bean/selectCashRecord';
        },
        addCashConsumeData:function(){
            return 'admin/bean/addCashRecord';
        },
        deleteCashConsumeData:function(){
            return 'admin/bean/deleteCashRecord/';
        },
        datailCashConsumeData:function(){
            return 'admin/bean/findCashRecord';
        },
        updateCashConsumeData:function(){
            return 'admin/bean/updateCashRecord/';
        },
        beanRechargeData:function(){
            return 'admin/bean/selectBeanRecharge';
        },
        addBeanRechargeData:function(){
            return 'admin/bean/addBeanRecharge';
        },
        deleteBeanRechargeData:function(){
            return 'admin/bean/deleteBeanRecharge/';
        },
        detailBeanRechargeData:function(){
            return 'admin/bean/findBeanRecord/';
        },
        updateBeanRechargeData:function(){
            return 'admin/bean/updateBeanRecharge/';
        }
    }

}