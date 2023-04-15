import { SetMetadata } from "@nestjs/common"
import {UserRole} from "../enum/UserRole"
export const REQUIRE_OWN_ID_KEY = "requireOwnId"
export const RequireOwnId = (allowAdmin: boolean) => SetMetadata("requireOwnId", {
    requireOwnId: true,
    allowAdmin: allowAdmin
})