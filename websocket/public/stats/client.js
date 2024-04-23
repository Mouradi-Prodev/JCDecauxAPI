// Creation de la connexion websocket au serveur locale(Ca depend de l'adresse du serveur websocket
// lancé auparavant)
const port = 8765
const server = "ws://localhost:" + String(port) + "/"
const socket = new WebSocket(server);

socket.onerror = function (event) {
    alert("Erreur de connexion au serveur " + server + "\nlancer le serveur et actualiser la page!")

}
socket.onopen = function (event) {
    console.log("Connected to server!" + server);
};


const PrepareData = (Data) => {
    let cityStats = {}; // Initialisation d'un objet vide pour le stockage des  statistiques par ville

    // Iteration over Data
    Data.forEach(station => {
        const city = station.contractName;
        const mechanicalBikes = station.totalStands.availabilities.mechanicalBikes;
        const electricalBikes = station.totalStands.availabilities.electricalBikes;
        const totalBikes = mechanicalBikes + electricalBikes;

        // Si la ville n'est pas dans cityStats on initialise ses données, sinon on ajoute les données à celles déjà existantes
        if (!cityStats[city]) {
            cityStats[city] = {
                mechanical: 0,
                electrical: 0,
                totalBikes: 0
            };
        }

        // Mise a jour des statistiques
        cityStats[city].mechanical += mechanicalBikes;
        cityStats[city].electrical += electricalBikes;
        cityStats[city].totalBikes += totalBikes;
    });

    return cityStats;

}

const DisplayCityStats = (cityStats) => {

     // Conversion de cityStats object vers un tableau de paire key-value
    let cityArray = Object.entries(cityStats);

     // Trier le cityArray en fonction du nombre total de vélos par ordre décroissant
    cityArray.sort((a, b) => b[1].totalBikes - a[1].totalBikes);
    // console.log(cityArray) Debogage

    for (let [city, stats] of cityArray) {
        let row = $("<tr>");
        let totalBikes = stats.totalBikes;
        let electricalPercentage = (stats.electrical / totalBikes) * 100;
        let mechanicalPercentage = (stats.mechanical / totalBikes) * 100;

        row.append($("<td>").text(city));
        row.append($("<td>").text(electricalPercentage.toFixed(2) + '%'));
        row.append($("<td>").text(mechanicalPercentage.toFixed(2) + '%'));
        row.append($("<td>").text(totalBikes));

        $(".data").append(row);

    }
}


// Traitons le message recu en temps  reel du serveur websocket lancé  dans python
socket.onmessage = function (event) {
    const dataFromServer = JSON.parse(event.data); // Analyser les données JSON du serveur
    // console.log(dataFromServer); // Console.log des données reçues à des fins de débogage
    let cityStats = PrepareData(dataFromServer)
    DisplayCityStats(cityStats);

};
