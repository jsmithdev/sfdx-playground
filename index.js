// jshint esversion: 6, asi: true

const { exec } = require('child_process')
const express = require('express')

const app = express();
const port = process.env.PORT || 4242;

app.use(express.json())

app.get('/',(req, res) => {
    res.send('🦄🦄🦄')
})

app.listen(port,() => {
    console.log(`Started on http://127.0.0.1:${port} @ ${new Date()}`)
})

function stringer(opts){
console.log('hello hello')


    let vals = ''

    for(const o in opts){
        
        const firstChar = o.substring(0, 1)
        const lastChar = o.substring(o.length-1, o.length)
        const last2 = o.substring(o.length-2, o.length)
        console.log(last2)
        
        vals += last2 == '__'
            ? `--${o.substring(0, o.length-2)} `
            : lastChar == '_'
                ? `-${firstChar} ${opts[o]} `
                : `${opts[o]} `
    }
    console.log(vals)
    return vals
}

app.get('/test',(req, resp) => {


    const test = () => new Promise((res, rej) => {

        const opts = {
            cmd: 'sfdx force:data:tree:export',
            query_: `"select id, name from contact order by lastmodifieddate limit 5"`,
            dir_: "data",
            json__: true,
            plan__: true,
            user_: 'timfull'
        }
        
        
        const str = stringer(opts)
        console.log(str)

        exec(str, (error, stdout, stderr) => {
            
            console.log(str)
            console.log(error)
            console.log(stdout)
            console.log(stderr)

            error ? rej(stderr) : res(stdout)
        })

    })

    test()
    .then(x => resp.send(x))
    .catch(e => resp.send(e))
})




