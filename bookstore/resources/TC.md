### API Test Scenarios
| Test ID | Scenarios | Test Steps | Severity | Status |
|---------|-----------|------------|----------|--------|
| TC001 | Successful in fetching book list | 1. Send GET request to retrieve available book list | High | PASS |
| TC002 | Successful in adding single book | 1. Send request to Register a new user<br>2. Send GET request to retrieve ISBN for the specified book title | High | PASS |
| TC003 |||||
| TC004 |||||
| TC005 |||||
| TC006 |||||
| TC007 |||||
| TC008 |||||
| TC009 |||||
| TC010 | Verify unable retrieve ISBN for non-existent book title | 1. Send GET request to retrieve ISBN for the specified book title | Medium | PASS |
| TC011 | Verify user is unable to add incorrect ISBN | 1. Send POST request to register user<br>2. Send POST request to add book by providing incorrect ISBN<br>3. Send GET request to retrieve user profile details to ensure previous ISBN was not added into the book collections list | Medium | PASS |
| TC012 | Verify user is unable to add duplicate books | 1. Send POST request to register user<br>2. Send POST request to add book by providing the ISBN<br>3. Send another POST request to add book by providing the same ISBN<br>3. Verify ISBN added only once | Medium | PASS |
| TC013 | Verify user is unable to add books with invalid userId | 1. Send GET request to get valid ISBN<br>2. Send POST request to add book by providing invalid/non-existing User ID | High | PASS |
| TC014 | Verify user is unable to generate token with incorrect credentials | 1. Send POST request to generate token with invalid credentials (incorrect username/password) | High | WIP |
| TC015 | Verify user is unable to register with existing username | 1. Send POST request to register user by entering existing credentials | High | WIP |
| TC016 | Verify unable to delete non-existent user | 1. Send DELETE request to delete non-existing user<br>2. Verify correct API response received | Medium | WIP |
| TC017 | Verify unable to fetch profile of non-existent user ||||
| TC018 | Verify non-authorized user unable to add books | 1. Send GET request to get valid ISBN<br>2. Send POST request to add book by providing correct User ID but incorrect Authorization header value | High | WIP |
| TC019 | Verify user is unable to generate token for unregistered user | 1. Send POST request to generate token with non-existing user | High | WIP |


### UI Test Scenarios