## Local URL

To run the project on a local environment with a local backend server, use the following URL: [http://localhost:4000/](http://localhost:4000/)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Whats here?
- User, Post & Comment relations
    - User Model (user.model.ts):
    ```bash
        The User model has an array of posts and an array of comments, where each item in the array is an ObjectId referencing the corresponding Post or Comment document.
        Post Model (post.model.ts):

        The Post model has an ObjectId reference to the User who created the post.
        Comment Model (comment.model.ts):

        The Comment model has ObjectId references to both the User who made the comment and the Post on which the comment is made.
    ```
    
## License

Nest is [MIT licensed](LICENSE).
