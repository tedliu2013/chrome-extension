function timeSpan(e) {
    var t = e;
    this.getDays = function () {
        return Math.floor(this.getHours() / 24)
    }, this.getHours = function () {
        return Math.floor(this.getMinutes() / 60)
    }, this.getMinutes = function () {
        return Math.floor(this.getSeconds() / 60)
    }, this.getSeconds = function () {
        return Math.floor(t / 1e3)
    }, this.getMillisecondPart = function () {
        return t - this.getSeconds() * 1e3
    }, this.getSecondPart = function () {
        return this.getSeconds() - 60 * this.getMinutes()
    }, this.getMinutePart = function () {
        return this.getMinutes() - 60 * this.getHours()
    }, this.getHourPart = function () {
        return this.getHours() - 24 * this.getDays()
    }
}
var ver = Settings.getValue("ver");
ver != "4.0" && (Settings.setValue("ver", "4.0"), chrome.tabs.create({
    url: "options.html"
}));
var getOptions = function () {
    var e = Settings.getObject("options");
    return e == undefined && (e = {
        showLike: !1,
        showDel: !0,
        showPrev: !0,
        showNext: !0,
        showLyric: !0,
        showNotify: !0,
        notifySpan: 3,
        blockad: !0
    }, Settings.setObject("options", e)), 
    e.showNotify == undefined && (e.showNotify = !0), 
    e.blockad == undefined && (e.blockad = !0),e
},replaceAlbum = function (e) {
	Debug.print("replaceAlbum:"+e);
    if (getOptions().blockad) for (i = 0; i < e.length; i++) if (e[i].adtype != undefined) {
    	Debug.print(e[i]);
        e.splice(i, 1);
        break
    }
    return e
}, douban = {};
douban.data = {
    duration: 0
};
var portLink;
chrome.extension.onConnect.addListener(function (e) {
	Debug.print("onConnect.addListener:"+e);
    portLink = e, e.name == "dbstyle" && (e.postMessage({
        act: "connected"
    }), e.onDisconnect.addListener(function () {
        portLink = null
    }), e.onMessage.addListener(function (e, t) {
    	Debug.print("onMessage.addListener:"+e);
        switch (e.act) {
            case "playList":
                player.playList(e.data);
                break;
            case "play":
                player.play();
                break;
            case "playTo":
                player.playTo(e.data);
                break;
            case "pause":
                player.pause();
                break;
            case "next":
                player.playNext();
                break;
            case "prev":
                player.playPrev();
                break;
            case "mute":
                player.mute();
                break;
            case "unmute":
                player.unmute();
                break;
            case "volume":
                Settings.setValue("volume", e.data);
                var n = e.data / 50;
                player.volume(n);
                break;
            case "channel":
                player.channel(e.data)
        }
    }))
}), $('<div id="jquery_jplayer_1" class="jp-jplayer"></div>').appendTo("body"), $("#jquery_jplayer_1").jPlayer({
    ready: function (e) {},
    ended: function (e) {
        player.playEnd(), player.playNext()
    },
    timeupdate: function (e) {
        douban.data.duration = e.jPlayer.status.duration;
        if (portLink != null) {
            var t = e.jPlayer.status.duration - e.jPlayer.status.currentTime;
            t = $.jPlayer.convertTime(t);
            var n = e.jPlayer.status.currentTime / e.jPlayer.status.duration;
            portLink.postMessage({
                act: "playing",
                data: {
                    time: t,
                    percent: n,
                    now: Math.floor(e.jPlayer.status.currentTime)
                }
            })
        }
    },
    supplied: "mp3,flv",
    solution: "html"
});
var player = {
    init: function () {},
    playPrev: function () {
        var e = getPlayData();
        e.playIndex >= 1 && (e.playIndex -= 1, Settings.setObject("playData", e), player.playSong(e))
    },
    playNext: function () {
        var e = getPlayData();
        Settings.getValue("cycle", 0) == 0 && (e.playIndex += 1), Settings.setObject("playData", e), player.playSong(e)
    },
    play: function () {
        $("#jquery_jplayer_1").bind($.jPlayer.event.error, function (e) {
            player.playList()
        }), $("#jquery_jplayer_1").jPlayer("play")
    },
    playTo: function (e) {
        var t = $("#jquery_jplayer_1"),
            n = 0;
        douban.data.duration > 0 && (n = douban.data.duration * e), t.jPlayer("play", n)
    },
    volume: function (e) {
        $("#jquery_jplayer_1").jPlayer("volume", e)
    },
    pause: function () {
        $("#jquery_jplayer_1").jPlayer("pause")
    },
    playSong: function (e) {
        var t = e.playList[e.playIndex];
        if (t == undefined) player.getPlay(e.channelInfo.id, e.channelInfo.sid);
        else {
            if (getOptions().showNotify) {
                var n = new window.notify;
                n.show(t)
            }
            var r = t.url;
            $("#jquery_jplayer_1").jPlayer("setMedia", {
                mp3: r
            }).jPlayer("play");
            if (portLink != null) {
                var i = {};
                i.act = "info", i.data = t, portLink.postMessage(i)
            }
        }
    },
    playList: function (e) {
        var t = getPlayData();
        e == undefined && (e = t.channelInfo);
        var n = getKbps(),
            r = e.id,
            i = "http://douban.fm/j/mine/playlist?type=n&pb=" + n + "&from=mainsite&channel=" + r;
        Debug.print("playList:"+i);
        e.sid != undefined && (i = "http://douban.fm/j/mine/playlist?type=n&sid=" + e.sid + "&channel=" + e.sid + "&pb=" + n + "&from=mainsite"), 
        $.get(i, function (n) {
            $("#jquery_jplayer_1").jPlayer("clearMedia"), t.playListDate = (new Date).getTime(), t.playList = replaceAlbum(n.song), t.playIndex = 0, t.channelInfo = e, Settings.setObject("playData", t), player.playSong(t)
        })
    },
    playEnd: function () {
        var e = getPlayData(),
            t = getKbps(),
            n = e.playList[e.playIndex],
            r = "http://douban.fm/j/mine/playlist?type=e&sid=" + n.sid + "&channel=" + e.channelInfo.id + "&pb=" + t + "&from=mainsite&r=" + Math.random();
        $.get(r)
    },
    getPlay: function (e, t) {
        var n = getKbps(),
            r = "http://douban.fm/j/mine/playlist?type=n&pb=" + n + "&from=mainsite&channel=" + e;
        t != undefined && (r = "http://douban.fm/j/mine/playlist?type=n&sid=" + t + "&channel=" + t + "&pb=" + n + "&from=mainsite"), $.get(r, function (e) {
            var t = getPlayData(),
                n = t.playListDate;
            if (n == undefined) t.playList = replaceAlbum(e.song), t.playIndex = 0;
            else {
                var r = (new Date).getTime() - n,
                    i = new timeSpan(r);
                i.getHourPart() > 1 ? (t.playList = replaceAlbum(e.song), t.playIndex = 0) : t.playList = t.playList.concat(replaceAlbum(e.song))
            }
            t.playListDate = (new Date).getTime(), Settings.setObject("playData", t), player.playSong(t)
        })
    },
    mute: function () {
        $("#jquery_jplayer_1").jPlayer("mute")
    },
    unmute: function () {
        $("#jquery_jplayer_1").jPlayer("unmute")
    }
};
window.notify = function () {
    var e, t = !1,
        n = null,
        r = this;
    return {
        show: function (n) {
            var r = n.picture,
                i = n.artist,
                s = n.albumtitle + " " + n.title;
            e = webkitNotifications.createNotification(r, i, s), e.show(), t = !0, this.timer()
        },
        hide: function () {
            e.cancel(), t = !1
        },
        timer: function () {
            n = setTimeout(function () {
                this.hide(), n = null
            }.bind(this), (getOptions().NotifySpan || 3) * 1e3)
        },
        clear: function () {
            clearTimeout(n), n = null
        },
        isVisible: function () {
            return t
        }
    }
}