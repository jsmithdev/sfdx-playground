
// jshint esversion: 6

const opts = {
    cmd: 'sfdx force:data:tree:export',
    query_: `"select id, name from contact order by lastmodifieddate limit 5"`,
    dir_: "data",
    json__: true,
    plan__: true,
    user_: 'timfull'
}



let vals = ''

for(const o in opts){
    
    const firstChar = o.substring(0, 1)
    const lastChar = o.substring(o.length-1, o.length)
    const last2 = o.substring(o.length-2, o.length)

    vals += last2 == '__'
            ? `--${o.substring(0, o.length-2)} `
            : lastChar == '_'
                ? `-${firstChar} ${opts[o]} `
                : `${opts[o]} `
}

vals //?