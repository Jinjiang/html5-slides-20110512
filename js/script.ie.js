/**
    @fileOverview
    HTML5幻灯片脚本，IE下的特殊处理
    @author Jinjiang<zhaojinjiang@yahoo.com.cn>
 */




addHook(hooksBeforeInit, function () {
    $('body > div').addClass('slide');
    $('.actable').removeClass('actable');
});

addHook(hooksAfterInit, function () {
    $('#slide' + currentPage).addClass('current-slide');
});

addHook(hooksAfterNav, function () {
    $('.current-slide').removeClass('current-slide');
    $('#slide' + currentPage).addClass('current-slide');
});



