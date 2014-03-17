var Settings = {};
Settings.configCache = {}, 
Settings.setValue = function (t, n) {
    Settings.configCache[t] = n;
    var r = {};
    Debug.print(t+":"+n);
    return localStorage.config && (r = JSON.parse(localStorage.config)), r[t] = n, localStorage.config = JSON.stringify(r), n
}, Settings.getValue = function (t, n) {
	Debug.print(localStorage.config);
    if (!localStorage.config) return n;
    var r = JSON.parse(localStorage.config);
    return typeof r[t] == "undefined" ? n : (Settings.configCache[t] = r[t], r[t])
}, Settings.getCacheValue = function (t, n) {
    if (typeof Settings.configCache[t] != "undefined") return Settings.configCache[t];
    if (!localStorage.config) return n;
    var r = JSON.parse(localStorage.config);
    return typeof r[t] == "undefined" ? n : (Settings.configCache[t] = r[t], r[t])
}, Settings.keyExists = function (t) {
    if (!localStorage.config) return !1;
    var n = JSON.parse(localStorage.config);
    return n[t] != undefined
}, Settings.setObject = function (t, n) {
    return localStorage[t] = JSON.stringify(n), n
}, Settings.getObject = function (t) {
    return localStorage[t] == undefined ? undefined : JSON.parse(localStorage[t])
}, Settings.refreshCache = function () {
    Settings.configCache = {}
};
var getPlayData = function () {
    var e = Settings.getObject("playData");
    return e == undefined && (e = {
        playList: new Array,
        playListDate: new Date,
        playIndex: 0,
        channelInfo: {}
    }), e
}, getPlayLyric = function () {
    var e = Settings.getObject("lyric");
    return e == undefined && (e = {}, Settings.setObject("lyric", e)), e
}, getKbps = function () {
    var e = 64,
        t = Settings.getObject("userInfo");
    return t != undefined && t.is_pro && (e = Settings.getValue("vipkbps", 192), e = e + "&kbps=" + e), e
}, shareTool = {
    init: function () {
        shareTool.creat(), shareTool.bind()
    },
    creat: function () {
        var e = '<div id="shareTool" class="hide">'+
					'<div class="sharetip"></div><div class="share">'+
						'<a class="sina">新浪微博</a>'+            
						'<a class="renren">人人网</a>'+           
						'<a class="qq">QQ好友</a>'+            
						'<a class="qzone">QQ空间</a>'+            
						'<a class="tencent">腾讯微博</a>'+            
						'<a class="douban">豆瓣</a>'+        
					'</div>'+       
				'</div>';
        $("body").append(e)
    },
    bind: function () {
        var e = {
            title: function () {
                return songdata = getPlayData(), songdata.playList[songdata.playIndex].title
            },
            desc: function () {
                return songdata = getPlayData(), "分享来自豆瓣FM" + songdata.channelInfo.title + "MHz " + songdata.playList[songdata.playIndex].artist + "的歌曲" + songdata.playList[songdata.playIndex].title + "(来自豆瓣FM原味版Chrome扩展)"
            },
            image: function () {
                return songdata = getPlayData(), songdata.playList[songdata.playIndex].picture
            },
            url: function () {
                return songdata = getPlayData(), "http://douban.fm/?start=" + songdata.playList[songdata.playIndex].sid + "g" + songdata.playList[songdata.playIndex].ssid + "g" + songdata.channelInfo.id + "&cid=" + songdata.channelInfo.id
            },
            source: function () {
                return "来自豆瓣FM原味版Chrome扩展"
            }
        };
        $(".sharetip").hover(function () {
            $("#shareTool").addClass("show")
        }), $("#shareTool").bind("mouseleave", function () {
            $("#shareTool").removeClass("show")
        }), $(".share a").bind("click", function () {
            var t = $(this),
                n = t.attr("class"),
                r = "",
                i = {
                    title: "name",
                    url: "href",
                    desc: "text",
                    image: "image",
                    source: "desc"
                };
            switch (n) {
                case "douban":
                    r = "http://www.douban.com/share/recommend?";
                    break;
                case "sina":
                    r = "http://v.t.sina.com.cn/share/share.php?", i.url = "url", i.desc = "title", i.image = "pic";
                    break;
                case "renren":
                    r = "http://widget.renren.com/dialog/share?", i.desc = "title", i.url = "resourceUrl", i.source = "description";
                    break;
                case "qzone":
                    r = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?", i.url = "url", i.title = "title", i.desc = "desc", i.source = "summary", i.image = "pics";
                    break;
                case "qq":
                    r = "http://connect.qq.com/widget/shareqq/index.html?", i.title = "title", i.desc = "desc", i.source = "site", i.url = "url", i.image = "pics";
                    break;
                case "tencent":
                    r = "http://share.v.t.qq.com/index.php?c=share&a=index&", i.url = "url", i.image = "pic", i.desc = "title", i.source = "site"
            }
            r += [i.title, "=", encodeURIComponent(e.title()), "&", i.desc, "=", encodeURIComponent(e.desc()), "&", i.url, "=", encodeURIComponent(e.url()), "&", i.image, "=", encodeURIComponent(e.image()), "&", i.source, "=", encodeURIComponent(e.source())].join(""), window.open(r, "_blank")
        })
    }
}