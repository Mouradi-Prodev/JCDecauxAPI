// Creation de la connexion websocket au serveur locale(Ca depend de l'adresse du serveur websocket
// lancé auparavant)
const port = parseInt(8765)
const server = "ws://localhost:" + String(port) + "/"
const socket = new WebSocket(server);

socket.onerror = function (event) {
    alert("Erreur de connexion au serveur " + server + "\nlancer le serveur et actualiser la page!")

}
socket.onopen = function (event) {
    alert("Connected to server " + server);
};

let previousMapCenter = [51.505, -0.09];// Default initial map center

// Function to set the previous map center
function setPreviousMapCenter() {
    previousMapCenter = map.getCenter();
}

// Function to reset the map view to the previous center
function resetMapView() {
    map.setView(previousMapCenter);
}

// Initialisation de la map
const map = L.map('map').setView([51.505, -0.09], 13); // vue map initiale [lat,long]

// Ajout de OpenStreetMap tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Initialisation  d'un groupe vides pour les marqueurs des stations
const stationMarkers = L.featureGroup().addTo(map);


// Traitons le message recu en temps  reel du serveur websocket lancé  dans python
socket.onmessage = function (event) {
    const dataFromServer = JSON.parse(event.data); // Analyser les données JSON du serveur
    console.log(dataFromServer); // Console.log des données reçues à des fins de débogage



    // Save the previous map center
    setPreviousMapCenter();


    // Effacer les marqueurs précédents pour la mise a jour des données
    stationMarkers.clearLayers();

    // Ajout des marques pour chaque station
    dataFromServer.forEach(station => {
        const lat = station.position.latitude;
        const lon = station.position.longitude;
        const name = station.name;
        const bikesAvailable = station.totalStands.availabilities.bikes;

        // Creation de la marque pour chaque station avec une popup affichant le nom et les velos disponibles
        // On peut ajouter d'autres données si besoin (par exemple le nombre de places totales)
        // On peut ajouter aussi les places vides ...
        const marker = L.marker([lat, lon]).bindPopup(`<b>${name}</b><br>Bikes available: ${bikesAvailable}`);

        stationMarkers.addLayer(marker);
    });


    // Réglons les limites de la map aux stations
    map.fitBounds(stationMarkers.getBounds());

    // Reset the map view to the previous center
    resetMapView();
};
