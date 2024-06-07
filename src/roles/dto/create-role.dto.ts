import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
    //check if role already exists
    //if exists throw an error role <name> already exists
    //if not then continue with the request
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name:string;
}
