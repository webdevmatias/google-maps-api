import React, { useState, useRef } from "react";
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

export interface MapPageProps {}

export const MapPage: React.FC<MapPageProps> = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Usando a variável de ambiente
    });

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null); // Referência para a instância do mapa

    // Pontos de origem e destino
    const origin = { lat: -7.789343, lng: -35.091078 }; // Origem
    const destination = { lat: -7.794137, lng: -35.082624 }; // Destino

    if (!isLoaded) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="w-full h-screen">
            <GoogleMap
                mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                }}
                center={origin}
                zoom={15}
                onLoad={(mapInstance) => {
                    mapRef.current = mapInstance; // Salva a instância do mapa
                }}
            >
                {/* Serviço para calcular a rota */}
                <DirectionsService
                    options={{
                        origin: origin,
                        destination: destination,
                        travelMode: google.maps.TravelMode.WALKING, // TRILHA -> Modo Caminhada
                    }}
                    callback={(result, status) => {
                        if (status === google.maps.DirectionsStatus.OK && result) {
                            setDirections(result);
                        } else {
                            setError("Não foi possível calcular a trilha.");
                        }
                    }}
                />

                {/* Renderizador da rota */}
                {directions && (
                    <DirectionsRenderer
                        options={{
                            directions: directions,
                            preserveViewport: true, // Evita que o mapa mude o enquadramento automaticamente
                        }}
                    />
                )}
            </GoogleMap>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};
