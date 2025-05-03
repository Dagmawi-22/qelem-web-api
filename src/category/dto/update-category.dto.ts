import { PartialType } from '@nestjs/swagger';
import { CreatePhysicianCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreatePhysicianCategoryDto) {}
