export interface SingleCardWithImageAndTitleProps{
    _id: string| null,
    title:string,
    image: string,
    slug: string,
    description?: string,
    accent?: string,
    productCount?: number,
    highlights?: string[]
}
