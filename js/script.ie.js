/**
    @fileOverview
    HTML5幻灯片脚本，IE下的特殊处理
    @author Jinjiang<zhaojinjiang@yahoo.com.cn>
 */




// 舍弃页面内动画的效果
addHook(hooksBeforeInit, function () {
    $('body > div').addClass('slide');
    $('.actable').removeClass('actable');
});


// 初始化显示默认的幻灯片
addHook(hooksAfterInit, function () {
    $('#slide' + currentPage).addClass('current-slide');
});


// 由于不支持:target伪类，故通过这种方式进行翻页
addHook(hooksAfterNav, function () {
    $('.current-slide').removeClass('current-slide');
    $('#slide' + currentPage).addClass('current-slide');
});



