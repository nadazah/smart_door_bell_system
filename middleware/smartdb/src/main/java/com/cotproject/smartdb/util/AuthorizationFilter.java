package com.cotproject.smartdb.util;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.ext.Provider;
import jakarta.ws.rs.core.Response;
@Provider
public class AuthorizationFilter implements ContainerRequestFilter {

    public final static String authorizePath = "/api/authorize";
    public final static String authenticatePath = "/api/authenticate/";
    public final static String tokenPath = "/api/oauth/token";
    public final static String personpath = "/api/user";
    public final static String forgottenpasswordpath = "/api/mail/";

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String path = requestContext.getUriInfo().getRequestUri().getPath();
        if (isAllowedWithoutAccessToken(path)) {
            return; // if the request path is allowed without an access token, return without further checks
        }

        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // block the request if there is no valid authorization header or if it doesn't start with "Bearer "
            requestContext.abortWith(Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity("User cannot access the resource.")
                    .build());
            return;
        }

        // Continue with your logic for checking access token validity, if needed.
    }

    private boolean isAllowedWithoutAccessToken(String path) {
        return path.equals(authorizePath) || path.contains(tokenPath) || path.equals(authenticatePath)
                || path.equals(personpath) || path.contains(forgottenpasswordpath);
    }
}

