import asyncio
import websockets
import requests
import json

# Definition du logique du serveur websocket
async def server(websocket, path):
    # Simulation d'envoie des messages aux clients connectés
    while True:
        try:
            API_KEY = 'e0a1bf2c844edb9084efc764c089dd748676cc14'
            API_URL_STATIONS = 'https://api.jcdecaux.com/vls/v3/stations'

            params = {'apiKey': API_KEY}

            response = requests.get(API_URL_STATIONS, params=params)
            if response.status_code == 200:
                stations = response.json()
                # Envoi des données JSON par connexion WebSocket
                await websocket.send(json.dumps(stations))
            else:
                await websocket.send("Erreur de recherche de données du serveur")

            await asyncio.sleep(60)  # Envoyons les données toutes les 60 secondes
        except websockets.exceptions.ConnectionClosedError:
            # Traitons le cas  où un client se déconnecterait
            print('Client déconnecté')
            break

# Lancement du WebSocket server au port 8765 localement
start_server = websockets.serve(server, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
