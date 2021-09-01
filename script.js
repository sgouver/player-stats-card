///Fetch DATA from the local json file 
const getData = async () => {
    const res = await fetch('./data.json');
    const data = await res.json();

    console.log(data)
    return data;
};

// Load PlayerList
const playerList = async () => {
    // Call the API to get the cards DATA
    const dataInJson = await getData();

    //Select elements from DOM
    const temp = document.querySelector("template");
    const imageSector = document.querySelector('#player-img');
    const infoSector = document.querySelector('#player-info');
    const teamFlag = document.querySelector('#player-team-flag');

    //Trigger the Template tag
    const selectNode = temp.content.querySelector('#player-select');

    //Populate the Dropdown selection menu with options
    dataInJson.players.forEach(card => {
        const playerID = `${card.player.id}`;
        const fullName = `${card.player.name.first} ${card.player.name.last}`;
        const optionNode = `<option value="${playerID}">${fullName}</option>`;

        selectNode.insertAdjacentHTML('beforeend', optionNode);
    });

    //Append the options to the header TAG
    document.querySelector("header").appendChild(selectNode);

    //Data function based on selected player
    const addData = (id) => {

        //Select elements from DOM
        const playerName = infoSector.querySelector('#player-info-name');
        const playerInfo = infoSector.querySelector('#player-info-position');
        const playerStats = infoSector.querySelector('#player-stats');
        const appearances = playerStats.querySelector('#appearances');
        const goals = playerStats.querySelector('#goals');
        const assists = playerStats.querySelector('#goal_assist');
        const goalsPerMatch = playerStats.querySelector('#goals_per_match');
        const passesPerMinute = playerStats.querySelector('#passes_per_minute');

        //Loop on the fetched players array
        dataInJson.players.forEach(card => {

            //If selected ID is matching an player ID from the array
            if (card.player.id == id) {

                //Create player's fullname
                const playerFullName = `${card.player.name.first} ${card.player.name.last}`;
                
                //Create player's image
                const playerImage = `<img src="./assets/p${card.player.id}.png" alt="image of ${playerFullName}" width="200">`;
                
                //Define player's position based on the position letter
                let playerPosition;

                if(card.player.info.position === "D") {
                    playerPosition = "Defender"
                }

                if(card.player.info.position === "F") {
                    playerPosition = "Forward"
                }
                
                if(card.player.info.position === "M") {
                    playerPosition = "Midfielder"
                }

                if(card.player.info.position === "G") {
                    playerPosition = "Goalkeeper"
                }
                
                //Add player's current team flag
                teamFlag.setAttribute("class", `flag-${card.player.currentTeam.id}`);


                //Define player's statistics
                let playerStatistic;

                const totalPasses = card.stats
                    .filter(element => {
                        return (
                            element.name == "fwd_pass" ||
                            element.name == "backward_pass"
                        )
                    }).reduce((a, b) => ({value: a.value + b.value}));
                
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
                            playerStatistic = `<span class="name">Appearances</span> <span class="value">${stat.value}</span>`;

                            appearances.innerHTML = playerStatistic;
                        } 
                        
                        if (stat.name == 'goals') {
                            playerStatistic = `<span class="name">Goals</span> <span class="value">${stat.value}</span>`;

                            goals.innerHTML = playerStatistic;
                        }

                        if (stat.name == 'goal_assist') {
                            playerStatistic = `<span class="name">Assists</span> <span class="value">${stat.value}</span>`;

                            assists.innerHTML = playerStatistic;
                        }

                        if (stat.name == 'goals' && totalMatches) {
                            let gpm = Math.ceil(stat.value / totalMatches.value * 100) / 100;
                            
                            playerStatistic = `<span class="name">Goals per match</span> <span class="value">${gpm}</span>`;

                            goalsPerMatch.innerHTML = playerStatistic;
                        }

                        if (stat.name == 'mins_played' && totalPasses) {
                            let pmp = Math.round(totalPasses.value / stat.value * 100) / 100;

                            playerStatistic = `<span class="name">Passes per minute</span> <span class="value">${pmp}</span>`;

                            passesPerMinute.innerHTML = playerStatistic;
                        }
                })

                imageSector.innerHTML = playerImage;
                playerName.innerHTML = playerFullName;
                playerInfo.innerHTML = playerPosition;
            }
        })

    }

    const selectPlayer = () => {
        addData(dataInJson.players[0].player.id);

        selectNode.addEventListener("change", function(e) {
            addData(selectNode.value);
        });
    }
    
    selectPlayer();
};

playerList(); 
