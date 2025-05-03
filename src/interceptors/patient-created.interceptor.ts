import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import axios from 'axios';

@Injectable()
export class PatientCreationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Interceptor initialized');
    return next.handle().pipe(
      mergeMap(async (patient) => {
        if (!patient?.id) {
          return patient;
        }

        let language = patient.user.lang || 'ENG';
        language = String(language).toLowerCase();
        const url = `${process.env.AI_API_URL}/profile/${patient.id}?language=${language}`;

        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const response = await axios.post(url, {
              config: {},
              responses: {},
            });
            break;
          } catch (error) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, attempt)),
            );
          }
        }

        return patient;
      }),
    );
  }
}
