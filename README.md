# bank API - documentation

## base URL - https://tofik-bank-app.herokuapp.com/

<br />
<br />
<br />

# The following are the end points, and how to use them!

### note: most of the data must be sent in the request body and the param names must be exact!

<br />

### usage example:

fetch("https://tofik-bank-app.herokuapp.com/users/signUp", {
<br />
method: "POST",<br />
body: {<br />
name: "name",<br />
passportID: "pass ID",<br />
email: "email",<br />
password: "password",<br />
},<br />
});<br />

<br />
<br />

## note that some endpoints like signing up or loggin in dont require authentication token, however others do! here is an example of how to send it

fetch("https://tofik-bank-app.herokuapp.com/accounts/addAccount", {
<br />
method: "POST",<br />
headers: {<br />
"Authorization": "here the token you get from signing up or logging in",<br />
},<br />
body: {<br />
cash: "cash",<br />
credit: "credit",<br />
},<br />
});<br />

<br />
<br />

## To add accounts to users use end point: /addAccount

### must provide in body user passport ID as passportID, cash as cash and credit as credit, credit and cash are optional, default will be set to 0.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/addAccount?apiKey={your-key}", {<br />
method: "POST",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
passportID: "pass ID",<br />
cash: "cash",<br />
credit: "credit",<br />
},<br />
});<br />

<br />
<br />

## Routs

| Name               | Method           | path                  | Body params                                                                          | Auth token    |
| ------------------ | ---------------- | --------------------- | ------------------------------------------------------------------------------------ | ------------- |
| Create new user    | post             | /users/signUp         | name- string, email- string, password- string, passportID- string                    | false         |
| login              | post             | /users/login          | -email- string, password- string                                                     | false         |
| logout             | post             | /users/logout         | -                                                                                    | true          |
| logout all devices | post             | /users/logoutAll      | -                                                                                    | true          |
| User profile       | get              | /users/profile        | -                                                                                    | true          |
| Update user        | patch            | /users/editProfile    | name- string, email- string, password- string, userID-for admin- string              | true or admin |
| delete user        | delete           | /users/deleteUser     | userID-for admin- string                                                             | true or admin |
| get users accounts | get              | /accounts/ownAccounts | -                                                                                    | true          |
| add account        | put              | /accounts/addAccount  | accountId- string, true or admin, userID-for admin- string                           | true or admin |
| deposit            | put              | /accounts/deposit     | accountID- string, amount- number, userID-for admin- string                          | true or admin |
| withdraw           | put              | /accounts/withdraw    | accountID- string, amount- number, userID-for admin- string                          | true or admin |
| transfer           | put              | /accounts/transfer    | fromAccountID- string, toAccountID- string, amount- number, userID-for admin- string | true or admin |
| Account details    | put :point_left: | /accaount             | accountId- string                                                                    | true or admin |
| User details       | put :point_left: | /user                 | user - string                                                                        | true or admin |
| Update credit      | put              | /update_credit        | accountId- string, credit- number                                                    | true or admin |
