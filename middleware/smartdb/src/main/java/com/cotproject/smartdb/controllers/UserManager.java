package com.cotproject.smartdb.controllers;

import jakarta.ejb.EJBException;
import jakarta.ejb.LocalBean;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import com.cotproject.smartdb.entities.User;
import com.cotproject.smartdb.repositories.UserRepository;
import com.cotproject.smartdb.util.Argon2Utility;

@Stateless
@LocalBean
public class UserManager {
    @Inject
    private UserRepository userRepository; // repository to interact with the user database

    public User findByUsername(String mail) {
        return userRepository.findById(mail).orElse(null);
    }

    public User authenticate(final String mail, final String password) throws EJBException {
        final User user = userRepository.findById(mail).orElse(null);
        if (user != null && Argon2Utility.check(user.getpassword(), password.toCharArray())) {
            return user;
        }
        throw new EJBException("Failed sign in with mail: " + mail + " [Unknown mail or wrong password]");
    }
}

