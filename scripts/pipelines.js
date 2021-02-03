const credentials = {
    token: '',
    url: ''
  }
  
  chrome.storage.sync.get({
    url: '',
    token: ''
  }, function(items) {
    credentials.url = items.url + '/api/v4';
    credentials.token = items.token;
  });

function getProjectId() {
return document.body.getAttribute('data-project-id')
}

function deleteFailed(count) {
    let projectId = getProjectId();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', credentials.url + '/projects/'+ projectId + '/pipelines?per_page='+ count + '&sort=asc&status=failed', true);
    console.log("Deleting failed " + count);
    xhr.onload = function () {
        let pipelines = JSON.parse(this.responseText);
        console.log(this.responseText);
        [...pipelines].forEach(pipline => {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', credentials.url + '/projects/'+ projectId + '/pipelines/' + pipline.id, true);
            xhr.setRequestHeader('PRIVATE-TOKEN', credentials.token);
            xhr.onload = function () {
                console.log("Pipeline " + pipline.id + ' was deleted.')
                if (this.response)
                    console.log(this.response);
            }
            xhr.send();
        });
    };

    xhr.send();
}

function deleteAllExceptLast(count) {
    let projectId = getProjectId();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', credentials.url + '/projects/'+ projectId + '/pipelines?per_page=1000&sort=desc', true);
    console.log("Deleting first " + count);
    xhr.onload = function () {
        let pipelines = JSON.parse(this.responseText);
        console.log(this.responseText);
        [...pipelines].slice(count).forEach(pipline => {
            let xhr = new XMLHttpRequest();
            console.log('Sending request for delete pipeline' + pipline.id);
            xhr.open('DELETE', credentials.url + '/projects/'+ projectId + '/pipelines/' + pipline.id, true);
            xhr.setRequestHeader('PRIVATE-TOKEN', credentials.token);
            xhr.onload = function () {
                console.log("Pipeline " + pipline.id + ' ' + pipline.status + ' was deleted.')
                if (this.response)
                    console.log(this.response);
            }
            xhr.send();
        });
    };

    xhr.send();
}


var observer = new MutationObserver(function (mutations, me) {
  let nav_controls = document.getElementsByClassName('nav-controls');
  if (nav_controls.length > 0) {
    createButtons(nav_controls[0]);
    me.disconnect();
    return;
  }
});

function createButton(caption, onclickHandler) {
    let node = document.createElement("button");
    node.className = 'btn';
    let textnode = document.createTextNode(caption);
    node.appendChild(textnode); 
    node.addEventListener('click', onclickHandler);
    return node;
}

function createButtons(nav_control) {
    let deleteFailedButton = createButton('Delete failed', () => deleteFailed(100));
    let deleteFirstButton = createButton('Delete all', () => deleteAllExceptLast(10));
    nav_control.appendChild(deleteFailedButton);
    nav_control.appendChild(deleteFirstButton);
}

observer.observe(document, {
    childList: true,
    subtree: true
});