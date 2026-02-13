import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { PaginationMetaDto, ContextMetaDto } from './response-base.dto';

export function ApiResponseDto<T>(ItemDto: Type<T>) {
  class Wrapped {
    @ApiProperty({ type: ItemDto }) data!: T;
    @ApiPropertyOptional({ type: PaginationMetaDto })
    meta?: PaginationMetaDto | null;
    @ApiProperty({ type: ContextMetaDto }) context!: ContextMetaDto;
  }
  Object.defineProperty(Wrapped, 'name', {
    value: `ApiResponse_${ItemDto.name}`,
  });
  return Wrapped;
}

export function ApiArrayResponseDto<T>(ItemDto: Type<T>) {
  class Wrapped {
    @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(ItemDto) } })
    data!: T[];
    @ApiPropertyOptional({ type: PaginationMetaDto })
    meta?: PaginationMetaDto | null;
    @ApiProperty({ type: ContextMetaDto }) context!: ContextMetaDto;
  }
  Object.defineProperty(Wrapped, 'name', {
    value: `ApiArrayResponse_${ItemDto.name}`,
  });
  return Wrapped;
}

export function PaginatedResponseDto<T>(ItemDto: Type<T>) {
  class Wrapped {
    @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(ItemDto) } })
    data!: T[];
    @ApiProperty({ type: PaginationMetaDto }) meta!: PaginationMetaDto;
    @ApiProperty({ type: ContextMetaDto }) context!: ContextMetaDto;
  }
  Object.defineProperty(Wrapped, 'name', {
    value: `PaginatedResponse_${ItemDto.name}`,
  });
  return Wrapped;
}
