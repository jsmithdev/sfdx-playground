
// jshint esversion: 6
// Meant to auto run with Quokka.js for testing

const { exec } = require('child_process')

const opts1 = {
    cmd: 'sfdx force:data:tree:export',
    query_: `"select id, name from contact order by lastmodifieddate limit 5"`,
    dir_: "data",
    json__: true,
    plan__: true,
    user_: 'timfull'
}


/*
-s SOBJECTTYPE 
[-t]
[-u TARGETUSERNAME]
[--json]
[--loglevel LOGLEVEL]
*/
const opts = {
    cmd: 'sfdx force:schema:sobject:describe --verbose ',
    user_: 'timfull',
    sObject_: `Account`,
    tooling_: false,
    json__: true,
}




const vals = stringer(opts)

vals //?

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