import { ObjectId } from "./common";

export type UserConnectionEvent = {
  userId: ObjectId;
  timestamp: number;
};

export type UserUpdateEvent = {
  userId: ObjectId;
  updates: {
    field: string;
    value: unknown;
  }[];
};

export type NotificationEvent = {
  id: ObjectId;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: number;
};

export interface ServerToClientEvents {
  "user:connected": (event: UserConnectionEvent) => void;
  "user:disconnected": (event: UserConnectionEvent) => void;
  "user:updated": (event: UserUpdateEvent) => void;
  "notification:received": (event: NotificationEvent) => void;
  "role:updated": (data: { userId: ObjectId; roles: string[] }) => void;
}

export interface ClientToServerEvents {
  "profile:update": (data: unknown) => void;
  "role:update": (data: { roles: string[] }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: ObjectId;
}

export interface SocketUser {
  userId: ObjectId;
  socketId: string;
}
