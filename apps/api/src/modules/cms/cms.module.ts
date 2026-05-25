import { Module } from "@nestjs/common";
import { CmsController } from "./cms.controller";
import { CmsAdminController } from "./cms-admin.controller";
import { CmsService } from "./cms.service";

@Module({
  controllers: [CmsController, CmsAdminController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
