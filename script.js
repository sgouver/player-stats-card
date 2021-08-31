const getData = async () => {
    const res = await fetch('./data.json');
    const data = await res.json();

    return data;
};

const playerList = async () => {
    const dataInJson = await getData();
    const temp = document.querySelector("template");
    const selectNode = temp.content.querySelector('#player-select');

    dataInJson.players.forEach(card => {
        const playerID = `${card.player.id}`;
        const fullName = `${card.player.name.first} ${card.player.name.last}`;
        const optionNode = `<option value="${playerID}">${fullName}</option>`;

        selectNode.insertAdjacentHTML('beforeend', optionNode);
    });

    document.querySelector("header").appendChild(selectNode);

    const selectPlayer = () => {
        selectNode.addEventListener("change", function() {
            console.log(selectNode.value);
        });
    }
    
    selectPlayer();
};

playerList(); 
