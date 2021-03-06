import { parse } from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";
import { Category, ICategory } from "../../entities";
import { ICategoryRepository } from "../../repositories";

@injectable()
class ImportCategoriesUseCase {
  constructor(
    @inject("CategoryRepository")
    private repository: ICategoryRepository
  ) {}

  execute = async (file: Express.Multer.File | undefined): Promise<void> => {
    const categories = await this.loadCategories(file);

    categories.forEach(async (c) => {
      const { name, description } = c;
      const categoryAlreadyExists = await this.repository.findByName(name);

      if (!categoryAlreadyExists) {
        this.repository.addCategory({ name, description });
      }
    });
  };

  private loadCategories = (
    file: Express.Multer.File | undefined
  ): Promise<Category[]> => {
    return new Promise((resolve, reject) => {
      const categories: ICategory[] = [];

      if (file) {
        const stream = fs.createReadStream(file.path);
        const parseFile = parse();

        stream.pipe(parseFile);

        parseFile
          .on("data", async (line) => {
            const [name, description] = line;
            categories.push({ name, description });
          })
          .on("end", () => {
            fs.promises.unlink(file.path);
            resolve(categories);
          })
          .on("error", (error) => {
            reject(error);
          });
      }
    });
  };
}

export { ImportCategoriesUseCase };
