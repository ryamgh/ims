import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,


    ){}
    
    async login(LoginDto: LoginDto): Promise<{ token: string}>{
        const user =await  this.prismaService.user
        .findUnique({ where:{ email: LoginDto.email} });

        if (!user){
            throw new NotFoundException(`user doesnot exist.`);
        }

        if (!await compare (LoginDto.password, user.password)){
            throw new UnauthorizedException('Invalid Credentials!!');
        }

        return{
            token: await this.jwtService.signAsync(user, {
                secret: process.env.JWT_SECRET,
            }),
        }
    }
    
}

