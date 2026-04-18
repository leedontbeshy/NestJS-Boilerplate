import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreateExampleDto } from './dto/create-example.dto';
import { ExampleEntity } from './entities/example.entity';
import { ExampleService } from './example.service';

@ApiTags('Example')
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @Version('1')
  @ResponseMessage('Fetched examples successfully')
  @ApiOperation({ summary: 'List example records' })
  @ApiOkResponse({
    description: 'Example records retrieved successfully',
    type: ExampleEntity,
    isArray: true,
  })
  findAll(): ExampleEntity[] {
    return this.exampleService.findAll();
  }

  @Post()
  @Version('1')
  @ResponseMessage('Example created successfully')
  @ApiOperation({ summary: 'Create a new example record' })
  @ApiCreatedResponse({
    description: 'Example record created successfully',
    type: ExampleEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        errors: ['name must be longer than or equal to 2 characters'],
      },
    },
  })
  create(@Body() createExampleDto: CreateExampleDto): ExampleEntity {
    return this.exampleService.create(createExampleDto);
  }
}
