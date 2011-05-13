/**
    @fileOverview
    HTML5幻灯片脚本，阅读模式和幻灯模式的切换
    @author Jinjiang<zhaojinjiang@yahoo.com.cn>
 */




/**
    由幻灯模式切换到阅读模式
 */
function slides2Articel() {

    // 判断当前状态是否可以进行模式切换
    if (mode != 1) {
        return;
    }

    // 引入阅读模式的css
    $('head link').remove();
    $('head').append('<link rel="stylesheet" href="css/read.css" />');
    document.body.style.cssText = '';
    $(window).unbind('resize', resize);
    $('html, body').unbind('keydown', keydown);

    // 修改状态参数
    mode = 2;

    // 去掉不必要的location hash
    location = '#';
}


/**
    由阅读模式切换到幻灯模式
 */
function articel2Slides() {

    // 判断当前状态是否可以进行模式切换
    if (mode != 2) {
        return;
    }

    // 引入幻灯片模式的css
    $('head link').remove();
    $('head').append('<link rel="stylesheet" href="css/style.css" />');
    resize();
    $(window).resize(resize);
    $('html, body').keydown(keydown);
    
    // 修改状态参数
    mode = 1;

    // 初始化显示第一张幻灯片
    location = '#slide1';
}



