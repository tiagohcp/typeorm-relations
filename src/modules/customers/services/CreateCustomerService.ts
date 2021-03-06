import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import { transcode } from 'buffer';
import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists) {
      throw new AppError('This email is already registerd');
    }
    const newCustomer = await this.customersRepository.create({
      name,
      email,
    });

    return newCustomer;
  }
}

export default CreateCustomerService;
