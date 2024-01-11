package com.cotproject.smartdb.entities;
import com.cotproject.smartdb.util.Identity;
import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;
import jakarta.json.bind.annotation.JsonbVisibility;
import java.io.Serializable;
import java.util.Objects;


@Entity
@JsonbVisibility(FieldPropertyVisibilityStrategy.class)
public class User implements Serializable, Identity { // User entity for database
    @Id
    @Column
    private String mail; //email address
    @Column
    private String fullname;
    @Column
    private String password;



    public User() {
    }

    public User(String mail, String fullname, String password) {
        this.mail=mail;
        this.fullname=fullname;
        this.password = password;
    }



    public String getmail() {
        return mail;
    }
    public String getfullname() {
        return fullname;
    }
    public String getpassword() {
        return password;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(mail, user.mail);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(mail);
    }


    public String getName() {
         return getmail();
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + mail + '\'' +
                ", fullname=" + fullname+

                '}';
    }

}
