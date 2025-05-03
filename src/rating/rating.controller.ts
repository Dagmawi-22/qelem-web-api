import {
  Controller,
  Get,
  Post,
  Body,
  Param,

} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Ratings')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rating and review' })
  @ApiResponse({ status: 201, description: 'Rating successfully created' })
  @ApiBody({ type: CreateRatingDto })
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiResponse({ status: 200, description: 'Returns list of all ratings' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific rating by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Rating ID' })
  @ApiResponse({ status: 200, description: 'Returns the rating if found' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update an existing rating' })
  // @ApiParam({ name: 'id', type: String, description: 'Rating ID to update' })
  // @ApiResponse({ status: 200, description: 'Rating successfully updated' })
  // @ApiResponse({ status: 404, description: 'Rating not found' })
  // update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
  //   return this.ratingService.update(id, updateRatingDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a rating by ID' })
  // @ApiParam({ name: 'id', type: String, description: 'Rating ID to delete' })
  // @ApiResponse({ status: 200, description: 'Rating successfully deleted' })
  // @ApiResponse({ status: 404, description: 'Rating not found' })
  // remove(@Param('id') id: string) {
  //   return this.ratingService.remove(id);
  // }
}
