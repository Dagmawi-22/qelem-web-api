import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhysicianCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new category
  async create(createCategoryDto: CreatePhysicianCategoryDto) {
    try {
      const existingCategory = await this.prisma.physicianCategory.findUnique({
        where: {
          name: createCategoryDto.name,
          deletedAt: null,
        },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with the name '${createCategoryDto.name}' already exists.`,
        );
      }

      const category = await this.prisma.physicianCategory.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      throw error;
    }
  }

  // Get all categories
  async findAll() {
    try {
      const categories = await this.prisma.physicianCategory.findMany({
        where: {
          deletedAt: null,
        },
      });
      if (categories.length === 0) {
        throw new NotFoundException('No categories found.');
      }
      return categories;
    } catch (error) {
      throw error;
    }
  }

  // Get a single category by ID
  async findOne(id: string) {
    try {
      const category = await this.prisma.physicianCategory.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID '${id}' not found.`);
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const existingCategory = await this.prisma.physicianCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with ID '${id}' not found.`);
      }

      // Check for name conflicts if the name is being updated
      if (updateCategoryDto.name) {
        const nameConflict = await this.prisma.physicianCategory.findUnique({
          where: { name: updateCategoryDto.name },
        });

        if (nameConflict) {
          throw new ConflictException(
            `Category with the name '${updateCategoryDto.name}' already exists.`,
          );
        }
      }

      const updatedCategory = await this.prisma.physicianCategory.update({
        where: { id },
        data: updateCategoryDto,
      });

      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete a category (update the deletedAt field)
  async remove(id: string) {
    try {
      const category = await this.prisma.physicianCategory.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID '${id}' not found.`);
      }

      // Update deletedAt field for soft delete
      const deletedCategory = await this.prisma.physicianCategory.update({
        where: { id },
        data: {
          deletedAt: new Date(), // Set current date as the deleted timestamp
        },
      });

      return {
        message: `Category with ID '${id}' has been soft deleted successfully.`,
        category: deletedCategory,
      };
    } catch (error) {
      throw error;
    }
  }
}
