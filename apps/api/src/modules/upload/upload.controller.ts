import {
  Controller, Post, UseInterceptors, UploadedFile, UploadedFiles,
  UseGuards, Query, Body,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("upload")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "upload", version: "1" })
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("single")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Query("folder") folder?: string
  ) {
    return this.uploadService.uploadFile(file, folder ?? "uploads");
  }

  @Post("multiple")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("files", 10, { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query("folder") folder?: string
  ) {
    return this.uploadService.uploadMany(files, folder ?? "uploads");
  }
}
