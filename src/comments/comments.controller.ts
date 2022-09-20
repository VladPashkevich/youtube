import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { RequestWithUser } from 'index';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @Put(':commentId')
  updateCommentById(
    @Param('commentId') commentId: string,
    @Body('content') contenet: string,
  ) {
    return this.commentsService.updateComment(contenet, commentId);
  }

  @Delete(':commentId')
  deleteCommentById(@Param('commentId') commentId: string) {
    return this.commentsService.deleteCommentById(commentId);
  }

  @Get(':commentId')
  getCommentById(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.getCommentById(
      commentId,
      req.user._id?.toString(),
    );
  }

  @Put(':commentId/like-status')
  updateLikeStatus(
    @Param('postid') postid: string,
    @Req() req: RequestWithUser,
    @Body('likeStatus') likeStatus: string,
  ) {
    return this.commentsService.updateLikeStatus(
      likeStatus,
      postid,
      req.user._id.toString(),
      req.user.accountData.login,
    );
  }
}
