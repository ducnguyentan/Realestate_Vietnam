import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService } from './services/listings.service';
import { CreateListingDto, UpdateListingDto, FilterListingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new listing' })
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(userId, createListingDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all listings with filters' })
  async findAll(@Query() filterDto: FilterListingDto) {
    return this.listingsService.findAll(filterDto);
  }

  @Public()
  @Get('code/:code')
  @ApiOperation({ summary: 'Get listing by code' })
  async findByCode(@Param('code') code: string) {
    return this.listingsService.findByCode(code);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get listing by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.listingsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  async findById(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/my-listings')
  @ApiOperation({ summary: 'Get current user listings' })
  async getMyListings(@CurrentUser('userId') userId: string) {
    return this.listingsService.findByUserId(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update listing' })
  async update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, userId, updateListingDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete listing' })
  async delete(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    await this.listingsService.delete(id, userId);
    return { message: 'Listing deleted successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish listing (draft -> pending)' })
  async publish(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.listingsService.publish(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  @ApiOperation({ summary: 'Save/bookmark listing (increment save count)' })
  async save(@Param('id') id: string) {
    await this.listingsService.incrementSaves(id);
    return { message: 'Listing saved' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/contact')
  @ApiOperation({ summary: 'Contact seller (increment contact count)' })
  async contact(@Param('id') id: string) {
    await this.listingsService.incrementContacts(id);
    return { message: 'Contact recorded' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/quality')
  @ApiOperation({
    summary: 'Get listing quality score and improvement suggestions',
  })
  async getQuality(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.listingsService.getQualityInfo(id, userId);
  }
}
