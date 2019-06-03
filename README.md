# ROUTES

## EXPRESS:

### AUTH CONTROLLER


#### GET /auth/:id - show's users profile information.

#### GET /auth/login - Show's success message once user has logged in (req.session.message).


#### POST /auth/register - authenticaion "meat/potatoes" - creates encrypted pw/userDbId/profile

#### POST /auth/login - user isn't logged in - redirect to register

#### GET /auth/logout - destroys session



#### POST /auth/register - authenticaion "meat/potatoes" - creates encrypted pw/userDbId/profile

#### GET /auth/logout - destroys session


### RESTAURANT CONTROLLER

#### GET /restaurants - an index of all restaurants in Chicago opened late in Chicago.

#### GET /restaurants/:id - show info about a restaurant -- include comments made by user(s)

#### GET restaurants/:id/comment - leave a new comment on a restaurant - end point creates a DB entry for restaurant if no entry exists and then populates it with comments made by the user.  

#### COMMENT CONTROLLER (using restaurants endpoint as '/')

#### GET comment/restaurants/:id - endpoints shows comments left on that restaurant

#### PUT comment/restaurants/:id/edit - allows user to edit comment left on that restaurants ID.

### RESTAURANT CONTROLLER

#### GET /restaurants - an index of all restaurants in Chicago opened late in Chicago

#### GET /restaurants/:id - show info about a restaurant -- include comments made by user(s)

### COMMENT CONTROLLER (using restaurants endpoint as '/')

#### GET comment/restaurant/:id - shows comments let on that restaurant

#### DELETE comment/restaurant/:id - users will be able to delete their comments (if logged in).
