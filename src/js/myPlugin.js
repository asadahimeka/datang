// IE DOM7009 无法解码URL处图像原因之一：图片后缀名和代码中不一致或者图片本来是.png格式自己手动更改成了.jpg或者其它格式导致IE浏览器无法识别。
//https://fanghe1995.github.io/2017/08/25/IE-DOM7009/

//主机地址
var host = 'http://115.182.107.203:8088';

//判断是否为IE浏览器
function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

//IE8不支持document.getElementsByClassName方法，为其添加该方法
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}
function gc(classname) {
    return document.getElementsByClassName(classname);
}

//返回顶部函数
function backTop(bkcn) {
    var btop = $(bkcn);
    var d = document.documentElement;
    window.onscroll = set;
    btop.click(function () {
        btop.slideUp();
        window.onscroll = null;
        window.timer = setInterval(function () {
            d.scrollTop -= Math.ceil(d.scrollTop * 0.5);
            if (d.scrollTop == 0)
                clearInterval(timer, window.onscroll = set);
        }, 20);
    });
    function set() {
        if (d.scrollTop > 200) {
            btop.slideDown();
        } else {
            btop.slideUp();
        }
    }
}

//IE与非IE返回顶部不同的做法
if (isIE()) {
    backTop('.bktop');
} else {
    var bktop = $('.bktop');
    bktop.click(function () {
        //只选择body的话在火狐以及IE10及以下的浏览器中返回顶部会失效。需要同时选中文档返回顶部。        
        $('html,body').animate({ scrollTop: 0 }, 500);
    });
    var doc = $(document);
    doc.scroll(function () {
        if (doc.scrollTop() > 200) {
            bktop.slideDown(500);
            // bktop.show(500);
        } else {
            bktop.slideUp(500);
            // bktop.hide(500);
        }
    });
}

// function Menutab(menucn, cntcn, on) {
//     var menu = gc(menucn);
//     var cnt = gc(cntcn);
//     for (var i = 0; i < menu.length; i++) {
//         i != 0 ? cnt[i].style.display = 'none' : 0;
//         (function (n) {
//             menu[n].onclick = function () {
//                 for (var j = 0; j < menu.length; j++) {
//                     j != i ? menu[j].className = menucn : 0;
//                 }
//                 menu[n].className = menucn + ' ' + on;
//                 for (var k = 0; k < cnt.length; k++) {
//                     k != i ? cnt[k].style.display = 'none' : 0;
//                 }
//                 cnt[n].style.display = 'block';
//             }
//         })(i);
//     }
// }
//菜单切换函数
function Menutab(menucn, cntcn, on) {
    var menu = $('.' + menucn);
    var cnt = $('.' + cntcn);
    $('.' + cntcn + ':gt(0)').hide();
    menu.click(function () {
        $(this).siblings().removeClass(on);
        $(this).addClass(on);
        cnt.not(':eq(' + menu.index($(this)) + ')').fadeOut(200);
        cnt.eq(menu.index($(this))).fadeIn(200);
    });
}

// function msecformat(msec) {
//     return (new Date(msec)).toLocaleDateString('zh-CN').replace(/\//g, '-');
// }
//把毫秒时间格式化为年月日
function msecformat(msec) {
    var date = new Date(msec);
    var year = date.getFullYear();
    var mouth = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    return year + '-' + mouth + '-' + day;
}

//保存键值对到session
function saves(key, value) {
    sessionStorage.setItem(key, value);
}
//从session中取值
function gets(key) {
    return sessionStorage.getItem(key);
}

