package com.cotproject.smartdb.boundaries;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.websocket.EncodeException;
import jakarta.websocket.Encoder;
import com.cotproject.smartdb.entities.SensorDB;

import java.time.format.DateTimeFormatter;

public class SensorJSONEncoder implements Encoder.Text<SensorDB> {
    @Override
    public String encode(SensorDB sensor) throws EncodeException {

        String formattedDate = sensor.getDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("id", sensor.getId())
                .add("image", sensor.getImage())
                .add("resultat", sensor.isResultat())
                .add("date", formattedDate)
                .build();
        return jsonObject.toString();

    }


}
