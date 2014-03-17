$(document).ready(function () {
    function n() {
        document.getElementById("del").checked == 1 ? e.showDel = !0 : e.showDel = !1, 
        document.getElementById("prev").checked == 1 ? e.showPrev = !0 : e.showPrev = !1, 
        document.getElementById("next").checked == 1 ? e.showNext = !0 : e.showNext = !1, 
        document.getElementById("lyric").checked == 1 ? e.showLyric = !0 : e.showLyric = !1, 
        document.getElementById("notify").checked == 1 ? e.showNotify = !0 : e.showNotify = !1, 
        document.getElementById("blockad").checked == 1 ? e.blockad = !0 : e.blockad = !1, 
        e.NotifySpan = document.getElementById("notifySpan").value;
        var t = $(":radio:checked").attr("data-val");
        Settings.setValue("vipkbps", t), Settings.setObject("options", e)
    }
    // set config cache 
    var e = Settings.getObject("options");
    // Initialization default config
    e == undefined && (e = {
	        showLike: !1,
	        showDel: !0,
	        showPrev: !0,
	        showNext: !0,
	        showLyric: !0,
	        showNotify: !0,
	        NotifySpan: 3,
	        blockad: !0
    	}, Settings.setObject("options", e)), 
	    e.showLike && (document.getElementById("like").checked = !0), 
	    e.showDel && (document.getElementById("del").checked = !0), 
	    e.showPrev && (document.getElementById("prev").checked = !0), 
	    e.showNext && (document.getElementById("next").checked = !0), 
	    e.showLyric && (document.getElementById("lyric").checked = !0), 
	    e.showNotify && (document.getElementById("notify").checked = !0);
    if (e.blockad || e.blockad == undefined) document.getElementById("blockad").checked = !0;
    document.getElementById("notifySpan").value = e.NotifySpan || 3;
    Debug.print(e.NotifySpan||3);
    var t = Settings.getValue("vipkbps", 192);
    document.getElementById("k" + t).checked = !0, 
	    $("input:checkbox,input:radio").click(function () {
	        n()
	    }), $("#notifySpan").change(function () {
	        n()
	    }), $(".menu a").click(function () {
	    	// all '.menu a' hover remove / all 'dl'.hide / this.id.show;
	        $(".menu a").removeClass("hover"), $(this).addClass("hover"), $("dl").hide(), $("." + $(this).attr("id")).show()
	    })
})