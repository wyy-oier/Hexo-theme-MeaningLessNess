$(document).ready(function () {
    showArticleIndex();
    fillImageName();
});

function showArticleIndex() {
    // 先刷一遍文章有哪些节点，把 h1 h2 h3 加入列表，等下循环进行处理。
    // 如果不够，可以加上 h4 ,只是我个人觉得，前 3 个就够了，出现第 4 层就目录就太长了，太细节了。
    var h1List = h2List = h3List = [];
    var labelList = $("#article").children();
    var h1Cnt = h2Cnt = h3Cnt = 0;
    for(var i = 0;i < labelList.length;i++) {
        if ($(labelList[i]).is("h1")) {
            ++h1Cnt;
            h2List = new Array();
            h1List.push({node: $(labelList[i]), id: i, children: h2List, cnt1: h1Cnt, cnt2: 0, cnt3: 0});
            h2Cnt = h3Cnt = 0;
        }

        if ( $(labelList[i]).is("h2") ) {
            ++h2Cnt;
            h3List = new Array();
            h2List.push({node: $(labelList[i]), id: i, children: h3List, cnt1: h1Cnt, cnt2: h2Cnt, cnt3: 0});
            h3Cnt = 0;
        }

        if ( $(labelList[i]).is("h3") ) {
            ++h3Cnt;
            h3List.push({node: $(labelList[i]), id: i, children: [], cnt1: h1Cnt, cnt2: h2Cnt, cnt3: h3Cnt});
        }
    }

    // 闭包递归，返回树状 html 格式的文章目录索引
    function show(tocList) {
        var content = "";
        tocList.forEach(function (toc) {
            console.log(toc.node);
            toc.node.before('<span class="anchor" id="_label'+toc.id+'"></span>');
            if (toc.children == 0) {
                if(toc.cnt2 == 0) {
                    content += '<a href="#_label'+toc.id+'">'+ toc.cnt1 + ' ' + toc.node.text()+'</a></br>';
                }
                else if(toc.cnt3 == 0) {
                    content += '<a href="#_label'+toc.id+'">'+ toc.cnt1 + '.' + toc.cnt2 + ' ' + toc.node.text()+'</a></br>';
                }
                else {
                    content += '<a href="#_label'+toc.id+'">'+ toc.cnt1 + '.' + toc.cnt2 + '.' + toc.cnt3 + ' ' + toc.node.text()+'</a></br>'
                }
            }
            else {
                if(toc.cnt2 == 0) {
                    content += '<a href="#_label'+toc.id+'">'+ toc.cnt1 + ' ' +toc.node.text()+'</a></br>';
                }
                else if(toc.cnt3 == 0) {
                    content += '<a href="#_label'+toc.id+'">'+ toc.cnt1 + '.' + toc.cnt2 + ' ' + toc.node.text()+'</a></br>';
                }
                else {
                    content += '<a href="#_label'+toc.id+'">'+ toc.cnt1 + '.' + toc.cnt2 + '.' + toc.cnt3 + ' ' + toc.node.text()+'</a></br>'
                }
                content += show(toc.children);
            }
        });
        // content += "</ul>"
        console.log(content);
        return content;
    }

  // 最后组合成 div 方便 css 设计样式，添加到指定位置
    $("#toc").empty();
    $("#toc").append(show(h1List));

    // 点击目录索引链接，动画跳转过去，不是默认闪现过去
    $("#toc a").on("click", function(e){
        e.preventDefault();
        // 获取当前点击的 a 标签，并前触发滚动动画往对应的位置
        var target = $(this.hash);
        $("body, html").animate(
            {'scrollTop': target.offset().top},
            500
        );
    });

    // 监听浏览器滚动条，当浏览过的标签，给他上色。
    $(window).on("scroll", function(e){
        var anchorList = $(".anchor");
        anchorList.each(function(){
            var tocLink = $('#toc a[href="#'+$(this).attr("id")+'"]');
            var anchorTop = $(this).offset().top;
            var windowTop = $(window).scrollTop();
            if ( anchorTop <= windowTop+50 ) {
                tocLink.addClass("read");
            }
            else {
                tocLink.removeClass("read");
            }
        });
    });
}

function fillImageName() {
    var labelList = $("#article").children(), imgList = [];
    var res = 0;
    

    function dfs(ulist) {
        for(var i = 0;i < ulist.length;i++) {
            if($(ulist[i]).is("img")) {
                imgList.push({node: $(ulist[i]), alt: ulist[i].alt});
            }
            var vlist = ulist[i].children;
            if(vlist.length != 0) {
                dfs(vlist);
            }
        }

    }

    dfs(labelList);

    imgList.forEach(function (image) {
        image.node.after('<p class = image-name>' + image.alt + '</p>');
    });

    console.log('res: ' + res);
}