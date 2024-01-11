package com.cotproject.smartdb.boundaries;

import com.cotproject.smartdb.entities.SensorDB;
import com.cotproject.smartdb.repositories.SensorDBRepository;
import jakarta.ejb.EJB;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import com.cotproject.smartdb.controllers.MqttMessageEventManager;

@ServerEndpoint(value = "/pushes", encoders = {SensorJSONEncoder.class}, decoders = {SensorJSONDecoder.class}) //Annotates path for websocket and with the json encoders and decoders
public class PublishWebsocketEndpoint {
    @Inject
    private MqttMessageEventManager mqttlistener;



    private static Hashtable<String, Session> sessions = new Hashtable<>(); // initialize sessions as empty Hashtable
    public static void broadcastMessage(SensorDB sensor) {
        for (Session session : sessions.values()) {
            try {
                session.getBasicRemote().sendObject(sensor); // broadcast the message to websocket
                System.out.println("work: "); // for debugging
            } catch (IOException | EncodeException e) {
                e.printStackTrace();
            }
        }
    }
    @OnOpen
    public void onOpen(Session session){
        mqttlistener.start();
        sessions.put(session.getId(), session); //add the new session
    }
    @OnClose
    public void onClose(Session session, CloseReason reason){
        sessions.remove(session); // delete sessions when client leave
    }
    @OnError
    public void onError(Session session, Throwable error){
        System.out.println("Push WebSocket error for ID " + session.getId() + ": " + error.getMessage());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // Handle the incoming message
        if ("open".equals(message)) {
            // Perform actions when the message is "open"
            System.out.println("Received 'open' message from WebSocket client.");

            // Add logic to send the 'open' message to the backend Jakarta EE
            // ...

            // Example: Send a message to the MQTT broker
            mqttlistener.publishToServoMotorTopic();
        } else {
            // Handle other types of messages if needed
            System.out.println("Received unknown message from WebSocket client: " + message);
        }
    }

}