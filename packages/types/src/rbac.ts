import { ObjectId } from "./common";

export interface UserAccessControlProfile {
  id: ObjectId; // Transformed to string for frontend
  username: string;
  email: string;
  roles: string[]; // e.g. ["admin", "editor"]
  permissions: string[]; // e.g. ["create-post", "delete-user"]
}
