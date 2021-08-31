const getData = async () => {
    const res = await fetch('./data.json');
    const data = await res.json();

    return data;
};

const playerList = async () => {
    const dataInJson = await getData();
    const temp = document.querySelector("template");
    const selectNode = temp.content.querySelector('#player-select');
    const imageSector = document.querySelector('#player-img');

    dataInJson.players.forEach(card => {
        const playerID = `${card.player.id}`;
        const fullName = `${card.player.name.first} ${card.player.name.last}`;
        const optionNode = `<option value="${playerID}">${fullName}</option>`;

        selectNode.insertAdjacentHTML('beforeend', optionNode);
    });

    document.querySelector("header").appendChild(selectNode);

    const addImage = (id) => {
        const image = `<img src="./assets/p${id}.png" alt="image of" width="500" height="600">`
        imageSector.innerHTML = image;
    }

    const selectPlayer = () => {
        selectNode.addEventListener("change", function(e) {
            addImage(selectNode.value);
        });
    }
    
    selectPlayer();
};

playerList(); 
