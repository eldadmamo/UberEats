import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Category } from "../entities/category.entity";


@Injectable()
export class CategoryRepository extends Repository<Category> {
    constructor(private dataSource: DataSource) {
        super(Category, dataSource.createEntityManager())
    }
    async getOrCreate(name: string): Promise<Category> {
        const categoryName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase()
        const categorySlug = categoryName.replace(/ /g, '-').toLowerCase()

        let category = await this.findOne({ where: { slug: categorySlug } })
        if (!category) {
            category = await this.save(this.create({ slug: categorySlug, name: categoryName }))
        }
        return category
    }
}