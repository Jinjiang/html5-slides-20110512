/**
    @fileOverview
    HTML5幻灯片脚本
    @author Jinjiang<zhaojinjiang@yahoo.com.cn>
 */




if (!window.console) {
    window.console = {log: function () {}};
}


var currentPage = 0;
var maxPage = 1;
var mode = 1; // 1 means slide-mode, 2 means reading-mode



// -------------------- 翻页控制 --------------------


/**
    翻到指定页面。
    对于用户输入的页码，需要进行类型和范围的容错判断。
    如果用户输入的页码无效或等于当前页码，则不做任何处理。
    @param {integer} page 指定的页数
 */
function gotoPage(page) {
    page = page - 0 || 0;

    if (page > maxPage) {
        return;
    }
    if (page < 1) {
        return;
    }
    if (currentPage == page) {
        return;
    }

    // 翻页之前的扩展钩子
    if (runHooks(hooksBeforeNav)) {
        return;
    }

    currentPage = page;
    location = '#slide' + currentPage;
    window.scrollX = 0;
    window.scrollY = 0;

    // 翻页之后的扩展钩子
    runHooks(hooksAfterNav);
}


/**
    刷新当前页面。
 */
function refreshCurrentPage() {
    gotoPage(currentPage);
}


/**
    翻到后一页或显示下一个动画。
    播放动画时，会寻找当前页面内class为actable的元素，
    并将其中的第一个的class改为acted。
    @param {boolean} needCheckActions 是否优先播放当前页内的未播放动画
 */
