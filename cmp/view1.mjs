`

<style>
      .largeInput {
        width:17rem;
    }
    .zip {
        padding-top:5rem;
    }
    
    ul {
        padding-right: 1rem;
        text-align: left;
    }

    .selectable {
        list-style-type: none;
        border-bottom: 1pt solid #B3E5FC;
        border-top: 1pt solid #B3E5FC;
        padding: 1rem;
        cursor: pointer;
        background: transparent;
    }
    /*
    list-style-type: none;
    text-align: center;
    background: lightblue;
    padding: .5rem 0 .5rem 0;
    cursor: pointer;
    */

    .active {
        color: white;
        background: fuchsia;
    }

    .scroller {
        padding: 1rem;
        overflow: hidden;
        overflow-y: scroll;
        max-height: 35rem;
        margin-bottom: 2rem;
        border-right-width: 2pt;
        /* border: 1pt solid darkgrey; */
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .file {
        display: table-caption;
        background: #3e3e3e;
        color: white;
        padding: .7rem;
        border-radius: .5rem;
        margin: 5px;
    }
</style>

<article class="card">
    <div class="card-title">
        <i class="material-icons">pets</i>
        Stored Usernames
        <hr/>
        <i class="card-info">
            This shows the usernames stored via SFDX :) 
        </i>
    </div>

    <div class="card-body">

        <ul class="users"></ul>
        <br />

    </div>

    <footer>
        <button class="getUsers">Refresh Users</button>
    </footer>
</article>

<article class="card">
    <div class="card-title">
        <i class="material-icons">pets</i>
        Describe Metadata
        <hr/>
        <i class="card-info">
            This shows the metadata from the org of the selected username via SFDX :) 
        </i>
    </div>

    <div class="card-body">

        <div class="editor"></div>
        <br />

    </div>

    <footer>
        <button class="describeMeta">Describe Metadata</button>
    </footer>
</article>`	



class MetamorphrSFDX extends HTMLElement {

    detachedCallback() {
        console.log('instance was removed.')
    }


    attributeChangedCallback(attr, oldVal, newVal) {
    }

    attachedCallback() {
        const template = this.owner.createElement('template')
        template.innerHTML = template
        const clone = document.importNode(template.content, true)
        clone.applyAuthorStyles = true
        this.root = this.createShadowRoot()
        this.root.applyAuthorStyles = true
        this.root.appendChild(clone)
        this.init()
    }

    createdCallback() {
        this.setProperties()
        this.parseAttributes()
    }

    parseAttributes() {
        //this.name = this.getAttribute('name');
    }

    init() {

        this.icons = {}
        
        this.orgs = []

        this.registerElements()
    }

    setProperties() {
        this.is = 'metamorphr-sfdx'
        this.users = [] 
    }

    registerElements() {
        this.dom = {}
        this.dom.getUsers = this.root.querySelector('.getUsers')
        this.dom.users = this.root.querySelector('.users')
        this.dom.describeMeta = this.root.querySelector('.describeMeta')
        this.dom.editor = this.root.querySelector('.editor')
        
        this.setupElements()
    }

    setupElements() {

        //get connected orgs
        this.getUsers()

        this.addListeners()
    }

    addListeners() {
        
        this.dom.getUsers.onclick = (e) => this.getUsers()

        this.dom.describeMeta.onclick = (e) => this.describeMeta()
    }


    getUsers(){
        
        ipc.send('getUsers')
        ipc.once('getUsersRes', (event, res) => {
            console.dir(event)
            console.dir(res)
            this.usernames = res
            console.dir(res)
            
            //const orgs = res.nonScratchOrgs
            //this.orgs = orgs
            //const ordered = orgs.sort((x,y) => x.lastUsed > y.lastUsed ? -1 : 1)

            while(this.dom.users.lastChild){
                this.dom.users.remove(this.dom.users.lastChild)
            }

            this.usernames.map(x => {
                const li = document.createElement('li')
                li.classList.add('selectable')
                li.textContent = x
                //li.textContent = x.instanceUrl
                //li.title = x.username
                li.onclick = () => this.selectUser(li)
                this.dom.users.appendChild(li)
            })
        })
    }


    selectUser(el){

        this.dom.users.childNodes.forEach(x => x.classList.remove('active'))
        el.classList.add('active')

        const u = el.textContent
        this.username = u
    }


    describeMeta(){
        console.log(`describeMeta -- ${this.username}`)
        const username = this.username
        if(!username){
            console.log(this.username)
            console.error('no user')
            return
        }

        const JSONEditor = require('jsoneditor')

        ipc.send('describeMeta', username)
        ipc.once('describeMetaRes', (event, res) => {
            console.log('describeMetaRes in sfdx')
            
            const options = {}
            const editor = new JSONEditor(this.dom.editor, options)


            const data = res.replace(/&quot;/gi, '""').replace(/'/gi, '""').trim()
            const json = JSON.parse(data)
            
            
            editor.set(json)
        })
    }
}

if (document.createElement('metamorphr-sfdx').constructor !== MetamorphrSFDX) {
    MetamorphrSFDX.prototype.owner = (document._currentScript || document.currentScript).ownerDocument;
    document.registerElement('metamorphr-sfdx', MetamorphrSFDX);
}

