import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Controller, Get, Param, UseGuards, ClassSerializerInterceptor, Inject, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { CHAT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatsUsecase } from '@use-cases/chat.usecase';
import { SpecificChatDTO } from './chat.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('chats')
@ApiTags('Chat')
@ApiBearerAuth()
export class ChatsController {
  constructor(
    @Inject(CHAT_USECASE_PROXY)
    private readonly chatsUsecaseProxy: UsecaseProxy<ChatsUsecase>,
  ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get All the Chats and Users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the chats and users',
  })
  findAllChatsAndUsersByUserId(@Param('userId') userId: number): Promise<any> {
    return this.chatsUsecaseProxy.getInstance().findAllChatsAndUsersByUserId(userId);
  }

  @Get('chat/:chatId')
  @ApiOperation({ summary: 'Get Specific Chat by Chat Id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the chat',
  })
  findSpecificChatByChatId(@Param() query: SpecificChatDTO): Promise<any> {
    return this.chatsUsecaseProxy.getInstance().findSpecificChatByChatId(query.chatId);
  }
}