function gotoNext(needCheckActions) {
    var currentAction = $('#slide' + currentPage).find('.actable')[0];

    // if (false && currentAction) {
    if (needCheckActions && currentAction) {
        $(currentAction).addClass('acted').removeClass('actable');
    }
    else {
        if (currentPage > maxPage) {
            return;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
    
        gotoPage(currentPage - (-1));
    }
}


/**
    翻到前一页
 */
function gotoPrev() {
    if (currentPage < 1) {
        return;
    }
    if (currentPage > maxPage) {
        currentPage = maxPage;
    }

    gotoPage(currentPage - 1);
}




// -------------------- 事件绑定 --------------------


/**
    根据用户的键盘操作匹配翻页、显示动画等操作
    @event
 */
function keydown(evt) {
    var DISABLED_NODENAME_MAP = {
        INPUT: true,
        SELECT: true,
        TEXTAREA: true,
        A: true
    };
    
    // 快捷键生效之前的扩展钩子
    if (runHooks(hooksBeforeKeydown)) {
        return;
    }

    // 特殊元素内不触发快捷键事件
    if (DISABLED_NODENAME_MAP[evt.target.nodeName]) {
        return;
    }

    // 根据按键匹配操作
    switch (evt.keyCode) {
    case 33:
        evt.preventDefault();
        gotoPrev();
        break;
    case 34:
        evt.preventDefault();
        gotoNext();
        break;
    case 35:
        evt.preventDefault();
        gotoPage(maxPage);
        break;
    case 36:
        evt.preventDefault();
        gotoPage(1);
        break;
    case 37:
        evt.preventDefault();
        gotoPrev();
        break;
    case 38:
        evt.preventDefault();
        gotoPrev();
        break;
    case 39:
        evt.preventDefault();
        gotoNext(true);
        break;
    case 40:
        evt.preventDefault();
        gotoNext(true);
        break;
    case 13:
        evt.preventDefault();
        gotoNext();
        break;
    case 71:
        if (evt.ctrlKey || evt.shiftKey) {
            evt.preventDefault();
            gotoPage(prompt('请输入您想要到达的页码：', currentPage));
        }
    default:
        ;
    }

    // 快捷键生效之后的扩展钩子
    runHooks(hooksAfterKeydown);
}


/**
    调整页面大小
    @event
 */
function resize() {
    var defaultSize = {w: 690, h: 460};
    var screenSize = {w: $(document).width(), h: $(document).height()};
    
    var scale = 1;
    var marginTop = 0;
    var marginLeft = 0;
    
    if (typeof document.body.style.WebkitTransform == 'string' ||
            typeof document.body.style.MozTransform == 'string' ||
            typeof document.body.style.OTransform == 'string' ||
            typeof document.body.style.transform == 'string') {
        // 针对有transform属性内核，通过translate的方式进行幻灯片缩放，以便适合各种分辨率
        scale = Math.min(screenSize.w / defaultSize.w, screenSize.h / defaultSize.h);
        scale =  Math.round(scale * 100) / 100;
    
        marginTop = Math.round((screenSize.h - (defaultSize.h - 60) * scale) / 2);
        marginLeft = Math.round((screenSize.w - (defaultSize.w - 90) * scale) / 2 -
                (screenSize.w * (1 - scale) / 2));
        
        var cssText = 'translate(' + marginLeft + 'px, ' + marginTop + 'px) scale(' + scale + ')';

        $(document.body).css('WebkitTransform', cssText).
                css('MozTransform', cssText).
                css('OTransform', cssText).
                css('transform', cssText);
    }
    else {
        // 针对ie内核，通过top/left设置幻灯片位置为居中
        var scale = (screen.deviceXDPI / screen.systemXDPI) || 1;
        /*marginTop = Math.round(((screenSize.h - defaultSize.h - 60) * scale) / 2);
        marginLeft = Math.round(((screenSize.w - defaultSize.w - 90) * scale) / 2 -
                (screenSize.w * (1 - scale) / 2));*/
        console.log([screenSize.h, defaultSize.h, scale]);
        marginTop = Math.round((screenSize.h - defaultSize.h + 60) / 2);
        marginLeft = Math.round((screenSize.w - defaultSize.w + 90) / 2);

        $('body > div').css('top', marginTop + 'px').css('left', marginLeft + 'px');
    }
}




// -------------------- 扩展钩子设计 --------------------


var hooksBeforeInit = [];
var hooksAfterInit = [];
var hooksBeforeNav = [];
var hooksAfterNav = [];
var hooksBeforeClick = [];
var hooksAfterClick = [];
var hooksBeforeKeydown = [];
var hooksAfterKeydown = [];


/**
    为某一个钩子添加扩展函数
    @param {Array} hooks 钩子触发的时机
    @param {Function} func 要加入的扩展
 */
function addHook(hooks, func) {
    if ($.inArray(func, hooks) == -1) {
        hooks.push(func);
    }
}


/**
    执行某个钩子
    其实就是把大家绑在某个钩子上的函数都拿出来执行一遍
    @param {Array} hooks 钩子触发的时机
 */
function runHooks(hooks) {
    var result = false;

    $.each(hooks, function (i, hook) {
        if ($.isFunction(hook)) {
            if (hook()) {
                result = true;
            }
        }
    });

    return result;
}




// -------------------- 程序初始化 --------------------


// 根据浏览器尺寸调整页面大小，
// 根据location中的hash值设置默认显示的幻灯片(#slideX)
$(function () {

    // 程序运行之前的扩展钩子
    runHooks(hooksBeforeInit);

    // 初始化页面尺寸，绑定键盘事件
    resize();
    $(window).resize(resize);
    $('html, body').keydown(keydown);

    // 初始化幻灯片的总数
    maxPage = $('body > div').each(function (i, slide) {
        slide.id = 'slide' + (i - (-1));
    }).length;

    // 初始化默认显示幻灯片的编号
    var pageTarget = location.hash.match(/^\#slide(\d+)$/);

    // 翻页到默认显示的幻灯片
    if (!pageTarget || !(pageTarget[1] - 0) ||
            pageTarget[1] < 0 || pageTarget[1] > maxPage) {
        gotoPage(1);
    }
    else {
        currentPage = pageTarget[1];
        
        // hack the refresh problem in firefox/opera
        location = '#slide0';
        location = '#slide' + currentPage;
    }
    
    // 程序初始化之后的扩展钩子
    runHooks(hooksAfterInit);
});



