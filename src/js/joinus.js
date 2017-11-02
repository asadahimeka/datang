//判断是否为FF，若为FF设置日期时间输入框的placeholder
if (navigator.userAgent.indexOf('Firefox') > -1) {
    $('.inp-date').attr('placeholder', '请您输入日期');
    $('.inp-time').attr('placeholder', '请您输入时间');
}

//点击提交按钮检查输入框内容是否有空，有的话变红提示
$('button[type=submit]').click(function () {
    var flag = num = 0;
    $('input').each(function (index, element) {
        if (!element.value) {
            element.value = element.placeholder;
            element.style.color = 'red';
            flag++;
        }
    });
    if (flag > 0) {
        return false;
    } else {
        $('input').each(function (index, element) {
            if (element.style.color == 'red') {
                num++;
                return false;
            }
        });
        num == 0 ? alert('提交成功') : 0;        
    }
});

$('.inp2').click(function () {
    $(this).css('color', '#000');
});

window.onload = () => {
    if ($('input').val().includes('请您输入')) {
        $('input').css('color', 'red');
    }
}

//检查联系电话格式
var reg = /^((13|14|15|18)\d{9}|\d{3}-?\d{8}|\d{4}-?\d{7,8})$/;
$('input').focus(function () {
    $(this).css('color', '#000');
    if ($(this).val().includes('请您输入')) {
        $(this).val('');
    }
}).blur(function () {
    if (!$(this).val()) {
        $(this).val($(this).attr('placeholder') + '!');
        $(this).css('color', 'red');
        return false;
    } else if ($(this).hasClass('inp-tel') && !reg.test($(this).val())) {
        $(this).val('请您输入正确的联系电话！');
        $(this).css('color', 'red');
        return false;
    }
});

//只允许输入数字和退格
$('.inp-num').keydown(onlynumber);
function onlynumber() {
    var k = event.keyCode;
    if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8))
        return true;
    else
        return false;
}