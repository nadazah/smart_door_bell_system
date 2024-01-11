package com.cotproject.smartdb.entities;
import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;
import jakarta.json.bind.annotation.JsonbVisibility;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
@Entity
@JsonbVisibility(FieldPropertyVisibilityStrategy.class)
public class SensorDB implements Serializable{
    // Sensor entity for the geolocation services, it will be stored in the database since the location won't change for each sensor.
    @Id
    private String id;

    @Column
    private String image;

    @Column
    private boolean resultat;

    @Column
    private LocalDateTime date;



    public SensorDB() {
    }


    public SensorDB(String id, String image, boolean resultat, LocalDateTime date) {
        this.id = id;
        this.image = image;
        this.resultat = resultat;
        this.date = date;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setResultat(boolean resultat) {
        this.resultat = resultat;
    }

    public boolean isResultat() {
        return resultat;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getImage() {
        return image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SensorDB)) {
            return false;
        }
        SensorDB sensor = (SensorDB) o;
        return Objects.equals(id, sensor.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Sensor{" +
                "id='" + id + '\'' +
                ", image='" + image + '\'' +
                ", resultat='" + resultat + '\'' +
                ", date='" + date + '\'' +

                '}';
    }
}

