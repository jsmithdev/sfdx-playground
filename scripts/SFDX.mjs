// jshint esversion: 6, asi: true, laxcomma: true, laxbreak: true
'use strict()'
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// sfdx force:mdapi:deploy -d from_meta -w -1 --ignoreerrors -g -l NoTestRun


//  console.dir(sfdx)

export default {

    getUsers(){
        return new Promise(res => {

            async function run() {
                const { stdout, stderr } = await exec('sfdx force:org:list')
                //console.log('stdout:', stdout)
                //console.log('stderr:', stderr)

                const regex = /[\w\.-]+@[\w\.-]+/g
                const uids = stdout.match(regex)

                res(uids)
            }
            run()
        })
    },

    describeMeta(username){
        return new Promise(res => {
            console.log(`testing test wuith ===> ${username}`)
            async function run() {

                const { stdout, stderr } = await exec(`sfdx force:mdapi:describemetadata -u ${username} --json `)

                res(stdout)
            }
            run()
        })
    },

    retrieveMeta(username){
        
        return new Promise(res => {

            /* RESOURCES & ROAD MAP FOR CLONE ATTEMPT UNO

            get package.xml created from vs code => later use describe metadata perhaps 

            create directory structure for clean cloning enviorment --v

            user-named project folder
            |
            |-- FROM_META <= this is where to dump metadata from org1
            |
            |-- STAGE_META <= this will be where the metadata gets staged -> so limbo between FROM_META and HOT_META
            |
            |-- HOT_META <= this is where metadata will be deploy from, copied to, edited massivly perhaps, deleted without warning, etc.


            https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_mdapi.htm#mdapi:retrieve

            https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_retrieve_pack_xml.htm
            
            */


            console.log(`testing test wuith ===> ${username}`)
            async function run() {

                const { stdout, stderr } = await exec(`sfdx force:mdapi:retrieve -u ${username} --json `)

                res(stdout)
            }
            run()
        })
    }
}
    
