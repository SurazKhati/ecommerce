export const MessageConstants = {

    TOKEN_EXPIRED :"Token expired."

}
// export  type UserRoles = {
//     ADMIN : "admin",
//     CUSTOMER:"customer",
//     SELLER:"seller"
// }
export const UserRoleValue = {
    ADMIN:"admin",
    CUSTOMER:"customer",
    SELLER : "seller"
    
} 
export interface SearchParams{
    page: number|1 ,
    limit: number|10,
    search?: string | null 

}