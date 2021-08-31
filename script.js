const getData = async () => {
    const res = await fetch('./data.json');
    const data = await res.json();

    return data;
};

const playerList = async () => {
    const dataInJson = await getData();
    const data = await JSON.stringify(dataInJson);
    console.log(data);
};

playerList()