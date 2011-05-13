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




// -------------------- 程序初始化 --------------------


// 根据浏览器尺寸调整页面大小，
// 根据location中的hash值设置默认显示的幻灯片(#slideX)
$(function () {

    // 程序运行之前的扩展钩子
    runHooks(hooksBeforeInit);

    // 初始化页面尺寸
    resize();
    $(window).resize(resize);

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
    }
    
    // 程序初始化之后的扩展钩子
    runHooks(hooksAfterInit);

    /*

    // 绑定鼠标点击事件
    $(window).click(function (evt) {
        var DISABLED_NODENAME_MAP = {
            INPUT: true,
            SELECT: true,
            TEXTAREA: true,
            A: true
        };
        
        if (runHooks(hooksBeforeClick)) {
            return;
        }
    
        if (DISABLED_NODENAME_MAP[evt.target.nodeName]) {
            return;
        }
        
        gotoNext();
    
        runHooks(hooksAfterClick);
    });
    

    // 绑定触摸屏的触摸事件
    document.body.addEventListener('touchstart', function (e) {
        window._touchStartX = e.touches[0].pageX;
    }, false);

    document.body.addEventListener('touchend', function (e) {
        var SWIPE_SIZE = 150;
        var delta = e.changedTouches[0].pageX - window._touchStartX;

        if (delta > SWIPE_SIZE) {
            gotoNext();
        } else if (delta < -SWIPE_SIZE) {
            gotoPrev();
        }
    }, false);
    
    */
});


// 根据用户的键盘操作匹配翻页、显示动画等操作
$('html, body').keydown(function (evt) {
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
        gotoPrev();
        break;
    case 34:
        gotoNext();
        break;
    case 35:
        gotoPage(maxPage);
        break;
    case 36:
        gotoPage(1);
        break;
    case 37:
        gotoPrev();
        break;
    case 38:
        gotoPrev();
        break;
    case 39:
        gotoNext(true);
        break;
    case 40:
        gotoNext(true);
        break;
    case 13:
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
});


// 调整页面大小
function resize() {
    var defaultSize = {w: 690, h: 460};
    var screenSize = {w: $(document).width(), h: $(document).height()};
    
    var scale = 1;
    var marginTop = 0;
    var marginLeft = 0;
    
    if (typeof document.body.style.WebkitTransform == 'string') {
        // 针对webkit内核，通过translate的方式进行幻灯片缩放，以便适合各种分辨率
        scale = Math.min(screenSize.w / defaultSize.w, screenSize.h / defaultSize.h);
        scale =  Math.round(scale * 100) / 100;
    
        marginTop = Math.round((screenSize.h - (defaultSize.h - 60) * scale) / 2);
        marginLeft = Math.round((screenSize.w - (defaultSize.w - 90) * scale) / 2 -
                (screenSize.w * (1 - scale) / 2));

        $(document.body).css('WebkitTransform',
                'translate(' + marginLeft + 'px, ' + marginTop + 'px) scale(' + scale + ')');
    }
    else {
        // 针对非webkit内核，通过top/left设置幻灯片位置为居中
        marginTop = Math.round((screenSize.h - (defaultSize.h - 60) * scale) / 2);
        marginLeft = Math.round((screenSize.w - (defaultSize.w - 90) * scale) / 2 -
                (screenSize.w * (1 - scale) / 2));

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




