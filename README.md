# bank API - documentation

## base URL - https://tofik-bank-api.herokuapp.com/api

### To use must have an API Key, it can be generated on the homePage.

### Use the api key as a query and the key should be: apiKey

### usage example: https://tofik-bank-api.herokuapp.com/api/{End-Point}?apiKey={your-key}

<br />
<br />
<br />

# The following are the end points, and how to use them!

### note: most of the data must be sent in the request body and the param names must be exact!

<br />

## To start you must add users, to add users end point: /addUser

### must provide in body user passport ID as passportID and the name as name.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/addUser?apiKey={your-key}", {
<br />
method: "POST",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
name: "name",<br />
passportID: "pass ID",<br />
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

## To delete accounts to users use end point: /deleteAccount

### must provide in body owner user passport ID as passportID, account ID as accountID.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/deleteAccount?apiKey={your-key}", {<br />
method: "DELETE",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
passportID: "pass ID",<br />
accountID: "account ID",<br />
},<br />
});<br />

<br />
<br />

## To delete User use end point: /deleteUser

### must provide in body user passport ID as passportID, to delete a user must have no accounts.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/deleteUser?apiKey={your-key}", {<br />
method: "DELETE",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
passportID: "pass ID",<br />
},<br />
});<br />

<br />
<br />

## To deposite use end point: /deposit

### must provide in body account ID as accountID and amount as amount.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/deposit?apiKey={your-key}", {<br />
method: "PUT",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
accountID: "account ID",<br />
amount: "amount",<br />
},<br />
});<br />

<br />
<br />

## To get all users or filter some use end point: /filterUsers

### must provide in query a min cash number or a max cash number or both, to filter users by cash with a minmum or maximum value or range between both

### example to get all users:

fetch("https://tofik-bank-api.herokuapp.com/api/filterUsers?apiKey={your-key}");

### example to get someUsers:

fetch("https://tofik-bank-api.herokuapp.com/api/filterUsers?min=1000&max=20000&apiKey={your-key}");

<br />
<br />

## To get a certain user use end point: /getUser

### must provide in query the User passport ID as userID.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/getUser?userID={user-id}&apiKey={your-key}");

<br />
<br />

## To grant a user access to another user account use end point: /grantAccess

### must provide in body user passport ID as ownerID, user to give access as accessID and account to grant access to as accountID

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/grantAccess?apiKey={your-key}", {<br />
method: "PUT",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
ownerID: "owner ID",<br />
accessID: "access ID",<br />
accountID: "account ID",<br />
},<br />
});<br />

<br />
<br />

## To remove a user access to another user account use end point: /removeAccess

### must provide in body user passport ID as ownerID, user to remove access as accessID and account to remove access to as accountID

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/removeAccess?apiKey={your-key}", {<br />
method: "DELETE",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
ownerID: "owner ID",<br />
accessID: "access ID",<br />
accountID: "account ID",<br />
},<br />
});<br />

<br />
<br />

## To set an account activity use end point: /setAccActivity

### must provide in body user passport ID as passportID, account to change as accountID and true or false as isActive.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/setAccActivity?apiKey={your-key}", {<br />
method: "PUT",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
passportID: "pass ID",<br />
accountID: "account ID",<br />
isActive: "false",<br />
},<br />
});<br />

<br />
<br />

## To transfer cash use end point: /transfer

### must provide in body sender user passport ID as passportID, account to send from as fromAccountID, account to send to as toAccountID and amount to send as amount.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/transfer?apiKey={your-key}", {<br />
method: "PUT",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
passportID: "pass ID",<br />
fromAccountID: "from account ID",<br />
toAccountID: "to account ID",<br />
amount: "2000",<br />
},<br />
});<br />

<br />
<br />

## To withdraw cash use end point: /withdraw

### must provide in body user passport ID as passportID, account to withdraw from as accountID and amount to withdraw as amount.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/withdraw?apiKey={your-key}", {<br />
method: "PUT",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
passportID: "pass ID",<br />
accountID: "account ID",<br />
amount: "2000",<br />
},<br />
});<br />

<br />
<br />

## To update a user's account credit use end point: /updateCredit

### must provide in body account ID to update as accountID and new credit value as newCredit.

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/updateCredit?apiKey={your-key}", {<br />
method: "PUT",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
body: {<br />
accountID: "account ID",<br />
newCredit: "5000",<br />
},<br />
});<br />

<br />
<br />

## To reset your API key data to default use end point: /resetKey

### Just use ur api key in query and make a delete request and it will be reset

### example:

fetch("https://tofik-bank-api.herokuapp.com/api/resetKey?apiKey={your-key}", {<br />
method: "DELETE",<br />
headers: {<br />
"Content-Type": "application/json",<br />
},<br />
});<br />
