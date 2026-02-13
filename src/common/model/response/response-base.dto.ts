import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedHeaderDto {
  @ApiProperty() key!: string;
  @ApiProperty() label!: string;
  @ApiPropertyOptional() sortable?: boolean;
}

export class PaginationMetaDto {
  @ApiProperty({ enum: ['page', 'none'] }) mode!: 'page' | 'none';
  @ApiPropertyOptional() page?: number;
  @ApiPropertyOptional() size?: number;
  @ApiPropertyOptional() total?: number;
  @ApiPropertyOptional() pageCount?: number;
  @ApiPropertyOptional() hasPrev?: boolean;
  @ApiPropertyOptional() hasNext?: boolean;

  @ApiPropertyOptional({ type: [PaginatedHeaderDto] })
  headers?: PaginatedHeaderDto[];
}

export class ContextMetaDto {
  @ApiProperty() requestId!: string;
  @ApiProperty() path!: string;
  @ApiProperty() method!: string;
  @ApiProperty() status!: number;
  @ApiProperty() timestamp!: string;
}

export class ErrorBodyDto {
  @ApiProperty() message!: string;
  @ApiPropertyOptional() code?: string;
  @ApiPropertyOptional() type?: string;
  @ApiPropertyOptional() details?: any;
  @ApiPropertyOptional() data?: any;
}

export class SuccessResponseDto<T = any> {
  @ApiProperty({ default: true })
  success!: true;

  @ApiProperty()
  data!: T;

  @ApiPropertyOptional({ type: PaginationMetaDto })
  meta?: PaginationMetaDto | null;

  @ApiProperty({ type: ContextMetaDto })
  context!: ContextMetaDto;
}

export class ErrorResponseDto {
  @ApiProperty({ default: false }) success!: false;
  @ApiProperty({ type: ErrorBodyDto }) error!: ErrorBodyDto;
  @ApiProperty({ type: ContextMetaDto }) context!: ContextMetaDto;
}
