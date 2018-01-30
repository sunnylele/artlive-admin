//时间戳转换日期对象
    function toDu(n){
         return n<10?'0'+n:''+n;
    }
    function toTime(time) {
        var oDate = new Date(parseInt(time));
        var Y = oDate.getFullYear();
        var M = oDate.getMonth()+1;
        var D = oDate.getDate();
        var h = oDate.getHours();
        var m = oDate.getMinutes();
        var s = oDate.getSeconds();
        return Y+'-'+toDu(M)+'-'+toDu(D)+'  '+toDu(h)+':'+toDu(m)+':'+toDu(s);
    }
    toTime();