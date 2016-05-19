/**
 * Created by Administrator on 2016/5/9.
 */
//实现一个广工新闻通知网的小爬虫，当有新通知时，自动发邮件到自己的邮箱。

var http=require('http');
var cheerio=require('cheerio');
var Promise=require('Promise');
var baseurl='http://news.gdut.edu.cn';
var dataBase=require('./dataBase').dataBase;
var getHtml='';

/*要得到的数据格式
 *
 * {
 *   title:'',
 *   info:[{
 *     id:''
 *     title:'',
 *     href:'',
 *     content:''
 *   }]
 * }
 *
 * */

function filterData(html) {
    var $ = cheerio.load(html);
    var chapters = $('#hot_news  li');
    var title =$('#hot_news .title h2').text();;
    var courseData = {
        title: title,
        info: []
    };
    chapters.each(function (item) {
        var chapter = $(this);
        var chapter_a = chapter.find('a');
        var title = chapter_a.attr('title');
        var href =baseurl+ chapter_a.attr('href');
        var id=href.split('articleid=')[1];
        var chapterData = {
            id:id,
            title: title,
            href: href,
            content:''
        };
        courseData.info.push(chapterData);

    })
    return courseData;
}


function  getInfoContent(infoData){
    var infoArray=[];
    infoData.info.forEach(function(info){
       infoArray.push(getPageAssync(info.href));
    })
   return infoArray;
}

function getInfo(html){
    var $ = cheerio.load(html);
    var content=$('#articleBody').text();
    return content;

}

function showData(infoData){
    console.log('#########'+infoData.title+'##########\n');
    infoData.info.forEach(function(data){
        console.log('     '+data.title+':    '+data.href+'\n');
        console.log(data.content);
    })
}


function getPageAssync(url){
    return new Promise(function(resolve,reject){
        http.get(url,function(res){
            var html='';
            res.on('data',function(chumk){
                html+=chumk;
            });
            res.on('end',function(){
                resolve(html);
            })
            res.on('err', function (err){
                console.log('数据加载失败');
                reject(e);
            })
        })
    })
}

setInterval(function (){
    getPageAssync(baseurl)
        .then(function(pages){
            var i=0;
            var infoData=filterData(pages);
            var infoArray= getInfoContent(infoData);
            Promise.all(infoArray).then(function(pages){
                pages.forEach(function(html){
                    infoData.info[i++].content=getInfo(html);
                })
                //showData(infoData);
                dataBase(infoData.info)
            });
        });
},60*60*1000);
