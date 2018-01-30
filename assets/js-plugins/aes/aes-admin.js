/**
 * Created by jm on 2017/12/21.
 */


function validAppToken() {
    $.ajax({
        url:  path + ToURL.home.initAppToken(),
        type: 'POST',
        cache: false, //清除缓存
        dataType:'json',
        contentType:"application/json;charset=UTF-8",
        success: function(data) {
            sessionStorage.removeItem("APPTOKEN");
            let admintokens = data.data.apptoken;
            let decToken = Decrypt(admintokens);
            let curtime = Date.parse(new Date())/1000;
            let token = Encrypt(curtime+decToken).toUpperCase();
            let secToken = token+"."+curtime;
            sessionStorage.setItem("APPTOKEN",secToken);
        }
    });

}
function Encrypt(word){
    var key = CryptoJS.enc.Utf8.parse("gAxFuoJD7l4SVNvb");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}
function Decrypt(word){
    var key = CryptoJS.enc.Utf8.parse("gAxFuoJD7l4SVNvb");
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}