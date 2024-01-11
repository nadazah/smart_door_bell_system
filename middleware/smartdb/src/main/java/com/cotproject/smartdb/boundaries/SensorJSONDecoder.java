package com.cotproject.smartdb.boundaries;

import jakarta.websocket.DecodeException;
import jakarta.websocket.Decoder;
import jakarta.websocket.EndpointConfig;

public class SensorJSONDecoder implements Decoder.Text<String> {

    @Override
    public String decode(String jsonMessage) throws DecodeException {
        return jsonMessage;
    }

    @Override
    public boolean willDecode(String jsonMessage) {
        try {
            // Vous pouvez effectuer une validation supplémentaire si nécessaire
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void init(EndpointConfig config) {
        // Méthode init
    }

    @Override
    public void destroy() {
        // Méthode destroy
    }
}
