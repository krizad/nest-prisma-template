import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination Meta Information
 */
export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: false })
  hasNextPage: boolean;

  @ApiProperty({ example: true })
  hasPreviousPage: boolean;
}

/**
 * List Result Response DTO
 * Generic DTO for paginated list responses
 *
 * Usage:
 * ```
 * new ListResultDto<UserDto>(users, pagination)
 * ```
 */
export class ListResultDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
