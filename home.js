
const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
// Venue date opponent result runs balls fours sixes sr

const request = require('request');
const cheerio  = require('cheerio');
const Allmatchobj = require('./Allmatches')
const fs = require('fs');
const path = require('path');

// home page 
let filepath = path.join(__dirname, "IPL");
dircreate(filepath);
//this above 2 line make a file if it exist then not make any 


request(url,(err,response,html)=>{
   if(err){
    console.log(err);
   }
   else{
    //console.log(html);
    extractLink(html)
   }
})

function extractLink(html){
    let $ = cheerio.load(html);
    let viewAllResults = $('.ds-border-t.ds-border-line.ds-text-center.ds-py-2>a');
    let hrefValue = viewAllResults.attr('href');
    //  console.log(hrefValue);
    let fullLink = 'https://www.espncricinfo.com'+ hrefValue;
    //console.log(fullLink);
    Allmatchobj.gAllmatches(fullLink)
    // scorecardobj.ps(fullLink)
}

function dircreate(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath);
    }
}

