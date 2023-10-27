import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(@Res() res: Response) {
    // res.cookie('test', 'test', {
    //   httpOnly: true,
    //   sameSite: 'strict',
    // });
    return res.send(this.appService.getHello());
  }

  @Get('cookies')
  getCookies(@Req() req: Request) {
    return req.signedCookies;
  }

  @Get('home')
  @Render('index')
  getHome() {
    return {
      message: 'Hello world!',
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Alice' },
        { id: 3, name: 'Bob' },
      ],
    };
  }
}
