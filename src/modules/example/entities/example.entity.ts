import { ApiProperty } from '@nestjs/swagger';

export class ExampleEntity {
  @ApiProperty({
    example: '18d64089-6e1c-4f59-8fc7-79d4d3518c81',
  })
  id!: string;

  @ApiProperty({
    example: 'Example item',
  })
  name!: string;

  @ApiProperty({
    example: 'A sample record returned by the example module.',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-04-18T15:00:00.000Z',
  })
  createdAt!: string;
}
