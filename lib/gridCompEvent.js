import { gridBrowser } from './gridBrowser';
/*
 * 创建完成之后顶层div添加监听
 */
var initEventFun = function initEventFun() {
    var oThis = this;
    $('#' + this.options.id).on('mousedown', function (e) {
        if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
            // 点击的是header区域
            oThis.mouseDownX = e.clientX;
            oThis.mouseDownY = e.clientY;
        } else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
            // 点击的是数据区域
        }
    });
};
/*
 * 创建完成之后grid层 div添加监听
 */
var initGridEventFun = function initGridEventFun() {
    var oThis = this;
    // 拖动
    this.initContentDivEventFun();
    // 全选
    $('#' + this.options.id + '_header_multi_input').on('click', function (e) {
        if (oThis.hasChecked) {
            oThis.setAllRowUnSelect();
        } else {
            oThis.setAllRowSelect();
        }
    });
};
/*
 * 内容区 div添加监听
 */
var initContentDivEventFun = function initContentDivEventFun() {
    var oThis = this;
    // 通过复选框设置选中行
    $('#' + oThis.options.id + '_content .u-grid-content-left').on('click', function (e) {
        var $input = $(e.target).closest('.u-grid-checkbox-outline');
        if ($input.length > 0) {
            var $div = $($input.parent());
            var index = $('.u-grid-content-multiSelect', $div.parent()).index($div);
            if ($input.hasClass('is-checked')) {
                oThis.setRowUnselect(index);
            } else {
                oThis.setRowSelect(index);
            }
        }
    });
    // 同步滚动条
    $('#' + this.options.id + '_content_div').on('scroll', function (e) {
        var sumRowH = 0,
            l;
        oThis.scrollLeft = this.scrollLeft;
        oThis.scrollTop = this.scrollTop;
        if (oThis.options.fixedFloat == 'right') {
            l = oThis.leftW - oThis.scrollLeft;
        } else {
            l = oThis.leftW - oThis.scrollLeft + oThis.fixedWidth;
        }
        $('#' + oThis.options.id + '_header_table').css('left', l + "px");
        $('#' + oThis.options.id + '_noScroll_begin_table').css('left', l + "px");
        $('#' + oThis.options.id + '_noScroll_end_table').css('left', l + "px");
        $('#' + oThis.options.id + '_noRowsShow').css('left', oThis.scrollLeft + "px");
        $('#' + oThis.options.id + '_edit_form').css('left', oThis.scrollLeft + "px");
        if (oThis.options.showSumRow && oThis.options.sumRowFirst && !oThis.options.sumRowFixed) {
            sumRowH = 44;
            if (oThis.options.sumRowHeight) sumRowH = oThis.options.sumRowHeight;
        }
        $('#' + oThis.options.id + '_content_multiSelect').css('top', -oThis.scrollTop + sumRowH + "px");
        $('#' + oThis.options.id + '_content_numCol').css('top', -oThis.scrollTop + sumRowH + "px");
        $('#' + oThis.options.id + '_content_fixed_div').css('top', -oThis.scrollTop + "px");
        if (gridBrowser.isIE10 || gridBrowser.isIPAD) {
            //ie10下示例系统中的档案节点新增数据之后前两次无法输入，因为此处会关闭输入控件
        } else {
            oThis.editClose();
        }
    });
    // 数据行相关事件
    $('#' + this.options.id + '_content_tbody').on('click', function (e) {
        // // 双击处理
        // if (typeof oThis.options.onDblClickFun == 'function') {
        //     oThis.isDblEvent('tbodyClick', oThis.dblClickFun, e, oThis.clickFun, e);
        // } else {
        //     oThis.clickFun(e);
        // }
        if (typeof oThis.options.onDblClickFun == 'function') {
            oThis.clickTimeout = setTimeout(function () {
                oThis.clickFun(e);
            }, 300);
        } else {
            oThis.clickFun(e);
        }
    });

    $('#' + this.options.id + '_content_tbody').dblclick(function (e) {
        if (typeof oThis.options.onDblClickFun == 'function') {
            if (oThis.clickTimeout) clearTimeout(oThis.clickTimeout);
            oThis.dblClickFun(e);
        }
    });
    $('#' + this.options.id + '_content_fixed_tbody').on('click', function (e) {
        // 双击处理
        // if (typeof oThis.options.onDblClickFun == 'function') {
        //     oThis.isDblEvent('tbodyClick', oThis.dblClickFun, e, oThis.clickFun, e);
        // } else {
        //     oThis.clickFun(e);
        // }
        if (typeof oThis.options.onDblClickFun == 'function') {
            oThis.clickTimeout = setTimeout(function () {
                oThis.clickFun(e);
            }, 300);
        } else {
            oThis.clickFun(e);
        }
    });
    $('#' + this.options.id + '_content_fixed_tbody').dblclick(function (e) {
        if (typeof oThis.options.onDblClickFun == 'function') {
            if (oThis.clickTimeout) clearTimeout(oThis.clickTimeout);
            oThis.dblClickFun(e);
        }
    });
    $('#' + this.options.id + '_content').on('mousemove', function (e) {
        var $tr = $(e.target).closest('tr'),
            $div = $(e.target).closest('div'),
            mousemoveIndex = -1;
        // 首先清除所有的背景
        if ($tr.length > 0) {
            mousemoveIndex = $('tr[role="row"]', $tr.parent()).index($tr);
        } else if ($div.length > 0 && ($div.hasClass('u-grid-content-multiSelect') || $div.hasClass('u-grid-content-num'))) {
            //左侧复选及数字列
            mousemoveIndex = $('div', $div.parent()).index($div);
        }

        oThis.trHoverFun(mousemoveIndex);
    });
    $('#' + this.options.id + '_content').on('mouseout', function (e) {
        $('#' + oThis.options.id + '_content_tbody').find('tr').removeClass('u-grid-move-bg');
        $('#' + oThis.options.id + '_content_fixed_tbody').find('tr').removeClass('u-grid-move-bg');
        if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
        if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
        if (typeof oThis.options.onContentOut == 'function') {
            var obj = {};
            obj.gridObj = oThis;
            var $tr = $(e.target).closest('tr');
            if ($tr.length > 0 && !$tr.is('.u-grid-content-sum-row')) {
                var mouseoutIndex = $('tr[role="row"]', $tr.parent()).index($tr);
                obj.rowObj = oThis.dataSourceObj.rows[mouseoutIndex];
                obj.rowIndex = mouseoutIndex;
            }
            oThis.options.onContentOut(obj);
        }
    });
};

export var eventFunObj = {
    initEventFun: initEventFun,
    initGridEventFun: initGridEventFun,
    initContentDivEventFun: initContentDivEventFun
};