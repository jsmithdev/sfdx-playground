/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/web-component/web-component.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

import SFDX from '../scripts/SFDX.mjs'


const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.card {
	padding: 1rem;
    border-radius: 5px;
    max-width: 100%;
    min-height: 20rem;
    background: #EEE;
}
</style>
<div class="card">
    <h3>Shiny new thing!</h3>



    <div class="card-body">

        <ul class="users"></ul>
        <br />

    </div>

    <footer>
        <button class="getUsers">Refresh Users</button>
    </footer>
</div>

<div class="card">
    <h3>Shiny new thing 2</h3>

    <div class="card-body">

        <div class="editor"></div>
        <br />

    </div>

    <footer>
        <button class="nextthing">Next thing</button>
    </footer>
</div>

`


export class WebComponent extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'web-component'
    }

    static get observedAttributes() {
        return ['projects']
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.init()
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        //switch (n) {
        //    case 'attr name that changed!':
        //        ov !== nv // old val not equal new val
        //        break;
        //}
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
        this.dom.getUsers = this.shadowRoot.querySelector('.getUsers')
        this.dom.users = this.shadowRoot.querySelector('.users')
        this.dom.describeMeta = this.shadowRoot.querySelector('.describeMeta')
        this.dom.editor = this.shadowRoot.querySelector('.editor')
        
        this.setupElements()
    }

    setupElements() {

        //get connected orgs
        this.getUsers()

        this.registerListeners()
    }

    registerListeners() {
        
        this.dom.getUsers.onclick = (e) => this.getUsers()

        this.dom.describeMeta.onclick = (e) => this.describeMeta()
    }


    getUsers(){
        

/* 
*  NEW SFDX THINGS :) 
*/
    

        //const describeMeta = username => SFDX.describeMeta(username).then(x => x)

        SFDX.getUsers().then(res => {
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

    /* 
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
    } */
}
customElements.define(WebComponent.is, WebComponent);