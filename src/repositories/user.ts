import type { User } from "../domain/user/entity.ts"
import type { UserRepository} from "../domain/user/repository.js"


export function createUserRepository(): UserRepository {
    return {
        findById() {
             
        },
        findByEmail() {

        },
        createUser() {

        },
        safeUser() {

        }
    }
}