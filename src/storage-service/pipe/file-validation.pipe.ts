import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const ParseTransactionItemFileValidation = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 10000000,
    message: 'File too large, max size 10MB',
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    fileIsRequired: false,
  });
