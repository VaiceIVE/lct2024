import { Body, Controller, Get, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { RefreshTokenGuard } from './refreshToken.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response, Request } from 'express'
import { AccessTokenGuard } from './accessToken.guard';

interface CookieOptions {
    maxAge?: number | undefined;
    signed?: boolean | undefined;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    secure?: boolean | undefined;
    encode?: ((val: string) => string) | undefined;
    sameSite?: boolean | "lax" | "strict" | "none" | undefined;
    priority?: "low" | "medium" | "high";
    partitioned?: boolean | undefined;
}

const cookieSettings: CookieOptions = {
    httpOnly: true,
    domain: "adera-team.ru",
    secure: true,
    maxAge: 7200
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}
    
    @Post()
    public async createOne(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response)
    {
        const result = await this.authService.signUp(userDto)
        response.cookie('jwt', result.accessToken,  cookieSettings)
        response.cookie('jwt-refresh', result.refreshToken,  cookieSettings)
        return result.user
    }

    @Post('signin')
    public async signin(@Body() userDto: AuthDto, @Res({ passthrough: true }) response: Response)
    {
        const result = await this.authService.signIn(userDto)
        response.cookie('jwt', result.accessToken,  cookieSettings)
        response.cookie('jwt-refresh', result.refreshToken,  cookieSettings)
        return result.user 
    }
    
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refreshTokens(@Req() req: Request,  @Res({ passthrough: true }) response: Response) {
        const userId = req['user']['sub'];
        const refreshToken = req.cookies['jwt-refresh'];
        const result =  await this.authService.refreshTokens(userId, refreshToken);
        response.cookie('jwt', result.accessToken,  cookieSettings)
        response.cookie('jwt-refresh', result.refreshToken,  cookieSettings)
        return result.user
    }
}
