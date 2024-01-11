package com.cotproject.smartdb.repositories;
import com.cotproject.smartdb.entities.User;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import java.util.stream.Stream;

@Repository
public interface UserRepository extends CrudRepository <User, String> {
    Stream<User> findAll();
    Stream<User> findByfullnameIn(String s);
}


