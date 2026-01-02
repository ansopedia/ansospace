import { Email, Username } from "./auth";
import { ObjectId } from "./common";

export interface UserAccessControlProfile {
  id: ObjectId; // Transformed to string for frontend
  username: Username;
  email: Email;
  roles: string[]; // e.g. ["admin", "editor"]
  permissions: string[]; // e.g. ["create-post", "delete-user"]
  hasPassword: boolean;
}
