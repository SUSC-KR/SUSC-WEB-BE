import { Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { UseManagerToken } from 'src/core/use-manager-token';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('test')
  @UseManagerToken()
  async sendTestReport() {
    await this.reportService.sendTestReport();
    return { message: 'Test report sent successfully' };
  }
}
