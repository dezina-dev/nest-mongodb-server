import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class CronJobService {
    constructor(
        private readonly postService: PostService,
        private readonly commentService: CommentService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        console.log('Running daily cleanup job');

        try {
            // Specify a threshold date (e.g., delete posts older than 30 days)
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() - 30);
            // Delete old posts
            await this.postService.deleteOldPosts(thresholdDate);

            // Delete old comments
            await this.commentService.deleteOldComments(thresholdDate);

            console.log('Daily cleanup job completed.');
        } catch (error) {
            console.error('Error in daily cleanup job:', error.message);
        }
    }
}
