// jshint esversion: 6, asi: true

const fs = require('fs')
const express = require('express')
const { exec } = require('child_process')

const app = express();
const port = process.env.PORT || 4242;

// setup dir structure
exec('mkdir data', () => {})
exec('mkdir data/desc', () => {})


app.use(express.json())

app.get('/',(req, res) => {
    res.send('🦄🦄🦄')
})

app.listen(port,() => {
    console.log(`Started on http://127.0.0.1:${port} @ ${new Date()}`)
})


app.get('/test',(req, resp) => {
    //sfdx force:mdapi:listmetadata
    // -m CustomObject -f /path/to/outputfilename.txt  -u me@example.com --json

    // 


/* force:schema:sobject:describe

-s SOBJECTTYPE 
[-t]
[-u TARGETUSERNAME]
[--json]
[--loglevel LOGLEVEL]
*/

    const opts = {
        cmd: 'sfdx force:schema:sobject:describe ',
        user_: 'timfull',
        sObject_: `Account`,
        tooling_: false,
        json__: true,
    }

    sobject(opts)
    .then(x => resp.send(x))
    .catch(x => resp.send(x))

})





function sobject(opts) {

    return new Promise((res, rej) => {
        
        const str = stringer(opts)

        exec(str, (error, stdout, stderr) => {
            
            console.log(str)
            console.log(error)
            console.log(stdout)
            console.log(stderr)

            error ? rej(stderr) : res(stdout)
        })
    })
}




function retrieve(opts) {
/*  [-a APIVERSION]
    [-w WAIT]
    -r RETRIEVETARGETDIR 
    [-k UNPACKAGED]
    [-d SOURCEDIR]
    [-p PACKAGENAMES]
    [-s]
    [-i JOBID]
    [-u TARGETUSERNAME]
    [--json]
    [--loglevel LOGLEVEL]
    
    
    const opts = {
        cmd: 'sfdx force:mdapi:listmetadata --verbose ',
        user_: 'timfull',
        meta_: `Account`,
        retrieveDir_: "data",
        json__: true,
    }



    retrieve(opts)
    .then(x => resp.send(x))
    .catch(x => resp.send(x))
    [--verbose] */

    return new Promise((res, rej) => {

        
        
        const str = stringer(opts)

        exec(str, (error, stdout, stderr) => {
            
            console.log(str)
            console.log(error)
            console.log(stdout)
            console.log(stderr)

            error ? rej(stderr) : res(stdout)
        })

    })
}


/* 

const opts = {
    cmd: 'sfdx force:mdapi:listmetadata',
    user_: 'timfull',
    meta_: `CustomObject`,
    file_: "data/listmetadata.json",
    json__: true,
}

listmetadata(opts)
.then(x => resp.send(x))
.catch(x => resp.send(x))

*/
function listmetadata(opts) {

    return new Promise((res, rej) => {

        
        
        const str = stringer(opts)

        exec(str, (error, stdout, stderr) => {
            
            console.log(str)
            console.log(error)
            console.log(stdout)
            console.log(stderr)

            error ? rej(stderr) : res(stdout)
        })

    })
}




function treeExport() {

    return new Promise((res, rej) => {

        const opts = {
            cmd: 'sfdx force:data:tree:export',
            query_: `"select id, name from contact order by lastmodifieddate limit 5"`,
            dir_: "data",
            json__: true,
            plan__: true,
            user_: 'timfull'
        }
        
        
        const str = stringer(opts)

        exec(str, (error, stdout, stderr) => {
            
            console.log(str)
            console.log(error)
            console.log(stdout)
            console.log(stderr)

            error ? rej(stderr) : res(stdout)
        })

    })
}


function describemetadata(resp) {


    return new Promise((res, rej) => {
        //jamie@The-Brain:~/repo/sf-datajs$ sfdx force:mdapi:describemetadata -u timfull

        const opts = {
            cmd: 'sfdx force:mdapi:describemetadata',
            user_: 'timfull',
            json__: true
        }
        
        const str = stringer(opts)

        exec(str, (error, stdout, stderr) => {
            
            console.log(str)
            console.log(error)
            console.log(stdout)
            console.log(stderr)

            error ? rej(stderr) : res(stdout)
        })
    })
    .then(x => {
        fs.writeFile(`${__dirname}/data/desc/describemetadata.json`, x, (e) => {
            console.log('in wrote file')
            console.log(e)
        })
        resp.send(x)
    })
    .catch(e => resp.send(e))

}



function stringer(opts){
    
    let vals = ''

    for(const o in opts){
        
        const firstChar = o.substring(0, 1)
        const lastChar = o.substring(o.length-1, o.length)
        const last2 = o.substring(o.length-2, o.length)

        if(last2 == '__'){
            vals += `--${o.substring(0, o.length-2)} `
        }
        else if(lastChar == '_'){
            vals += opts[o] === true || opts[o] === false 
                ? `-${firstChar} `
                : `-${firstChar} ${opts[o]} `
        }
        else {
            vals += `${opts[o]} `
        }
    }
    return vals
}