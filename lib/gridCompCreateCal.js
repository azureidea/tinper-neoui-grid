var trHoverFun = function trHoverFun(index) {
    if (index < 0) return;
    var oThis = this;
    $('#' + oThis.options.id + '_content_tbody').find('tr[role="row"]').removeClass('u-grid-move-bg');
    $('#' + oThis.options.id + '_content_fixed_tbody').find('tr[role="row"]').removeClass('u-grid-move-bg');
    if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
    if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
    if (index > -1) {
        var $tr = $('#' + oThis.options.id + '_content_tbody').find('tr[role="row"]').eq(index);
        if ($tr && $tr[0] && $tr[0].id && $tr[0].id == oThis.options.id + '_edit_tr') {
            return;
        }
        $('#' + oThis.options.id + '_content_tbody').find('tr[role="row"]').eq(index).addClass('u-grid-move-bg');
        $('#' + oThis.options.id + '_content_fixed_tbody').find('tr[role="row"]').eq(index).addClass('u-grid-move-bg');
        if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').eq(index).addClass('u-grid-move-bg');
        if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').eq(index).addClass('u-grid-move-bg');
        if (typeof oThis.options.onRowHover == 'function' && !$tr.is('.u-grid-content-sum-row')) {
            var obj = {};
            obj.gridObj = oThis;
            obj.rowObj = oThis.dataSourceObj.rows[index];
            obj.rowIndex = index;
            oThis.options.onRowHover(obj);
        }
    }
};
/*
 * 定时器处理
 */
var setIntervalFun = function setIntervalFun(e) {
    this.widthChangeFun();
    this.heightChangeFun();
    this.editorRowChangeFun();
};
var editorRowChangeFun = function editorRowChangeFun() {};
/*
 * grid区域创建完成之后处理
 * 1、数据列显示处理
 * 2、取行高
 */
var afterGridDivsCreate = function afterGridDivsCreate() {
    if (this.showType != 'grid') return;
    this.columnsVisibleFun();
    this.resetThVariable();
    this.countRowHeight();
    this.noRowsShowFun();
    this.renderTypeFun();
    this.resetScrollLeft();
    this.hideEditMenu();
    this.resetLeftHeight();
    this.isCheckedHeaderRow();
    this.resetColumnWidthByRealWidth();
    if (typeof this.options.afterCreate == 'function') {
        this.options.afterCreate.call(this);
    }
};
/*
 * 取行高
 */
var countRowHeight = function countRowHeight() {
    if ($('#' + this.options.id + '_content_tbody tr')[0]) {
        this.rowHeight = $('#' + this.options.id + '_content_tbody tr')[0].offsetHeight;
    }
};

/**
 * 根据内容区的高度调整左侧区域的高度
 */
var resetLeftHeight = function resetLeftHeight() {
    if (!this.options.needResetHeight) {
        return;
    }
    this.resetLeftHeightTimes = 0;
    var self = this;
    if (this.resetLeftHeightSetTimeout) clearTimeout(this.resetLeftHeightSetTimeout);
    this.resetLeftHeightSetTimeout = setTimeout(function () {
        resetLeftHeightFun.call(self);
    }, 100);
};

var resetLeftHeightFun = function resetLeftHeightFun() {
    if (this.options.showNumCol || this.options.multiSelect) {
        var self = this;
        var $trs = $('#' + this.options.id + '_content_tbody tr[role="row"]');
        var $leftNums = $('#' + this.options.id + '_content_numCol div');
        var $leftSelects = $('#' + this.options.id + '_content_multiSelect > div');
        for (var i = 0; i < $trs.length; i++) {
            var nowRowHeight = $trs[i].offsetHeight;
            if (nowRowHeight == 0 && this.resetLeftHeightTimes < 50) {
                this.resetLeftHeightTimes++;
                this.resetLeftHeightSetTimeout = setTimeout(function () {
                    resetLeftHeightFun.call(self);
                }, 100);
            }
            if ($leftNums[i]) {
                $leftNums[i].style.height = nowRowHeight + 'px';
                $leftNums[i].style.lineHeight = nowRowHeight + 'px';
            }

            if ($leftSelects[i]) {
                $leftSelects[i].style.height = nowRowHeight + 'px';
                $leftSelects[i].style.lineHeight = nowRowHeight + 'px';
                $($leftSelects[i]).find('.u-grid-checkbox-outline').css('top', (nowRowHeight - 14) / 2);
            }
        }
    }
    this.resetLeftHeightGroupSumFun();
};
var resetLeftHeightGroupSumFun = function resetLeftHeightGroupSumFun() {};
/*
 * 处理是否显示无数据行
 */
var noRowsShowFun = function noRowsShowFun() {
    if (this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0) {
        $('#' + this.options.id + '_noRowsShow').css('display', 'none');
        $('#' + this.options.id + '_noRows').css('display', 'none');
    } else {
        $('#' + this.options.id + '_noRowsShow').css('display', 'block');
        $('#' + this.options.id + '_noRows').css('display', 'block');
    }
};

/*
 * grid区域重画完成之后处理，已经执行过afterGridDivsCreate
 * 1、设置横向滚动条
 * 2、隐藏编辑按钮
 */
var afterRepaintGrid = function afterRepaintGrid() {
    this.resetScrollLeft();
    this.hideEditMenu();
};
/*
 * 设置横向滚动条
 */
var resetScrollLeft = function resetScrollLeft() {
    if ($('#' + this.options.id + '_content_div')[0]) {
        try {
            $('#' + this.options.id + '_content_div')[0].scrollLeft = this.scrollLeft;
        } catch (e) {}
    }
};
/*
 * 隐藏编辑按钮
 */
var hideEditMenu = function hideEditMenu() {};

export var createCalFunOjb = {
    trHoverFun: trHoverFun,
    setIntervalFun: setIntervalFun,
    editorRowChangeFun: editorRowChangeFun,
    afterGridDivsCreate: afterGridDivsCreate,
    countRowHeight: countRowHeight,
    noRowsShowFun: noRowsShowFun,
    afterRepaintGrid: afterRepaintGrid,
    resetScrollLeft: resetScrollLeft,
    hideEditMenu: hideEditMenu,
    resetLeftHeight: resetLeftHeight,
    resetLeftHeightGroupSumFun: resetLeftHeightGroupSumFun
};