import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ToolHandlerService } from './tool-handler.service';
import { ShoppingModule } from 'src/shopping/shopping.module';

@Module({
    imports: [ShoppingModule],
    providers: [AiService, ToolHandlerService],
    exports: [AiService, ToolHandlerService],
})
export class AiModule {}