async function getData(){
    let baseURL = "https://api.github.com/search/issues?q=label:good-first-issue+is:issue+is:open+language:javascript";
    let response = await fetch(baseURL);
    let data = await response.json();
    console.log(data);
    const fragment = document.createDocumentFragment();
    data.items.forEach(element => {
        var tag = createElement('div');
        var text = createTextNode(JSON.stringify(element.url))
        var space = createElement("br");
        tag.appendChild(text);
        fragment.appendChild(tag).appendChild(space);
    });
    document.getElementById("result").appendChild(fragment);
}

async function getRepoData(owner, repo){
    let baseURL = `https://api.github.com/repos/${owner}/${repo}`;   
}

async function getRepoIssues(owner, repo){
    let baseURL = `https://api.github.com/repos/${owner}/${repo}/issues`; 
}

function createElement(element){
    return document.createElement(element);
}

function createTextNode(text) {
    return document.createTextNode(text);
}