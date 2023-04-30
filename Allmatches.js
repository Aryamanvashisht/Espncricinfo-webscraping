const request = require('request')
const cheerio  = require('cheerio');
const scorecardobj = require('./scorecard')
function getAllMatches(url){
    request(url, (err,response,html)=>{
        if(err){
            console.log(err);
           }
           else{
            extractLink2(html)
           }
    })
}

function extractLink2(html){
    let $ = cheerio.load(html)
    let scorecardElem = $('.ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a')

    for(var i=0; i<scorecardElem.length;i++){
        let link = $(scorecardElem[i]).attr('href')
        let fulllink = 'https://www.espncricinfo.com'+link
        console.log(fulllink);
        scorecardobj.ps(fulllink);
    }
}

module.exports = {
    gAllmatches : getAllMatches
}