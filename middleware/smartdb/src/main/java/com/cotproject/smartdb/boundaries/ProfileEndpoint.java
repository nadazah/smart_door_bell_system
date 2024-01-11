package com.cotproject.smartdb.boundaries;
import com.cotproject.smartdb.entities.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.cotproject.smartdb.repositories.UserRepository;
import java.util.function.Supplier;
import jakarta.ws.rs.*;

@ApplicationScoped
@Path("profile") // returns details of the user for the profile page
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileEndpoint {

    private static final Supplier<WebApplicationException> NOT_FOUND =
            () -> new WebApplicationException(Response.Status.NOT_FOUND);

    @Inject
    private UserRepository repository;

    @GET
    @Path("/{mail}")
    public  User get(@PathParam("mail") String username) {
        User user=repository.findById(username).orElseThrow();
        String passwordhash=""; // create user with empty string  instead of password
        User profile=new User(user.getName(),user.getfullname(),passwordhash);
        return profile;

    }

    @POST // POST METHOD to send the data of the user in JSON format and save it in the database
    public void save(User user) {
        repository.save(user);
    }

}





