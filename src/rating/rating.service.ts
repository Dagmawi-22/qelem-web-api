import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRatingDto) {
    const [physician, patient] = await Promise.all([
      this.prisma.physician.findUnique({
        where: { id: dto.physicianId },
        select: {
          id: true,
          averageRating: true,
          ratingsCount: true,
        },
      }),
      this.prisma.patient.findUnique({ where: { id: dto.patientId } }),
    ]);

    if (!physician) {
      throw new NotFoundException('Physician not found');
    }

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // ❗ Check for duplicate rating from the same user
    const existing = await this.prisma.rating.findFirst({
      where: {
        patientId: dto.patientId,
        physicianId: dto.physicianId,
      },
    });

    if (existing) {
      throw new BadRequestException('You have already rated this physician.');
    }

    const createdRating = await this.prisma.rating.create({
      data: {
        rating: dto.rating,
        review: dto.review,
        physician: { connect: { id: dto.physicianId } },
        patient: { connect: { id: dto.patientId } },
      },
    });

    const newCount = physician.ratingsCount + 1;
    const newAverage =
      (physician.averageRating * physician.ratingsCount + dto.rating) /
      newCount;

    await this.prisma.physician.update({
      where: { id: dto.physicianId },
      data: {
        averageRating: parseFloat(newAverage.toFixed(2)),
        ratingsCount: newCount,
      },
    });

    return createdRating;
  }

  findAll() {
    return this.prisma.rating.findMany({
      include: {
        physician: true,
        patient: true,
      },
    });
  }

  async findOne(id: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: {
        physician: true,
        patient: true,
      },
    });

    if (!rating) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }

    return rating;
  }

  async update(id: string, dto: UpdateRatingDto) {
    const existing = await this.prisma.rating.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }

    return this.prisma.rating.update({
      where: { id },
      data: {
        ...dto,
        physicianId: undefined, // prevent reassigning unless explicitly needed
        patientId: undefined,
      },
    });
  }

  async remove(id: string) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }

    return this.prisma.rating.delete({ where: { id } });
  }
}
