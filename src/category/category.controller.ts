import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreatePhysicianCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new physician category',
    description:
      'Creates a new category for physicians and returns the created category.',
  })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: CreatePhysicianCategoryDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Category name already exists.',
  })
  create(@Body() createCategoryDto: CreatePhysicianCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all physician categories',
    description:
      'Returns all the physician categories that are not soft deleted.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all physician categories.',
    isArray: true,
    type: CreatePhysicianCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No categories found.',
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific physician category by ID',
    description: 'Returns a specific category by its ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The unique identifier of the category',
    example: 'a9dcb024-bc3e-4b17-ae6a-550e32e9e8de',
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully retrieved.',
    type: CreatePhysicianCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with the provided ID.',
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing physician category',
    description:
      'Updates an existing category by ID and returns the updated category.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The unique identifier of the category',
    example: 'a9dcb024-bc3e-4b17-ae6a-550e32e9e8de',
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with the provided ID.',
  })
  @ApiResponse({
    status: 409,
    description: 'Category name already exists.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete a physician category',
    description:
      'Marks a physician category as deleted by setting the deletedAt field.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The unique identifier of the category to be deleted.',
    example: 'a9dcb024-bc3e-4b17-ae6a-550e32e9e8de',
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully soft deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found with the provided ID.',
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
