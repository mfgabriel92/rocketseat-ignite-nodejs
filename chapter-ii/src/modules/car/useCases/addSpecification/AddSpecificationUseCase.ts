import { ISpecification } from "../../models";
import { Specification } from "../../models/Specification";
import { ISpecificationRepository } from "../../repositories";

class AddSpecificationUseCase {
  constructor(private repository: ISpecificationRepository) {}

  execute = (Specification: ISpecification): Specification => {
    // const SpecificationAlreadyExists = this.repository.findByName(Specification.name);

    // if (SpecificationAlreadyExists) {
    //   throw new Error(`The specification "${Specification.name}" already exists`);
    // }

    this.repository.addSpecification(Specification);

    return Specification;
  };
}

export { AddSpecificationUseCase };
