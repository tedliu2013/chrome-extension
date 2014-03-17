$(document).ready(function () {
    var e = Settings.getObject("options");
    e == undefined && (e = {
        showLike: !1,
        showDel: !0,
        showPrev: !0,
        showNext: !0,
        showLyric: !0
    }, Settings.setObject("options", e)), 
    	e.showDel && $(".jp-del").show(), 
        e.showPrev && $(".jp-previous").show(), 
        e.showNext && $(".jp-next").show();
    var t = {}, n = !1,
        r = {}, s = chrome.extension.connect({
            name: "dbstyle"
        }),
        o = getPlayData();
    try {
        var u = o.playList[o.playIndex];
        u.public_time == undefined && (u.public_time = ""), u.like == "1" && $(".jp-like").addClass("jp-liked").attr("data-liked", "1"), $(".jp-like").attr("data-sid", u.sid), $("#songChannel").attr("data-sid", u.sid), $("#singer").text(u.artist), $("#album").text("<" + u.albumtitle + "> " + u.public_time), $("#cover").attr("src", u.picture), $("#coverlink").attr("href", "http://music.douban.com" + u.album).attr("target", "_blank"), $("#song").text(u.title), o.channelInfo.title && ($(".header").attr("data-id", o.channelInfo.id), $("#channel_cover").attr("src", o.channelInfo.cover), $("#channel_title").text(o.channelInfo.title))
    } catch (a) {}
    s.onMessage.addListener(function (e) {
        switch (e.act) {
            case "info":
                var t = e.data;
                $("#cover").attr("src", t.picture), t.album != "" ? $("#coverlink").attr("href", "http://music.douban.com" + t.album).attr("target", "_blank") : $("#coverlink").removeAttr("href"), $("#singer").text(t.artist), t.public_time == undefined && (t.public_time = ""), t.albumtitle != undefined && t.albumtitle != "" && $("#album").text("<" + t.albumtitle + "> " + t.public_time), $("#song").text(t.title), t.like == 1 ? $(".jp-like").addClass("jp-liked").attr("data-liked", "1") : $(".jp-like").removeClass("jp-liked"), $(".jp-like").attr("data-sid", t.sid), $("#songChannel").attr("data-sid", t.sid), f.getLyric(t);
                break;
            case "playing":
                o = getPlayData();
                var t = o.playList[o.playIndex];
                n || (n = !0, $(".header").attr("data-id", o.channelInfo.id), $("#channel_status").removeClass("waiting").addClass("playing"), $(".jp-play").hide(), $(".jp-pause").show(), r = getPlayLyric(), r != undefined && r.title != t.title && f.getLyric(t)), $(".jp-current-time").text(e.data.time), $(".jp-play-bar").css({
                    width: e.data.percent * 100 + "%"
                }), r = getPlayLyric(), r != undefined && r.lyric && r.lyric[e.data.now] != undefined && r.title == t.title && $(".lyric").text(r.lyric[e.data.now]);
                break;
            case "connected":
        }
    }), t.bind = function () {
        shareTool.init(), $(".tag ul li a").click(function () {
            $(".tag ul li a").removeClass("hover");
            var e = $(this);
            e.addClass("hover");
            var t = e.attr("data-type");
            switch (t) {
                case "cate":
                    $("#cate").show(), $("#lists").hide();
                    break;
                case "fav":
                    f.getFav();
                    break;
                default:
                    f.get(t, 0)
            }
        }), $(".header").hover(function () {
            var e = $(this).attr("data-id");
            if (e && e > 0) {
                var n = $(".header s");
                n.unbind("click"), e && t.fav.check(e) ? (n.removeClass("fav").addClass("faved").attr("title", "点击取消收藏"), n.bind("click", function () {
                    t.fav.remove(e), h("取消收藏")
                })) : (n.removeClass("faved").addClass("fav").attr("title", "点击收藏"), n.bind("click", function () {
                    t.fav.add(e), h("收藏成功")
                })), n.show()
            }
        }, function () {
            $(".header s").hide()
        }), $(".header s").bind("click", function () {
            var e = $(this).attr("data-id");
            t.fav.set(e)
        }), $("#cate li").bind("click", function () {
            $("#cate li").removeClass("hover");
            var e = $(this);
            e.addClass("hover"), f.get("cate", 0, e.attr("data-id"))
        }), $("#lists").delegate("li div img", "click", function () {
            var e = $(this).parent("div"),
                t = e.attr("data-id"),
                n = e.children("img").attr("src"),
                r = e.parent("li").children("a").text(),
                i = {
                    title: r,
                    cover: n,
                    id: t
                };
            $(".arrow").trigger("click"), l.needLogin = !1, $(".login").css("left", "300px"), f.playChannel(i)
        }), $("#lists").delegate("li div i", "click", function () {
            var e = $(this).parent("div"),
                n = e.attr("data-id");
            e.parent("li").fadeOut().remove(), t.fav.remove(n)
        }), $("#keyword").bind("keydown", function () {
            event.keyCode == 13 && $(".search").trigger("click")
        }), $("#keyword").focusin(function () {
            $("#keyword").css({
                width: "90px"
            })
        }).focusout(function () {
            $("#keyword").css({
                width: "70px"
            })
        }), $(".search").bind("click", function () {
            $(".tag ul li a").removeClass("hover");
            var e = $("#keyword").val();
            e != "" && f.get("search", 0, e)
        }), $(".arrow").bind("click", function () {
            var e = $(this),
                t = $(".cates");
            t.offset().left != 0 ? ($(".login").offset().left == 20 && $(".login").animate({
                left: "300px"
            }), t.animate({
                left: "0px"
            }, function () {
                e.addClass("arrow-back"), $(".lyric").removeClass("lyric-normal").addClass("lyric-hover")
            })) : (l.needLogin && $(".login").animate({
                left: "0px"
            }), t.animate({
                left: "-280px"
            }, function () {
                e.removeClass("arrow-back"), $(".lyric").removeClass("lyric-hover").addClass("lyric-normal")
            }))
        }), $(".jp-next").bind("click", function () {
            o = getPlayData(), o.playIndex += 1, s.postMessage({
                act: "next"
            }), $("#channel_status").addClass("playing").removeClass("waiting"), $(".jp-pause").show(), $(".jp-play").hide()
        }), $(".jp-del").bind("click", function () {
            o = getPlayData();
            var e = o.playList[o.playIndex];
            f.del(e.sid)
        }), $(".jp-previous").bind("click", function () {
            o = getPlayData(), o.playIndex >= 1 && (o.playIndex -= 1, s.postMessage({
                act: "prev"
            }))
        }), $(".jp-pause").bind("click", function () {
            s.postMessage({
                act: "pause"
            }), $("#channel_status").addClass("waiting").removeClass("playing"), $(".jp-play").show(), $(".jp-pause").hide()
        }), $(".jp-play").bind("click", function () {
            $("#channel_status").addClass("playing").removeClass("waiting"), s.postMessage({
                act: "play"
            }), $(".jp-pause").show(), $(".jp-play").hide()
        }), $(".jp-mute").bind("click", function () {
            s.postMessage({
                act: "mute"
            }), $(".jp-mute").hide(), $(".jp-unmute").show()
        }), $(".jp-unmute").bind("click", function () {
            s.postMessage({
                act: "unmute"
            }), $(".jp-unmute").hide(), $(".jp-mute").show()
        }), $("#user_status").bind("click", function () {
            l.status ? $("#user_menu").toggle() : l.init(), setTimeout(function () {
                $("#user_menu").is(":visible") && $("body").bind("click", function () {
                    $("#user_menu").hide(), $("body").unbind("click")
                })
            }, 0)
        }), $(".logout").click(function () {
            l.logout()
        }), $("#radio_private").click(function () {
            f.playChannel("0"), $("#user_menu").hide()
        }), $("#radio_red").click(function () {
            f.playChannel("-3"), $("#user_menu").hide()
        }), $(".jp-like").click(function () {
            var e = $(this).attr("data-sid"),
                t = o.channelInfo.id;
            f.red(e, t)
        });
        var e;
        $(".jp-volume-bar").bind("click", function (t) {
            var n = t.offsetX + 1;
            n > 50 && (n = 50), Settings.setValue("volume", n), $(".jp-volume-bar-value").width(n), Settings.setValue("volume", n), s.postMessage({
                act: "volume",
                data: n
            }), clearTimeout(e), e = setTimeout(function () {
                $(".jp-volume").hide()
            }, 4e3)
        }), $(".jp-seek-bar").bind("click", function (e) {
            var t = e.offsetX + 1;
            t > 240 && (t = 240), console.log(t);
            var n = t / 240;
            s.postMessage({
                act: "playTo",
                data: n
            })
        }), $(".jp-mute,.jp-unmute").bind("mouseover", function () {
            var e = Settings.getValue("volume", "40");
            $(".jp-volume-bar-value").width(e), $(".jp-volume").show()
        }), $(".jp-volume").bind("mouseover", function () {
            clearTimeout(e)
        }), $(".jp-volume").bind("mouseout", function () {
            clearTimeout(e), e = setTimeout(function () {
                $(".jp-volume").hide()
            }, 4e3)
        }), o.playList != undefined && o.playList.length == 0 ? f.get("hot", 0, function () {
            $(".arrow").trigger("click")
        }) : f.get("hot", 0), $(".cycle").bind("click", function () {
            var e = $(this);
            e.toggleClass("cycle1"), e.hasClass("cycle1") ? (Settings.setValue("cycle", 1), e.attr("title", "单曲循环")) : (Settings.setValue("cycle", 0), e.attr("title", "顺序播放"))
        }), Settings.getValue("cycle", 0) == 1 && $(".cycle").addClass("cycle1"), $("#songChannel").bind("click", function () {
            var e = $(this).attr("data-sid");
            e = 3635044;
            var t = getPlayData();
            console.log(t), console.log(t.playList[t.playIndex]);
            var n = t.playList[t.playIndex],
                r = {
                    title: n.title,
                    cover: n.picture,
                    id: e,
                    sid: e
                };
            $.getJSON("http://douban.fm/j/change_channel?fcid=" + t.channelInfo.id + "&tcid=" + e + "&area=songchannel", function (e) {
                f.playChannel(r)
            })
        })
    };
    var f = {
        config: {
            hotUrl: "http://douban.fm/j/explore/hot_channels",
            upUrl: "http://douban.fm/j/explore/up_trending_channels",
            searchUrl: "http://douban.fm/j/explore/search?query=",
            cateUrl: "http://douban.fm/j/explore/genre?gid=",
            tmpl: "<li><div data-id='$id$'><img src='$img$' title='$intro$'/></div><a>$name$</a></li>",
            tmpl_fav: "<li><div data-id='$id$'><img src='$img$' title='$intro$'/><i title='取消收藏'>×</i></div><a>$name$</a></li>"
        },
        getFav: function () {
            var e = "http://douban.fm/j/fav_channels";
            $.getJSON(e, function (e) {
                var t = new Array,
                    n = f.config.tmpl_fav,
                    r = "";
                for (var i = 0; i < e.channels.length; i++) {
                    var s = e.channels[i],
                        o = s.name,
                        u = s.id,
                        a = s.cover,
                        l = s.intro;
                    t.push(u);
                    var c = n.replace("$img$", a);
                    c = c.replace("$name$", o), c = c.replace("$id$", u), c = c.replace("$intro$", l), r += c
                }
                $("#cate").hide(), $("#lists").empty().show().append(r), Settings.setObject("favids", t)
            })
        },
        get: function (e, t, n) {
            var r;
            switch (e) {
                case "hot":
                    r = f.config.hotUrl + "?start=" + t + "&limit=80";
                    break;
                case "up":
                    r = f.config.upUrl + "?start=" + t + "&limit=80";
                    break;
                case "search":
                    r = f.config.searchUrl + encodeURIComponent(arguments[2]) + "&start=" + t + "&limit=24";
                    break;
                case "cate":
                    r = f.config.cateUrl + arguments[2] + "&start=" + t + "&limit=24"
            }
            var s = f.config.tmpl,
                o = "";
            $.get(r, function (e) {
                $(".lists").scrollTop(0);
                if (e.data && e.data.channels) {
                    for (i = 0; i < e.data.channels.length; i++) {
                        var t = e.data.channels[i],
                            r = s.replace("$img$", t.cover);
                        r = r.replace("$name$", t.name), r = r.replace("$id$", t.id), r = r.replace("$intro$", t.intro), o += r
                    }
                    $("#cate").hide(), $("#lists").empty().show().append(o), $("#lists li a").bind("click", function () {
                        $(this).siblings("div").trigger("click")
                    }), n && typeof n == "function" && n()
                }
            })
        },
        playChannel: function (e) {
            var t = e;
            e == "-3" ? t = {
                title: "红心电台",
                cover: "douban/red.gif",
                id: "-3"
            } : e == "0" && (t = {
                title: "私人电台",
                cover: "douban/private.gif",
                id: "0"
            }), $("#channel_cover").attr("src", t.cover),
            	$("#channel_title").text(t.title), 
            	$(".jp-play").hide(), 
            	$(".jp-pause").show(), 
            	$("#channel_status").addClass("playing").removeClass("waiting"), 
            	$(".header").attr("data-id", t.id), 
            	s.postMessage({
	                act: "playList",
	                data: t
            })
        },
        getLyric: function (t) {
            var n = !1;
            if (e.showLyric) {
                $(".lyric").text("正在加载歌词");
                var i = "http://sug.music.baidu.com/info/suggestion?format=json&word=",
                    s = "http://music.baidu.com/data/music/fmlink?songIds=",
                    o = "http://music.baidu.com";
                i += encodeURIComponent(t.artist + " " + t.title), 
	                Debug.print("①"+i),
	                $.getJSON(i, function (e) {
                    e.song.length > 0 && (s += e.song[0].songid, 
                    		Debug.print("②"+i), 
                    		$.getJSON(s, function (e) {
                        e.data.songList.length > 0 && (o += e.data.songList[0].lrcLink, Debug.print("③"+i), $.get(o, function (e) {
                        	Debug.print(e);    
                        	e = e.split("\n");
                            var i = /^((?:\[[\d.:]+?\])+?)([^\[\]]*)$/,
                                s = {};
                            for (var o = 0, u = e.length; o < u; o += 1) {
                                var a = e[o].match(i),
                                    f;
                                if (a) {
                                    f = a[1].slice(1, -1).split("][");
                                    for (var l = 0, c = f.length, h; l < c; l += 1) h = f[l].split(":"), s[Number(h[0]) * 60 + Math.round(h[1])] = a[2]
                                }
                            }
                            r.lyric = s, r.title = t.title, Settings.setObject("lyric", r), n = !0, $(".lyric").text(t.title)
                        }))
                    }))
                })
            }
            n || $(".lyric").html(t.title)
        },
        del: function (e) {
            var t = "http://douban.fm/j/mine/playlist?type=b&sid=" + e + "&pt=100&channel=" + o.channelInfo.id + "&pb=64&from=mainsite";
            $.get(t, function () {
                o.playList.splice(o.playIndex, 1), o.playIndex -= 1, Settings.setObject("playData", o), $(".jp-next").trigger("click")
            })
        },
        red: function (e, t) {
            var n = "http://douban.fm/j/mine/playlist?type=r&sid=" + e + "&pt=100&channel=" + t + "&pb=64&from=mainsite",
                r = "http://douban.fm/j/mine/playlist?type=u&sid=" + e + "&pt=100&channel=" + t + "&pb=64&from=mainsite",
                i = n,
                s = $(".jp-like");
            o = getPlayData(), s.attr("data-liked") == "1" ? (i = r, s.attr("data-liked", "0"), o.playList[o.playIndex].like = 0) : (s.attr("data-liked", "0"), o.playList[o.playIndex].like = 1), Settings.setObject("playData", o), s.toggleClass("jp-liked"), $.get(i, function (e) {})
        }
    };
    t.fav = {
        check: function (e) {
            var t = Settings.getObject("favids");
            if (t == undefined) return !1;
            if (t.length > 0) {
                for (var n = t.length - 1; n >= 0; n--) if (t[n] == e) return !0;
                return !1
            }
        },
        add: function (e) {
            var t = "http://douban.fm/j/explore/fav_channel?cid=" + e;
            $.getJSON(t, function (t) {
                if (t.status) {
                    var n = Settings.getObject("favids");
                    n == undefined && (n = new Array), n.push(e), Settings.setObject("favids", n)
                }
            })
        },
        remove: function (e) {
            var t = "http://douban.fm/j/explore/unfav_channel?cid=" + e;
            $.getJSON(t, function (t) {
                if (t.status) {
                    var n = Settings.getObject("favids");
                    n == undefined && (n = new Array);
                    if (n.length > 0) for (var r = n.length - 1; r >= 0; r--) if (n[r] == e) {
                        n.splice(r, 1), Settings.setObject("favids", n);
                        break
                    }
                }
            })
        }
    };
    var l = {
        config: {
            verficIdUrl: "http://douban.fm/j/new_captcha",
            verficImage: "http://douban.fm/misc/captcha?size=m&id=",
            loginUrl: "http://douban.fm/j/login"
        },
        status: !1,
        isPro: !1,
        verfic: function () {
            $.ajax({
                type: "GET",
                url: l.config.verficIdUrl,
                dataType: "text",
                success: function (e) {
                    var t = l.config.verficImage,
                        n = e.replace('"', "").replace('"', "");
                    $("#captcha_id").val(n);
                    var r = $("#captcha");
                    r.attr("src", t + n), r.click(function () {
                        l.verfic()
                    })
                }
            })
        },
        init: function () {
            $(".cates").offset().left == 0 && $(".arrow").trigger("click"), $(".login").animate({
                left: "0px"
            }), $("#btn-cancel").click(function () {
                $(".login").animate({
                    left: "300px"
                })
            }), l.verfic();
            var e = $("#btn-submit"),
                t = !1;
            e.unbind("click"), e.bind("click", function () {
                t || (t = !0, $.ajax({
                    type: "POST",
                    url: l.config.loginUrl,
                    data: $("#login_form").serialize(),
                    success: function (e) {
                        if (e.r == 0) {
                            Settings.setObject("userInfo", e.user_info);
                            var n = e.user_info;
                            $("#login_password,#captcha_solution").val(""), $(".login").animate({
                                left: "300px"
                            }), $("#user_menu").show(), $("#tag_fav").show(), $("body").bind("click", function () {
                                $("#user_menu").hide(), $("body").unbind("click")
                            }), l.needLogin = !1, l.status = !0, l.isPro = n.is_pro, $("#user_status span").text(n.name), l.isPro ? (Settings.setValue("vipkbps", 192), $("#user_pro").show(), $("#user_status").attr("title", "PRO用户，享受192K高清音质")) : ($("#user_pro").hide(), $("#user_status").attr("title", ""))
                        } else alert(e.err_msg), l.verfic();
                        t = !1
                    }
                }))
            })
        },
        checkLogin: function () {
            chrome.cookies.get({
                url: "http://douban.fm",
                name: "dbcl2"
            }, function (e) {
                if (e != null) {
                    l.status = !0;
                    var t = Settings.getObject("userInfo") || {};
                    t.name && $("#user_status span").attr("title", t.name), $("#tag_fav").show(), t != undefined && t.is_pro ? (l.isPro = !0, $("#user_status").attr("title", "PRO用户/192K高清音质"), $("#user_pro").show()) : ($("#user_pro").hide(), $("#user_status").attr("title", ""))
                } else {
                    $("#user_status span").text("登录"), $("#user_pro").hide(), $("#tag_fav").hide(), $("#user_status").attr("title", "");
                    var n = o.channelInfo.id;
                    if (n == "-3" || n == "0") l.needLogin = !0, l.init()
                }
            })
        },
        logout: function () {
            chrome.cookies.remove({
                url: "http://douban.fm",
                name: "dbcl2"
            }), l.status = !1, $("#user_status span").text("登录"), $("#user_pro").hide(), $("#user_menu").hide();
            var e = o.channelInfo.id;
            if (e == "-3" || e == "0") l.needLogin = !0, l.init()
        }
    }, c = null,
        h = function (e) {
            $(".tips").fadeIn().text(e), clearTimeout(c), c = setTimeout(function () {
                $(".tips").fadeOut()
            }, 1e3)
        };
    t.hotkey = function () {
        $("body").bind("keydown", function () {
            var e = window.event.keyCode;
            switch (e) {
                case 39:
                    $(".jp-next").trigger("click"), h("下一首");
                    break;
                case 37:
                    $(".jp-previous").trigger("click"), h("上一首");
                    break;
                case 38:
                    var t = Settings.getValue("volume", 50);
                    t += 5, t > 50 && (t = 50), s.postMessage({
                        act: "volume",
                        data: t
                    }), h("音量" + t * 2 + "%");
                    break;
                case 40:
                    var t = Settings.getValue("volume", 50);
                    t -= 5, t < 0 && (t = 0), s.postMessage({
                        act: "volume",
                        data: t
                    }), h("音量" + t * 2 + "%");
                    break;
                case 80:
                    $(".jp-play").is(":visible") ? ($(".jp-play").trigger("click"), h("播放")) : ($(".jp-pause").trigger("click"), h("暂停"))
            }
        })
    }, t.init = function () {
        t.bind(), l.checkLogin(), t.hotkey()
    }, t.init()
})