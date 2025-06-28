export interface AddressDto {
  id: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
}

export interface UserDto {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: AddressDto;
}

export interface UpdateUserResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: AddressDto;
}