//向页面中添加百度地图
if (window.BMap) {
    var MapUtil = {
        //缩放级别
        zoom: 18,

        /**创建和初始化地图函数：
        参数obj={
            mapId: 地图所在div的id, 
            posi: 地址(string)或坐标位置(array), 
            标注点数组markerArr: 
            [{ title: "备注标题(地点)", content: "标注内容(详细地址)", point: [坐标], isOpen: InfoWindow是否默认打开(0或1), icon: {标注点图标选项} }]
        }
         */   
        initMap: function (obj) {
            this.markerArr = obj.markerArr;//标注点数组
            this.createMap(obj.mapId, obj.posi);//创建地图
            this.setMapEvent();//设置地图事件
            this.addMapControl();//向地图添加控件
            this.markerArr ? this.addMarker() : 0;//向地图中添加marker
            // this.alertLngLat();//For test:显示点击位置的坐标
        },

        //创建地图函数：
        createMap: function (mapId, posi) {
            var map = new BMap.Map(mapId);//在百度地图容器中创建一个地图
            if (typeof posi == 'string') {
                this.setPosi(map, posi);//对指定的地址(string)进行解析
            } else {
                var point = new BMap.Point(posi[0], posi[1]);//定义一个中心点坐标                
                map.centerAndZoom(point, this.zoom);//设定地图的中心点和坐标并将地图显示在地图容器中
            }
            window.map = map;//将map变量存储在全局
        },

        //对指定的地址进行解析
        setPosi: function (map, positxt) {
            var geocoder = new BMap.Geocoder();
            geocoder.getPoint(positxt, function (point) { map.centerAndZoom(point, MapUtil.zoom) });
            // geocoder.getPoint(positxt, point => map.centerAndZoom(point, this.zoom));
        },

        //检查markerArr中的point，如果为"", 将其设为posi的坐标
        checkPoint: function () {
            var flag = true;
            for (var i = 0; i < MapUtil.markerArr.length; i++) {
                void function (ii) {
                    if (!MapUtil.markerArr[ii].point) {
                        flag = false;
                        var geocoder = new BMap.Geocoder();
                        geocoder.getPoint(MapUtil.markerArr[ii].content.substring(5), function(point){
                            MapUtil.markerArr[ii].point = [point.lng, point.lat];
                            MapUtil.addMarker();
                        });
                    }
                }(i);
            }
            flag?MapUtil.addMarker():0;
        },

        //地图事件设置函数：
        setMapEvent: function () {
            map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
            map.enableScrollWheelZoom();//启用地图滚轮放大缩小
            map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
            map.enableKeyboard();//启用键盘上下左右键移动地图
        },

        //地图控件添加函数：
        addMapControl: function () {
            //向地图中添加缩放控件
            var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL });
            map.addControl(ctrl_nav);
            //向地图中添加比例尺控件
            var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
            map.addControl(ctrl_sca);
            //向地图中添加地图类型控件
            var ctrl_type = new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_LEFT });
            map.addControl(ctrl_type);
        },

        //创建marker
        addMarker: function () {
            for (var i = 0; i < this.markerArr.length; i++) {
                var json = this.markerArr[i];
                var p0 = json.point[0];
                var p1 = json.point[1];
                var point = new BMap.Point(p0, p1);
                var marker = new BMap.Marker(point);
                var iw = this.createInfoWindow(i);
                var label = new BMap.Label(json.title, { "offset": new BMap.Size(json.icon.lb - json.icon.x + 10, -20) });
                marker.setLabel(label);
                map.addOverlay(marker);
                label.setStyle({
                    fontSize: "18px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: 0,
                    color: "red",
                    cursor: "pointer"
                });
                (function () {
                    var index = i;
                    var _iw = MapUtil.createInfoWindow(i);
                    var _marker = marker;
                    _marker.addEventListener("click", function () {
                        this.openInfoWindow(_iw);
                    });
                    _iw.addEventListener("open", function () {
                        _marker.getLabel().hide();
                    })
                    _iw.addEventListener("close", function () {
                        _marker.getLabel().show();
                    })
                    label.addEventListener("click", function () {
                        _marker.openInfoWindow(_iw);
                    })
                    if (!!json.isOpen) {
                        label.hide();
                        _marker.openInfoWindow(_iw);
                    }
                })()
            }
        },

        //创建InfoWindow
        createInfoWindow: function (i) {
            var json = this.markerArr[i];
            var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>" + json.content + "</div>");
            return iw;
        },

        //创建一个Icon
        createIcon: function (json) {
            var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(-json.l, -json.t), infoWindowOffset: new BMap.Size(json.lb + 5, 1), offset: new BMap.Size(json.x, json.h) })
            return icon;
        },

        //Test for position co-ordinates
        alertLngLat: function () {
            map.addEventListener("click", function (e) {
                alert(e.point.lng + "," + e.point.lat);
            });
        }
    }
}

//IE8不支持不支持indexOf方法，添加数组indexOf方法
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}

//IE8不支持addEventListener方法,为IE8添加EventListener系列方法支持
// -[1,] : 判断是否为IE8或以下
-[1,] || (function () {
    //为window对象添加
    addEventListener = function (n, f) {
        if ("on" + n in this.constructor.prototype)
            this.attachEvent("on" + n, f);
        else {
            var o = this.customEvents = this.customEvents || {};
            n in o ? o[n].push(f) : (o[n] = [f]);
        };
    };
    removeEventListener = function (n, f) {
        if ("on" + n in this.constructor.prototype)
            this.detachEvent("on" + n, f);
        else {
            var s = this.customEvents && this.customEvents[n];
            if (s) for (var i = 0; i < s.length; i++)
                if (s[i] == f) return void s.splice(i, 1);
        };
    };
    dispatchEvent = function (e) {
        if ("on" + e.type in this.constructor.prototype)
            this.fireEvent("on" + e.type, e);
        else {
            var s = this.customEvents && this.customEvents[e.type];
            if (s) for (var s = s.slice(0), i = 0; i < s.length; i++)
                s[i].call(this, e);
        }
    };
    //为document对象添加
    HTMLDocument.prototype.addEventListener = addEventListener;
    HTMLDocument.prototype.removeEventListener = removeEventListener;
    HTMLDocument.prototype.dispatchEvent = dispatchEvent;
    HTMLDocument.prototype.createEvent = function () {
        var e = document.createEventObject();
        e.initMouseEvent = function (en) { this.type = en; };
        e.initEvent = function (en) { this.type = en; };
        return e;
    };
    //为全元素添加
    var tags = [
        "Unknown", "UList", "Title", "TextArea", "TableSection", "TableRow",
        "Table", "TableCol", "TableCell", "TableCaption", "Style", "Span",
        "Select", "Script", "Param", "Paragraph", "Option", "Object", "OList",
        "Meta", "Marquee", "Map", "Link", "Legend", "Label", "LI", "Input",
        "Image", "IFrame", "Html", "Heading", "Head", "HR", "FrameSet",
        "Frame", "Form", "Font", "FieldSet", "Embed", "Div", "DList",
        "Button", "Body", "Base", "BR", "Area", "Anchor"
    ], html5tags = [
        "abbr", "article", "aside", "audio", "canvas", "datalist", "details",
        "dialog", "eventsource", "figure", "footer", "header", "hgroup", "mark",
        "menu", "meter", "nav", "output", "progress", "section", "time", "video"
    ], properties = {
        addEventListener: { value: addEventListener },
        removeEventListener: { value: removeEventListener },
        dispatchEvent: { value: dispatchEvent }
    };
    for (var o, n, i = 0; o = window["HTML" + tags[i] + "Element"]; i++)
        tags[i] = o.prototype;
    for (i = 0; i < html5tags.length; i++)
        tags.push(document.createElement(html5tags[i]).constructor.prototype);
    for (i = 0; o = tags[i]; i++)
        for (n in properties) Object.defineProperty(o, n, properties[n]);
})();