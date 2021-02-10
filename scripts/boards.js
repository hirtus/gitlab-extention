function getCardTitleInfo(title) {
    const maxWeight = 100;
    let regex = /(?<title>.*)\[ *(?<weight>[0-9].*) *\](?<tail>.*)/;
    let match = title.match(regex);
    if (match){
        let weight = parseInt(match.groups.weight);
        return {title: match.groups.title, weight: weight > 100 ? 100 : weight, tail: match.groups.tail};
    }
        
    else
        return {title: title, weight: 0, tail: ''};
}

var observer = new MutationObserver(function (mutations, me) {
  let boards = document.getElementsByClassName('board');
  if (boards.length > 0) {
    subscribeOnChange(boards);
    me.disconnect();
    return;
  }
});

function subscribeOnChange(boards) {
        [...boards].forEach(element => {        
        element.addEventListener('DOMSubtreeModified', (event) => {
            if (element.getElementsByClassName('board-list')[0] == event.srcElement)         
                markWeight(element);
        }, false)
    })    
}

function createWeightIcon() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("gl-mr-2");
    svg.classList.add("gl-icon");
    svg.classList.add("s16");
    svg.classList.add("text-secondary");
    let svgNS = svg.namespaceURI;
    let path = document.createElementNS(svgNS,'path');
    path.setAttribute('d','M10.236 6a3 3 0 1 0-4.472 0H3l-1.736 6.483A2 2 0 0 0 3.196 15h9.605a2 2 0 0 0 1.932-2.517L13 6h-2.764zM9 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-5.804 9l1.339-5h6.93l1.336 5H3.196z');
    svg.appendChild(path);
    return svg;
}

function createWeightText(weight, className) {
    let node = document.createElement("span");
    node.className = 'text-secondary ' + className;
    let textnode = document.createTextNode(weight);
    node.appendChild(textnode); 
    return node;
}

function markWeight(board) {
    let cards = board.getElementsByClassName('board-card');
    let commonWeight = 0;
    [...cards].forEach(card => {
        weightElements = card.getElementsByClassName('_board-card-weight');
        if (weightElements.length == 0) {
            let cardTitleElement = card.getElementsByClassName('board-card-title')[0];
            let cardTitleInfo = getCardTitleInfo(cardTitleElement.textContent);
            cardTitleElement.getElementsByTagName('a')[0].textContent = cardTitleInfo.title + cardTitleInfo.tail;
            commonWeight += cardTitleInfo.weight;
            let numberContainer = card.getElementsByClassName('board-card-number-container')[0];
            numberContainer.appendChild(createWeightIcon());
            numberContainer.appendChild(createWeightText(cardTitleInfo.weight,"_board-card-weight"));           
        }
        else {
            cardWeight = weightElements[0];
            commonWeight += parseInt(cardWeight.textContent);
        }

    });
    weightElements = board.getElementsByClassName('_issue-weight-badge')
    if (weightElements.length == 0) {
        let theFirstChild = board.getElementsByClassName('issue-count-badge')[0];
        let boardTitleElement = board.getElementsByClassName('board-title')[0];
        boardTitleElement.insertBefore(createWeightIcon(), theFirstChild)
        boardTitleElement.insertBefore(createWeightText(commonWeight, "_issue-weight-badge"), theFirstChild);
    } 
    else {
        let  weightBadge = weightElements[0];
        weightBadge.textContent = commonWeight;
    }
}

observer.observe(document, {
    childList: true,
    subtree: true
});