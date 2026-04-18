import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateExampleDto } from './dto/create-example.dto';
import { ExampleEntity } from './entities/example.entity';

@Injectable()
export class ExampleService {
  private readonly examples: ExampleEntity[] = [
    {
      id: randomUUID(),
      name: 'Welcome example',
      description: 'A seeded in-memory record to demonstrate the module contract.',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(): ExampleEntity[] {
    return this.examples;
  }

  create(createExampleDto: CreateExampleDto): ExampleEntity {
    const example: ExampleEntity = {
      id: randomUUID(),
      name: createExampleDto.name,
      description: createExampleDto.description ?? null,
      isActive: createExampleDto.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    this.examples.push(example);

    return example;
  }
}
