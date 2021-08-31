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
        const playerStats = infoSector.querySelector('#player-stats');

        const appearances = playerStats.querySelector('#appearances');
        const goals = playerStats.querySelector('#goals');
        const assists = playerStats.querySelector('#goal_assist');
        const goalsPerMatch = playerStats.querySelector('#goals_per_match');
        const passesPerMinute = playerStats.querySelector('#passes_per_minute');

        dataInJson.players.forEach(card => {
            if (card.player.id == id) {
                const fullName = `${card.player.name.first} ${card.player.name.last}`;
                const image = `<img src="./assets/p${card.player.id}.png" alt="image of ${fullName}" width="500" height="600">`
                const position = `${card.player.info.positionInfo}`

                let statistic;

                const totalMatches = card.stats
                    .filter(element => {
                        return (
                            element.name == "wins" ||
                            element.name == "losses" ||
                            element.name == "draws"
                        )
                    }).reduce((a, b) => ({value: a.value + b.value}));
                
                card.stats.forEach(stat => {
                        if (stat.name == 'appearances') {
                            statistic = `<span class="name">Appearances</span> <span class="value">${stat.value}</span>`;

                            appearances.innerHTML = statistic;
                        } 
                        
                        if (stat.name == 'goals') {
                            statistic = `<span class="name">Goals</span> <span class="value">${stat.value}</span>`;

                            goals.innerHTML = statistic;
                        }

                        if (stat.name == 'goal_assist') {
                            statistic = `<span class="name">Assists</span> <span class="value">${stat.value}</span>`;

                            assists.innerHTML = statistic;
                        }

                        if (stat.name == 'goals' && totalMatches) {
                            let gpm = Math.ceil(stat.value / totalMatches.value * 100) / 100;
                            
                            statistic = `<span class="name">Goals per match</span> <span class="value">${gpm}</span>`;

                            goalsPerMatch.innerHTML = statistic;
                        }
                })

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
