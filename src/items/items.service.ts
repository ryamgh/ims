import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createItemDto: CreateItemDto) {
    const itemExists= await this.checkIfItemExistsByName(createItemDto.name)
    const checkRoleExists = await this.prismaService.item
      .findUnique({ where: { name: createItemDto.name } });

    if (checkRoleExists) {
      throw new BadRequestException(`Item ${createItemDto.name} already exists `);
    }

    return this.prismaService.item.create({
      data: createItemDto,
    });
  }

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  private async checkIfItemExistsByName(name: string, id?: number): Promise<boolean>{
    const checkItemExists= await this.prismaService.item
    .findUnique({where: {name}});
  
    if (id){
      return checkItemExists ? checkItemExists.id === id: true;
    }
    return !! checkItemExists;
  }
}
