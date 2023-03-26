const express = require("express");
const router = express.Router();
const fs = require('fs');
router.get('/debt/getFileData/:startDate/:endDate/:type/:country', (req,res)=> {
    const {parse} = require('csv-parse');
    let startDate = parseInt(req.params.startDate);
    let endDate = parseInt(req.params.endDate);
    let type = req.params.type;
    let country = req.params.country;
    console.log(req.params);
    let result = [];
    let headerType = country;
    let recs = [];
    let parser = parse({columns: true}, async (err, records) => {
        result = await records.filter(rec=> {
            let yearInCsv = rec[Object.keys(rec)[0]];
            yearInCsv = parseInt(yearInCsv);
            
            if(yearInCsv>=startDate && yearInCsv<=endDate) {
                return true;
            } else
                return false;
        })
        let keys = [];
        let recs = [];
        await result.map(rec=> {
            let yearInCsv = rec[Object.keys(rec)[0]];
            if(keys.length==0) {
                keys = Object.keys(rec);
            }
            for(let i=0;i<keys.length;i++) {
                let year = parseInt(yearInCsv);
                if(year!=null && year>=startDate && year<=endDate) {
                        let rdata = year==null || isNaN(year)?0:parseFloat(year);
                    let rest = [rdata, parseFloat(rec[headerType])]
                    recs.push(rest);
                }
            }
        })
        return res.status(200).send(recs);
    });
    
    fs.createReadStream(__dirname+'/../csv/debt/'+type+'.csv').pipe(parser);

}) 
module.exports = router;