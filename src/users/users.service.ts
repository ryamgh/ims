import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ){}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const checkUserExists = await this.checkIfUserExistsByEmail(createUserDto.email);

    if (checkUserExists) {
      throw new BadRequestException(`Role ${createUserDto.email} already exists `);
    }
    createUserDto.password =await hash(
      createUserDto.password,
      parseInt(process.env.SALT_ROUNDS),
    )

    return this.prismaService.user.create({
      data: createUserDto,
      include: {
        role: true,
      },
    });
  }

 async findAll(): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({
      include: {
        role: true,
      },
    });
    
  }

  async findOne(id: number): Promise<UserEntity> {

    const user =await this.prismaService.user
    .findFirst({where: {id}, include:{
      role:true,
    } });

    if (!user){
      throw new NotFoundException(`unable to find the specific user with this id ${id}`);
    }
    return user ;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    
    const user = await this.prismaService.user.findFirst({
      where: { id }
    });
  
    if (!user) {
      throw new NotFoundException(`Unable to find the specific user with this id ${id}`);
    }

    const userExists= await this. checkIfUserExistsByEmail(
      updateUserDto.email, id,);

      if (!userExists){
        throw new BadRequestException(
          `User with email ${updateUserDto.email} already exists`,
        );
      }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(
        updateUserDto.password,
        parseInt(process.env.SALT_ROUNDS),
      );
    }
  
    // Update the user
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        role: true,
      },
    });
  }
  

 async remove(id: number) {
    const user = await this.prismaService.user
    .findFirst({ where: {id } , include:{
      role: true,
    }});

    if (!user){
      throw  new NotFoundException(`Unable to find this specific user with id number ${id}`)
    }

    return this. prismaService.user 
    .delete ({where : {id} });
  }
  private async checkIfUserExistsByEmail(email: string, id?: number): Promise<boolean>{
    const checkUserExists= await this.prismaService.user
    .findUnique({where: {email}});
  
    if (id){
      return checkUserExists ? checkUserExists.id === id: true;
    }
    return !! checkUserExists;
  }
}
