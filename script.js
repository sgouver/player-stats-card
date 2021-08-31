const getData = async () => {
    const res = await fetch('./data.json');
    const data = await res.json();

    console.log(data)
    return data;
};

const playerList = async () => {
    const dataInJson = await getData();
    const temp = document.querySelector("template");
    const selectNode = temp.content.querySelector('#player-select');
    const imageSector = document.querySelector('#player-img');
    const infoSector = document.querySelector('#player-info');

    dataInJson.players.forEach(card => {
        const playerID = `${card.player.id}`;
        const fullName = `${card.player.name.first} ${card.player.name.last}`;
        const optionNode = `<option value="${playerID}">${fullName}</option>`;

        selectNode.insertAdjacentHTML('beforeend', optionNode);
    });

    document.querySelector("header").appendChild(selectNode);

    const addData = (id) => {
        const playerName = infoSector.querySelector('#player-info-name');
        const playerInfo = infoSector.querySelector('#player-info-position');

        dataInJson.players.forEach(card => {
            if (card.player.id == id) {
                const fullName = `${card.player.name.first} ${card.player.name.last}`;
                const image = `<img src="./assets/p${card.player.id}.png" alt="image of ${fullName}" width="500" height="600">`
                const position = `${card.player.info.positionInfo}`
                

                imageSector.innerHTML = image;
                playerName.innerHTML = fullName;
                playerInfo.innerHTML = position;
            }
        })

    }

    const selectPlayer = () => {
        selectNode.addEventListener("change", function(e) {
            addData(selectNode.value);
        });
    }
    
    selectPlayer();
};

playerList(); 
