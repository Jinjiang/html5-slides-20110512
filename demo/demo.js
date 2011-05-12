/**
    @fileOverview
    HTML幻灯片Demo脚本
    @author jinks@maxthon.net
 */




if (!window.console) {
    window.console = {log: function () {}};
}


var currentPage = 0;
var maxPage = 1;


/**
    翻页
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

    if (runHooks(hooksBeforeNav)) {
        return;
    }

    currentPage = page;
    location = '#slide' + currentPage;

    runHooks(hooksAfterNav);
}


/**
    刷新当前页面
 */
function refreshCurrentPage() {
    gotoPage(currentPage);
}


/**
    翻到后一页
    或显示下一个动画
 */
function gotoNext() {
    var currentAction = $('#slide' + currentPage).find('.actable')[0];

    if (currentAction) {
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


// 页面初始化
$(function () {
    resize();

    maxPage = $('body > div').each(function (i, slide) {
        slide.id = 'slide' + (i - (-1));
    }).length;

    var pageTarget = location.hash.match(/^\#slide(\d+)$/);
    if (!pageTarget || !(pageTarget[1] - 0) ||
            pageTarget[1] < 0 || pageTarget[1] > maxPage) {
        gotoPage(1);
    }
    else {
        currentPage = pageTarget[1];
    }

    /*$(window).click(function (evt) {
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
    });*/
    
    /*document.body.addEventListener('touchstart', function (e) {
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
    }, false);*/
});


// 绑定键盘事件
$(window).keydown(function (evt) {
    var DISABLED_NODENAME_MAP = {
        INPUT: true,
        SELECT: true,
        TEXTAREA: true,
        A: true
    };
    
    if (runHooks(hooksBeforeKeydown)) {
        return;
    }

    if (DISABLED_NODENAME_MAP[evt.target.nodeName]) {
        return;
    }

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
        gotoNext();
        break;
    case 40:
        gotoNext();
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

    runHooks(hooksAfterKeydown);
});




//------------------------------------


function resize() {
    var defaultSize = {w: 850, h: 650};
    var screenSize = {w: window.innerWidth, h: window.innerHeight};
    
    var scale = Math.min(screenSize.w / defaultSize.w, screenSize.h / defaultSize.h);
    scale =  Math.round(scale * 100) / 100;

    var marginTop = Math.round((screenSize.h - defaultSize.h + 50) / 2);
    
    // console.log(scale, marginLeft, marginTop);
    $(document.body).css('WebkitTransform',
            'translate(0px, ' + marginTop + 'px) scale(' + scale + ')');
}

$(window).resize(resize);




var hooksBeforeNav = [];
var hooksAfterNav = [];
var hooksBeforeClick = [];
var hooksAfterClick = [];
var hooksBeforeKeydown = [];
var hooksAfterKeydown = [];


function addHook(hooks, func) {
    if ($.inArray(func, hooks) == -1) {
        hooks.push(func);
    }
}

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