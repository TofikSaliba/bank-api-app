# bank API - documentation

## connected with react app(mine) - https://tofik-bank-app.herokuapp.com/

## base URL to use API - https://tofik-bank-app.herokuapp.com + /admin || /users || accounts

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

## Routs

| Name                     | Method | path                        | Body params                                                                          | Auth token    |
| ------------------------ | ------ | --------------------------- | ------------------------------------------------------------------------------------ | ------------- |
| Create new user          | post   | /users/signUp               | name- string, email- string, password- string, passportID- string                    | false         |
| login                    | post   | /users/login                | -email- string, password- string                                                     | false         |
| logout                   | post   | /users/logout               | -                                                                                    | true          |
| logout all devices       | post   | /users/logoutAll            | -                                                                                    | true          |
| User profile             | get    | /users/profile              | -                                                                                    | true          |
| Update user              | patch  | /users/editProfile          | name- string, email- string, password- string, userID-for admin- string              | true or admin |
| delete user              | delete | /users/deleteUser           | userID-for admin- string                                                             | true or admin |
| get users accounts       | get    | /accounts/ownAccounts       | -                                                                                    | true          |
| add account              | put    | /accounts/addAccount        | accountId- string, true or admin, userID-for admin- string                           | true or admin |
| deposit                  | put    | /accounts/deposit           | accountID- string, amount- number, userID-for admin- string                          | true or admin |
| withdraw                 | put    | /accounts/withdraw          | accountID- string, amount- number, userID-for admin- string                          | true or admin |
| transfer                 | put    | /accounts/transfer          | fromAccountID- string, toAccountID- string, amount- number, userID-for admin- string | true or admin |
| grant access to account  | put    | /accounts/grantAccess       | accountID- string, toUser- string, userID-for admin- string                          | true or admin |
| remove access to account | put    | /accounts/removeAccess      | accountID- string, fromUser- string, userID-for admin- string                        | true or admin |
| set account activity     | put    | /accounts/setActivity       | accountID- string, isActive- boolean , userID-for admin- string                      | true or admin |
| delete an account        | delete | /accounts/deleteAccount/:id | userID-for admin- string                                                             | true or admin |
| update account credit    | patch  | /admin/updateCredit         | accountID- string, newCredit- number                                                 | admin         |
| get all users            | get    | /admin/getAllUsers          | -                                                                                    | admin         |
| filter all users         | get    | /admin/filterUsers          | min- number, max- number <strong>note must provide as query and not in body</strong> | admin         |
| get all accounts         | get    | /admin/getAllAccounts       | -                                                                                    | admin         |
| filter all accounts      | get    | /admin/filterAcccounts      | min- number, max- number <strong>note must provide as query and not in body</strong> | admin         |
| filter active accounts   | get    | /admin/filterActiveAccounts | isActive- boolean <strong>note must provide as query and not in body</strong>        | admin         |
