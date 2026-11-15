import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Res,
  Request,
  Inject,
  Query,
  UseInterceptors,
  UseGuards,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import UsecaseProxy, { INSTAGRAM_USECASE_PROXY, PROPOSAL_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import { ProposalUsecase } from '@use-cases/proposal.usecase';
import { CreateProposalDto } from './create_proposal.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalController {
  constructor(
    @Inject(PROPOSAL_USECASE_PROXY)
    private readonly proposalProxy: UsecaseProxy<ProposalUsecase>,
  ) {}

  @Post('/create')
  async createProposal(@Request() req: any, @Body() createProductDto: CreateProposalDto) {
    const userId = req.user.id;
    return this.proposalProxy.getInstance().createProposals(userId, createProductDto);
  }

  @Get('')
  async Index(@Request() req: any) {
    const userId = req.user.id;
    return this.proposalProxy.getInstance().showAllProposals(userId);
  }
  @Get(':id')
  async getProposal(@Param('id') id: number) {
    return this.proposalProxy.getInstance().getParticularProposal(+id);
  }

  @Put(':id')
  async updateProposal(@Param('id') id: number, @Body() createProductDto: CreateProposalDto) {
    return this.proposalProxy.getInstance().updateProposal(+id, createProductDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: number) {
    console.log('dkjasbkdjaskjbn');
    return this.proposalProxy.getInstance().remove(id);
  }

  @Post('/search')
  async search(@Request() req: any, @Body() body: any) {
    const userId = req.user.id;
    return this.proposalProxy.getInstance().search(body, userId);
  }
}
