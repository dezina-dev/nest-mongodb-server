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

## What's here?
- User, Post & Comment relations
    ```bash
        - The User model 
        Has an array of posts and an array of comments, where each item in the array is an ObjectId referencing the corresponding Post or Comment document.
        
        - Post Model (post.model.ts):
        The Post model has an ObjectId reference to the User who created the post

        - Comment Model (comment.model.ts):
        The Comment model has ObjectId references to both the User who made the comment and the Post on which the comment is made
    ```
- User signup, login, get new refresh-token
- Create post, add comments to post, get post & its comments
- Reuse mongoose models across different modules
    ```bash
            - import the required modules and models from other modules
            @Module({
            imports: [
                CommentModule,
                MongooseModule.forFeature([
                { name: Posts.name, schema: PostSchema },
                { name: Comment.name, schema: CommentSchema }
                ])
            ],
            })

            - in the constructor of the service where you want to use the models, inject them using @InjectModel
            constructor(
            @InjectModel(Posts.name) private readonly postModel: Model<Posts>,
            @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
            ) { }
        
    ```
- Inject nest.js service from another module
    ```bash
            - export that service in the module that provides it
            @Module({
            imports: [
                CommentModule,
                MongooseModule.forFeature([
                { name: Posts.name, schema: PostSchema },
                { name: Comment.name, schema: CommentSchema }
                ])
            ],
            controllers: [PostController],
            providers: [PostService],
            exports: [PostService],
            })
            
            - & inject that service in the constructor of other service to use
           constructor(
            private readonly postService: PostService,
            private readonly commentService: CommentService,
            ) { }
        
    ```
- Nestjs middlewares (middlewares/logging.middleware.ts)
    ```bash
        Middleware functions in NestJS are executed before the route handler is called. They have access to the request and response objects and can perform actions such as logging, modifying the request or response, or terminating the request-response cycle.

        LoggingMiddleware logs information about each incoming request.
        Middleware functions in NestJS are executed before the route handler is called. They have access to the request and response objects and can perform actions such as logging, modifying the request or response, or terminating the request-response cycle.
        logging middleware - uses winston library, to create loggers for info, warn, error & generate log file based on the file size

    ```
- Nestjs guards (guards/auth.guard.ts)
     ```bash
        Guards determine whether a given request should be handled by the route handler. They are used for authentication, authorization, and input validation.

        AuthGuard verifies the authenticity of a user's authentication token. It checks whether a JWT token is present in the request headers and if the token is valid

        AuthGuard ensures that only authenticated users can access routes

    ```
- "cron" scheduling using nestjs (cron/cron-job.service.ts)
     ```bash
       - A cron job is a program that’s used to schedule tasks that are to be executed repeatedly at a specific time
       - This CronJobService in NestJS is a scheduled service that runs a cleanup job every day at midnight. It uses the @nestjs/schedule library for cron scheduling. The handleCron method is decorated with @Cron and specifies the cron expression for daily execution

       - EVERY_DAY cleanup
	   - delete older posts & comments

    ```
## License

Nest is [MIT licensed](LICENSE).
