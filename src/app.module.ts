import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { CategoryModule } from './category/category.module';
import { RatingModule } from './rating/rating.module';


@Module({
  imports: [
    AuthModule,
    OnboardingModule,
    CategoryModule,
    RatingModule,
  ],
  providers: [],
})
export class AppModule {}
