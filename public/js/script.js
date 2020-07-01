// const e = require("express");
//require('dotenv').config();
var access_token;
var currentLang = 'Javascript';
var paginatedlang = false; 
var insertNode = false;
//var key = process.env.key;
//var secret =  process.env.secret;

/*function init(lang = "javascript"){
    console.log('asdsadsads', key, secret);
    var timer = setInterval(function(){
        if(access_token){
            getGithubData(null, access_token, 1, lang);
            hideBtn();
            clearInterval(timer);
        }
    }, 1000);
    getUserData();
}*/

function getData(event){
    var lang = document.getElementById("list").value;
    document.getElementById('list').value = "";
    if(currentLang !== lang) paginatedlang = false;
    /*if(access_token === undefined){
        init(lang);
    } else {*/
        if(lang === '') {
            alert('Invalid Language');
        } else {
            getGithubData(event, access_token, 1, lang);
        }
    //}
}


/*function getUserData(){
    let urlCode;
    key = '67f6c11f68ab860e1472';
    secret ='46210d09e9617a2e58f4c5c76432b39248b1ee78';
    let redirect_url = 'http://localhost:8080';
    let url = new URL("https://github.com/login/oauth/authorize?client_id="+key+"&redirect_uri="+redirect_url);
    let win = window.open(url, 'popUpWindow','height=400,width=600,left=10,top=10,scrollbars=yes,menubar=no');
    win.onload = function(){
        urlCode = win.location.href;
        let code = new URL(urlCode).searchParams.get("code");
        fetch(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=${key}&client_secret=${secret}&code=${code}`, {
            method: "POST",
            headers:{"Accept": "application/json"},
            body:""
        }).then(function (resp) {
            return resp.json();
        }).then(function (data) {
            access_token = data.access_token;
            return data.access_token;
        }).catch(function (err) {
            return ('something went wrong', err);
        });
        win.close();
    }
}*/

async function fetchDataAPI(url){
    let response = await fetch(url);
    return await response.json();
}

async function getGithubData(e, oauthToken, page, lang){
    e = e || window.event;
    e && e.preventDefault();
    console.log('e', e)

    //if(oauthToken !== undefined){
        let headers = new Headers();
        headers.append('Access-Control-Allow-Credentials', 'true');
        //headers.append('Authorization', `token ${oauthToken}`)
        let baseURL = `https://api.github.com/search/issues?q=label:good-first-issue+is:issue+is:open+language:${lang}&page=${page}&per_page=30`;
        let data = await fetchDataAPI(baseURL, {
            headers: new Headers({
                'Access-Control-Allow-Credentials': 'true',
                //'Authorization': `token ${oauthToken}`
            })
        });

        console.log(data);
        
        if(data.message){
            location.reload();
        }
        else {
            const fragment = document.createDocumentFragment();

            data.items.map((item, index) => {
                let p = createCard(item);
                fragment.appendChild(p);
            });

            if(page >= 1){
                document.getElementById("result").innerHTML = '';
                document.getElementById("result").appendChild(fragment);
            }else {
                document.getElementById("result").appendChild(fragment);
            }
            if(!paginatedlang) pagination(data.total_count);
       // }
    }
}

async function getRepoData(owner, repo){
    return await fetchDataAPI(`https://api.github.com/repos/${owner}/${repo}`);
}

async function getRepoIssues(owner, repo){
    return await fetchDataAPI(`https://api.github.com/repos/${owner}/${repo}/issues`);
}

function createElement(element){
    return document.createElement(element);
}

function createLabels(labels){
    var str = '';
    labels.map(label => {
        str += (label.name) + ' ';
    });
    return str.trim();
}

function getRepoName(str){
    return str.slice(str.lastIndexOf('/')).replace('/', '');
}

function calculateDateDifference(oldDate){
    const oneDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const prevDate = new Date(oldDate);
    const diffDays = Math.round(Math.abs((currentDate - prevDate) / oneDay));
    return diffDays;
}

function createCard(data){
    let myA = createElement('a');
    let div = createElement('div');
    div.className = "wrapper"
    div.innerHTML = `
            <header class="page-header">
                <div class="circle">
                    <img src=${data.user.avatar_url} width="50px" height="50px"/>
                </div>
                <p>Issue: #${data.number}</p>
            </header>
            <main class="page-body">
                <div class="title">
                    <h4>${data.user.login}</h4>
                    <div class="project">
                        <h3>${getRepoName(data.repository_url)}</h3>
                        <p class="font">Created ${calculateDateDifference(data.updated_at)} Days Ago</p>
                    </div>
                </div>
                <div class="content">
                    <p>${data.title}</p>
                    <div>${data.body === '' ? `${myA.innerHTML = 'Click Here'}` : data.body.substring(0, 100)}...</div>
                </div>
            </main>
            <footer class="page-footer">
                <p>${createLabels(data.labels)}</p>
            </footer>
        `;
    return div;
}

function getPagData (event, page_number){
    getGithubData(event, access_token, page_number, currentLang)
}

function getAllPageNumber(limit){
    var str = '';
    for(var i=1; i<=limit; i++){
        str += `<button class='page_number' onclick='getPagData(event, ${i})' >${i}</button>`;
    }
    return str.trim();
}

function insertAfter(referenceNode, newNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function pagination(total_count){
    var onePage = 30;
    var total_page_number = Math.ceil(total_count / onePage);
    page = total_page_number;
    console.log(total_page_number, total_count);
    paginatedlang = true;
    var paginate = createElement('div');
    paginate.className = 'pagination'
    paginate.id = 'pagination'
    paginate.innerHTML = `
            ${getAllPageNumber(total_page_number)}
    `;
    var referenceNode = document.getElementById('result');
    //referenceNode.parentNode.removeChild('paginate');
    if(!insertNode){
        insertNode = true;
        insertAfter(referenceNode, paginate);
    } else {
        document.getElementById('pagination').replaceWith(paginate);
    }
}

/*function hideBtn() {
    document.getElementById('githubBtn').style.display = "none";
}

function switchBtn() {
    var refresh = document.getElementById('githubBtn');
    if(refresh.style.display === "none"){
        refresh.innerText = "Refresh";
        refresh.style.display = "block";
    }
}*/