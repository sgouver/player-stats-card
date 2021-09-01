//Select elements from DOM
const temp = document.querySelector("template");
const imageSector = document.querySelector('#player-img');
const infoSector = document.querySelector('#player-info');
const teamFlag = document.querySelector('#player-team-flag');
const playerName = infoSector.querySelector('#player-info-name');
const playerInfo = infoSector.querySelector('#player-info-position');
const playerStats = infoSector.querySelector('#player-stats');
const appearances = playerStats.querySelector('#appearances');
const goals = playerStats.querySelector('#goals');
const assists = playerStats.querySelector('#goal_assist');
const goalsPerMatch = playerStats.querySelector('#goals_per_match');
const passesPerMinute = playerStats.querySelector('#passes_per_minute');

//Trigger the Template tag
const selectNode = temp.content.querySelector('#player-select');

//Fetch DATA from the local json file 
const getData = async () => {
    await fetch('./data.json')
    .then(res => res.json())
    .then(data => {
        //Populate the Dropdown selection menu with options
        data.players.forEach(card => {
            const playerID = `${card.player.id}`;
            const fullName = `${card.player.name.first} ${card.player.name.last}`;
            const optionNode = `<option value="${playerID}">${fullName}</option>`;

            selectNode.insertAdjacentHTML('beforeend', optionNode);
        });

        //Append the options to the header TAG
        document.querySelector("header").appendChild(selectNode);

        //Data function based on selected player
        const addData = (id) => {
            //Loop on the fetched players array
            data.players.forEach(card => {

                //If selected ID is matching an player ID from the array
                if (card.player.id == id) {

                    //Create player's fullname
                    const playerFullName = `${card.player.name.first} ${card.player.name.last}`;
                    
                    //Create player's image
                    const playerImage = `<img src="./assets/p${card.player.id}.png" alt="image of ${playerFullName}">`;
                    
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

                    //Filter and calculate the total passes of the player
                    const totalPasses = card.stats
                        .filter(element => {
                            return (
                                element.name == "fwd_pass" ||
                                element.name == "backward_pass"
                            )
                        }).reduce((a, b) => ({value: a.value + b.value}));
                    
                    //Filter and calculate the total matches of the player
                    const totalMatches = card.stats
                        .filter(element => {
                            return (
                                element.name == "wins" ||
                                element.name == "losses" ||
                                element.name == "draws"
                            )
                        }).reduce((a, b) => ({value: a.value + b.value}));

                    //Loop on each available stat
                    card.stats.forEach(stat => {

                            //Construct stats based on stat.name, stat.value, totalPasses and totalMatches

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

                    //Apend image, full name and position to DOM
                    imageSector.innerHTML = playerImage;
                    playerName.innerHTML = playerFullName;
                    playerInfo.innerHTML = playerPosition;
                }
            })
        }

        //Initiate the first player on the list on page load without a selection as per the provided mockups
        addData(data.players[0].player.id);

        //Listen to Dropdown menu changes and if a user selects a different player then triger the player card based onplayer ID
        selectNode.addEventListener("change", function(e) {
            addData(selectNode.value);
        });
    })
    .catch(error => {
        //Error handler in case the API call fails
        console.error('Error:', error);
    })
};

getData();