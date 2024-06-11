import { BadRequestException, Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { promises } from 'dns';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const checkRoleExists = await this.prismaService.role
      .findUnique({ where: { name: createRoleDto.name } });

    if (checkRoleExists) {
      throw new BadRequestException(`Role ${createRoleDto.name} already exists `);
    }

    return this.prismaService.role.create({
      data: createRoleDto,
    });
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.prismaService.role.findMany();
  }

  async findOne(id: number): Promise<RoleEntity> {
   return this.checkIfRoleExists(id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.checkIfRoleExists(id);

    const roleExits= await this.checkIfRoleExistsByName(updateRoleDto.name,id);

    if (!roleExits){
      throw new BadRequestException(`Role ${updateRoleDto.name} already exists.`)

  }

  return this.prismaService.role
  .update({
    where: {
      id,
    },
    data: updateRoleDto,
  });
}

  async remove(id: number) {
    await this.checkIfRoleExists(id);
    return this.prismaService.role.delete({where: {id}});
  }

private async checkIfRoleExists(id: number): Promise<RoleEntity>{
  const role =await this.prismaService.role
  .findFirst({where: {id}});

  if (!role){
    throw new NotFoundException();
  }
  return role;
}
private async checkIfRoleExistsByName(name: string, id?: number): Promise<boolean>{
  const checkRoleExists= await this.prismaService.role
  .findUnique({where: {name}});

  if (id){
    return checkRoleExists ? checkRoleExists.id === id: true;
  }
  return !! checkRoleExists;
}
}
