
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";
// Venue date opponent result runs balls fours sixes sr

const request = require('request')
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require("xlsx");

function processPlayer(url){

    request(url, (err, response, html) => {
        if (err) {
            console.log(err);
        }
        else {
            extractMatchDetails(html)
        }
    })
}

function extractMatchDetails(html) {

    let $ = cheerio.load(html)
    let descElem = $('.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3')
    let result = $('.ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo')
    let player = $('.ds-text-tight-l.ds-font-bold.ds-text-typo.hover\\:ds-text-typo-primary.ds-block.ds-truncate').eq(0)
    let opponent = $(".ds-text-tight-l.ds-font-bold.ds-text-typo.hover\\:ds-text-typo-primary.ds-block.ds-truncate").eq(1) //give the second team name

    let stringArr = descElem.text().split(",");
    let venue = stringArr[1]?.trim()
    let date = (stringArr[2] + stringArr[3]).toString().trim()
    // console.log(venue);
    // console.log(date);
    //console.log(descElem.text());
    //console.log(result.text());


    //.ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-border.ds-border-line.ds-mb-4 .ds-p-0
    //.ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-border.ds-border-line.ds-mb-4:lt(2)
    //.ds-rounded-lg.ds-mt-2
    //.ds-mt-3
    let innings = $('.ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-border.ds-border-line.ds-mb-4').slice(0, 2)
    // let htmlString = ""
    for (let i = 0; i < innings.length; i++) {
        //console.log(`${date} ${venue} ${player.text()} VS ${opponent.text()} AND ${result.text()}`);
        let cInnings = $(innings[i]);
        let allRows = cInnings.find('.ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr')
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find('td')
            let isWorthy = $(allCols[0]).hasClass('ds-w-0 ds-whitespace-nowrap ds-min-w-max ds-flex ds-items-center')
            if (isWorthy == true) {
                let playername = $(allCols[0]).text().trim()
                let runs = $(allCols[2]).text().trim()
                let balls = $(allCols[3]).text().trim()
                let fours = $(allCols[5]).text().trim()
                let sixes = $(allCols[6]).text().trim()
                let sr = $(allCols[7]).text().trim()
                //console.log(`${playername} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}`);
                processplayers(player.text(), playername,runs, balls, fours, sixes, sr,opponent.text(),
                venue, date, result.text())
            }
        }

    }
 
}

function processplayers(teamname, playername, run, balls, fours, sixs, sr, opponent, Venue, date, result) {
    let teampath = path.join(__dirname, "IPL", teamname);
    dircreate(teampath);
    let filepath = path.join(teampath, playername + ".xlsx");
    let contentofplayer = excelreader(filepath, playername);
    let playerobj = {
        teamname,
        playername,
        run,
        balls,
        fours,
        sixs,
        sr,
        opponent,
        Venue,
        date,
        result
    }
    contentofplayer.push(playerobj);
    excelwriter(filepath, contentofplayer, playername);
}


function dircreate(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath);
    }
}
function excelwriter(pathlink, json, sheetname) {
    // // make a new workbook 
    let newWb = xlsx.utils.book_new(pathlink, json, sheetname);
    // // make a new sheet 
    let newWs = xlsx.utils.json_to_sheet(json);
    // // now append the sheet 
    xlsx.utils.book_append_sheet(newWb, newWs, sheetname);
    // //file path 
    xlsx.writeFile(newWb, pathlink);
}

function excelreader(pathlink, sheetname) {
    if (fs.existsSync(pathlink) == false) {
        return [];
    }
    // // read the xlsx file
    // // This is for workbook read 
    let wb = xlsx.readFile(pathlink);
    // // this is for sheet 
    let exceldata = wb.Sheets[sheetname];
    // // after get the sheet data
    let ans = xlsx.utils.sheet_to_json(exceldata);
    // //print or return 
    return ans;
}

module.exports = {
    ps:processPlayer
}