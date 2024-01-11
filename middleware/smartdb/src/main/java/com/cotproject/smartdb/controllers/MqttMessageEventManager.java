package com.cotproject.smartdb.controllers;

import com.cotproject.smartdb.boundaries.PublishWebsocketEndpoint;
import com.cotproject.smartdb.entities.SensorDB;
import com.cotproject.smartdb.repositories.SensorDBRepository;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import org.eclipse.jnosql.mapping.Database;
import org.eclipse.jnosql.mapping.DatabaseType;
import org.eclipse.paho.mqttv5.client.*;
import org.eclipse.paho.mqttv5.client.MqttConnectionOptions;
import org.eclipse.paho.mqttv5.client.persist.MemoryPersistence;
import org.eclipse.paho.mqttv5.common.MqttException;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.eclipse.paho.mqttv5.common.MqttSubscription;
import org.eclipse.paho.mqttv5.common.packet.MqttProperties;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.eclipse.microprofile.config.Config;
import org.eclipse.microprofile.config.ConfigProvider;

@Startup
@Singleton
public class MqttMessageEventManager {
    @Inject
    @Database(DatabaseType.DOCUMENT)
    private SensorDBRepository repository;

    public static int qos = 1;
    public static String topic = "test";
    public static MemoryPersistence persistence = new MemoryPersistence();
    public static MqttClient client;
    private final Config config = ConfigProvider.getConfig();
    private final String mqttUsername = config.getValue("mqtt.broker.username", String.class);
    private final String mqttPassword = config.getValue("mqtt.broker.password", String.class);
    private final String broker = config.getValue("mqtt.broker.broker", String.class);
    private final String clientId = config.getValue("mqtt.broker.clientId", String.class);

    LocalDateTime specificDateTime = LocalDateTime.of(2023, 1, 1, 12, 30, 0);

    private SensorDB sensor = new SensorDB("defaultId", "defaultImage", false, specificDateTime);

    @PostConstruct
    public void start() {
        System.out.println("Connecting to the MQTT broker...: ");
        connect();
        listen(topic);
    }

    public void connect() {
        try {
            System.out.println("Connecting to MQTT broker: " + broker);
            MqttConnectionOptions connOpts = new MqttConnectionOptions();
            connOpts.setUserName(mqttUsername);
            connOpts.setPassword(mqttPassword.getBytes(StandardCharsets.UTF_8));
            connOpts.setCleanStart(false);

            client = new MqttClient(broker, clientId, persistence);
            client.connect(connOpts);

            client.setCallback(new MqttCallback() {
                @Override
                public void disconnected(MqttDisconnectResponse mqttDisconnectResponse) {}

                @Override
                public void mqttErrorOccurred(MqttException e) {}

                @Override
                public void messageArrived(String topic, MqttMessage mqttMessage) {
                    handleIncomingMessage(topic, mqttMessage);
                }

                @Override
                public void deliveryComplete(IMqttToken iMqttToken) {}

                @Override
                public void connectComplete(boolean b, String s) {}

                @Override
                public void authPacketArrived(int i, MqttProperties mqttProperties) {}
            });

            System.out.println("Connected");
        } catch (MqttException me) {
            handleMqttException(me);
        }
    }

    public void disconnect() {
        try {
            client.disconnect();
            System.out.println("Disconnected");
        } catch (MqttException e) {
            handleMqttException(e);
        }
    }

    public void listen(String topic) {
        try {
            System.out.println("Subscribing to topic " + topic);
            MqttSubscription sub = new MqttSubscription(topic, qos);
            IMqttToken token = client.subscribe(new MqttSubscription[]{sub});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void publishToServoMotorTopic() {
        try {
            String message = "open";
            client.publish("servomotor", new MqttMessage(message.getBytes()));
        } catch (MqttException e) {
            handleMqttException(e);
        }
    }

    private void handleIncomingMessage(String topic, MqttMessage mqttMessage) {
        JSONObject object = new JSONObject(new String(mqttMessage.getPayload()));
        String messageTxt = object.getString("id");
        String image = object.getString("image");
        boolean resultat = object.getBoolean("resultat");
        LocalDateTime date = LocalDateTime.now();
        SensorDB sensor = new SensorDB(messageTxt, image, resultat, date);
        System.out.println("Message on " + topic + ": '" + messageTxt + "'");
        System.out.println(sensor);
        repository.save(sensor);
        if (resultat) {
            publishToServoMotorTopic();
        } else {
            PublishWebsocketEndpoint.broadcastMessage(sensor);
        }
        MqttProperties props = mqttMessage.getProperties();
        String responseTopic = props.getResponseTopic();
    }

    private void handleMqttException(MqttException me) {
        System.out.println("reason " + me.getReasonCode());
        System.out.println("msg " + me.getMessage());
        System.out.println("loc " + me.getLocalizedMessage());
        System.out.println("cause " + me.getCause());
        System.out.println("excep " + me);
        me.printStackTrace();
    }
}
