import fs from 'fs';
import mkdirp from 'mkdirp'
import superagent from 'superagent';
import { urlToFilename } from './utils.js';


const url = process.argv[2] ?? "https://www.google.com";

crawl(url, (err, filename, saved) => {
    if (err) return console.log(err);
    if (saved) console.log('saved ' + filename)
    else console.log('file already exists');
})

function crawl(url, cb) {
    const filename = urlToFilename(url);
    fs.access('./output/' + filename, (err => {
        if (err && err.code == 'ENOENT') {
            mkdirp('./output/'+filename.split('.html')[0]).then(() => {
                // if(err) return cb(err)
                superagent.get(url).end((err, res) => {
                    if (err) return cb(err);
                    const text = res.text;
                    fs.writeFile('./output/' + filename, text, (err) => {
                        if (err) return cb(err);
                        cb(null,filename,true)
                    })
                })

            })
        }
        else {
            //file exists
            cb(null, filename, false)
        }
    }))
}